import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CINETPAY_API_URL =
  process.env["CINETPAY_API_URL"] ?? "https://api-checkout.cinetpay.com/v2";

export type WalletSummary = {
  balance: number;
  currency: string;
  transactions: {
    id: string;
    type: string;
    amount: number;
    status: string;
    description: string | null;
    created_at: string;
  }[];
};

export const getWallet = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<WalletSummary> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;

    const { data: wallet } = await supabaseAdmin
      .from("wallets")
      .select("balance, currency")
      .eq("user_id", userId)
      .maybeSingle();

    if (!wallet) {
      await supabaseAdmin.from("wallets").insert({ user_id: userId });
    }

    const { data: txs } = await supabaseAdmin
      .from("wallet_transactions")
      .select("id, type, amount, status, description, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    return {
      balance: Number(wallet?.balance ?? 0),
      currency: wallet?.currency ?? "XAF",
      transactions: (txs ?? []).map((t) => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        status: t.status,
        description: t.description,
        created_at: t.created_at,
      })),
    };
  });

export const initTopup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { amount: number; origin: string; customerName?: string }) =>
    z
      .object({
        amount: z.number().int().min(500).max(5_000_000),
        origin: z.string().url(),
        customerName: z.string().trim().max(100).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const apiKey = process.env["CINETPAY_API_KEY"];
    const siteId = process.env["CINETPAY_SITE_ID"];
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const transactionId = `MM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const { error } = await supabaseAdmin.from("wallet_transactions").insert({
      user_id: context.userId,
      type: "topup",
      amount: data.amount,
      status: "pending",
      cinetpay_transaction_id: transactionId,
      description: "Wallet top up",
    });
    if (error) throw new Error(error.message);

    if (!apiKey || !siteId) {
      return {
        ok: false as const,
        transactionId,
        message: "Payment provider is not configured yet.",
      };
    }

    const response = await fetch(`${CINETPAY_API_URL}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: apiKey,
        site_id: siteId,
        transaction_id: transactionId,
        amount: data.amount,
        currency: "XAF",
        description: "Meremoth Mall wallet top up",
        notify_url: `${data.origin}/api/public/wallet/cinetpay-notify`,
        return_url: `${data.origin}/wallet`,
        channels: "ALL",
        customer_name: data.customerName ?? "Meremoth buyer",
        customer_email: context.claims?.email ?? "buyer@meremothmall.com",
      }),
    });

    const body = (await response.json()) as {
      code?: string;
      message?: string;
      data?: { payment_url?: string };
    };

    if (!response.ok || !body.data?.payment_url) {
      throw new Error(`CinetPay init failed [${response.status}]: ${body.message ?? "unknown error"}`);
    }

    return { ok: true as const, transactionId, paymentUrl: body.data.payment_url };
  });

export const payFromWallet = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { amount: number; description: string }) =>
    z
      .object({
        amount: z.number().int().min(1).max(5_000_000),
        description: z.string().trim().min(1).max(200),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: wallet } = await supabaseAdmin
      .from("wallets")
      .select("balance")
      .eq("user_id", context.userId)
      .maybeSingle();

    const balance = Number(wallet?.balance ?? 0);
    if (balance < data.amount) {
      return { ok: false as const, message: "Not enough balance. Please top up." };
    }

    await supabaseAdmin
      .from("wallets")
      .update({ balance: balance - data.amount, updated_at: new Date().toISOString() })
      .eq("user_id", context.userId);

    await supabaseAdmin.from("wallet_transactions").insert({
      user_id: context.userId,
      type: "payment",
      amount: data.amount,
      status: "success",
      description: data.description,
    });

    return { ok: true as const, balance: balance - data.amount };
  });
