import { createFileRoute } from "@tanstack/react-router";

const CINETPAY_API_URL =
  process.env["CINETPAY_API_URL"] ?? "https://api-checkout.cinetpay.com/v2";

async function readTransactionId(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await request.json()) as Record<string, unknown>;
    return String(body["cpm_trans_id"] ?? body["transaction_id"] ?? "");
  }
  const form = await request.formData();
  return String(form.get("cpm_trans_id") ?? form.get("transaction_id") ?? "");
}

export const Route = createFileRoute("/api/public/wallet/cinetpay-notify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["CINETPAY_API_KEY"];
        const siteId = process.env["CINETPAY_SITE_ID"];
        if (!apiKey || !siteId) {
          return new Response("Payment provider not configured", { status: 503 });
        }

        const transactionId = await readTransactionId(request);
        if (!transactionId) return new Response("Missing transaction id", { status: 400 });

        // Verify with CinetPay — never trust the callback payload itself.
        const check = await fetch(`${CINETPAY_API_URL}/payment/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apikey: apiKey, site_id: siteId, transaction_id: transactionId }),
        });
        const result = (await check.json()) as {
          code?: string;
          message?: string;
          data?: { status?: string; amount?: string | number };
        };

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: tx } = await supabaseAdmin
          .from("wallet_transactions")
          .select("id, user_id, amount, status")
          .eq("cinetpay_transaction_id", transactionId)
          .maybeSingle();

        if (!tx) return new Response("Unknown transaction", { status: 404 });
        if (tx.status === "success") return new Response("ok");

        const accepted = result.code === "00" && result.data?.status === "ACCEPTED";
        if (!accepted) {
          await supabaseAdmin
            .from("wallet_transactions")
            .update({ status: "failed" })
            .eq("id", tx.id);
          return new Response("ok");
        }

        const { data: wallet } = await supabaseAdmin
          .from("wallets")
          .select("balance")
          .eq("user_id", tx.user_id)
          .maybeSingle();

        const nextBalance = Number(wallet?.balance ?? 0) + Number(tx.amount);
        if (wallet) {
          await supabaseAdmin
            .from("wallets")
            .update({ balance: nextBalance, updated_at: new Date().toISOString() })
            .eq("user_id", tx.user_id);
        } else {
          await supabaseAdmin
            .from("wallets")
            .insert({ user_id: tx.user_id, balance: nextBalance });
        }

        await supabaseAdmin
          .from("wallet_transactions")
          .update({ status: "success" })
          .eq("id", tx.id);

        return new Response("ok");
      },
    },
  },
});
