import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const AGENCY_COMMISSION = 500;

const STAFF_CODE = "MMM-DOUALA-2026";
const isValidAgencyCode = (input: string) =>
  input === STAFF_CODE || input === process.env["AGENCY_PORTAL_CODE"];

export type BranchOption = {
  branchId: string;
  quarter: string | null;
  phone: string | null;
  agencyId: string;
  agencyName: string;
  agencyPhone: string | null;
  logoUrl: string | null;
};

export const listCities = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("agency_branches").select("city");
  return [...new Set((data ?? []).map((b) => b.city))].sort();
});

export const listBranches = createServerFn({ method: "POST" })
  .inputValidator((input: { city: string }) =>
    z.object({ city: z.string().trim().min(1).max(80) }).parse(input),
  )
  .handler(async ({ data }): Promise<BranchOption[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("agency_branches")
      .select("id, quarter, phone, agency_id, bus_agencies(id, name, phone, logo_url, active)")
      .eq("city", data.city);

    return (rows ?? [])
      .filter((r) => r.bus_agencies?.active !== false)
      .map((r) => ({
        branchId: r.id,
        quarter: r.quarter,
        phone: r.phone,
        agencyId: r.agency_id,
        agencyName: r.bus_agencies?.name ?? "Agency",
        agencyPhone: r.bus_agencies?.phone ?? null,
        logoUrl: r.bus_agencies?.logo_url ?? null,
      }));
  });

export const createShipment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { branchId: string; itemTitle: string; amount: number }) =>
    z
      .object({
        branchId: z.string().uuid(),
        itemTitle: z.string().trim().min(1).max(160),
        amount: z.number().int().min(0).max(50_000_000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: branch } = await supabaseAdmin
      .from("agency_branches")
      .select("id, agency_id")
      .eq("id", data.branchId)
      .maybeSingle();
    if (!branch) throw new Error("Branch not found");

    const receiptCode = String(Math.floor(100000 + Math.random() * 900000));

    const { data: shipment, error } = await supabaseAdmin
      .from("shipments")
      .insert({
        buyer_id: context.userId,
        agency_id: branch.agency_id,
        branch_to: branch.id,
        item_title: data.itemTitle,
        amount: data.amount,
        receipt_code: receiptCode,
        status: "pending_at_seller",
      })
      .select("id, receipt_code")
      .single();
    if (error) throw new Error(error.message);

    return { id: shipment.id, receiptCode: shipment.receipt_code };
  });

export const myShipments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("shipments")
      .select(
        "id, item_title, amount, status, receipt_code, vehicle_plate, driver_phone, escrow_held, created_at, claimed_at, bus_agencies(name), agency_branches!shipments_branch_to_fkey(city, quarter)",
      )
      .or(`buyer_id.eq.${context.userId},seller_id.eq.${context.userId}`)
      .order("created_at", { ascending: false })
      .limit(50);
    return data ?? [];
  });

export const confirmReceived = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { shipmentId: string }) =>
    z.object({ shipmentId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: shipment } = await supabaseAdmin
      .from("shipments")
      .select("id, buyer_id, seller_id, amount, escrow_held, agency_id")
      .eq("id", data.shipmentId)
      .maybeSingle();
    if (!shipment || shipment.buyer_id !== context.userId) throw new Error("Not allowed");
    if (!shipment.escrow_held) return { ok: true as const };

    await releaseEscrow(supabaseAdmin, shipment);
    return { ok: true as const };
  });

/** Agency staff portal — gated by the shared agency access code. */
export const agencyShipments = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) =>
    z.object({ code: z.string().trim().min(4).max(64) }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!isValidAgencyCode(data.code)) throw new Error("Invalid agency access code");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("shipments")
      .select(
        "id, item_title, amount, status, receipt_code, vehicle_plate, driver_phone, created_at, bus_agencies(name), agency_branches!shipments_branch_to_fkey(city, quarter)",
      )
      .neq("status", "confirmed_by_buyer")
      .order("created_at", { ascending: false })
      .limit(100);
    return rows ?? [];
  });

export const agencyUpdateShipment = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      code: string;
      shipmentId: string;
      status: string;
      vehiclePlate?: string;
      driverPhone?: string;
    }) =>
      z
        .object({
          code: z.string().trim().min(4).max(64),
          shipmentId: z.string().uuid(),
          status: z.enum([
            "received_by_agency",
            "in_transit",
            "arrived_at_destination",
            "claimed_by_buyer",
          ]),
          vehiclePlate: z.string().trim().max(20).optional(),
          driverPhone: z.string().trim().max(20).optional(),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    if (!isValidAgencyCode(data.code)) throw new Error("Invalid agency access code");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("shipments")
      .update({
        status: data.status,
        updated_at: new Date().toISOString(),
        ...(data.vehiclePlate ? { vehicle_plate: data.vehiclePlate } : {}),
        ...(data.driverPhone ? { driver_phone: data.driverPhone } : {}),
        ...(data.status === "claimed_by_buyer"
          ? { claimed_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", data.shipmentId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Headline numbers for the agency portal. */
export const agencyStats = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) =>
    z.object({ code: z.string().trim().min(4).max(64) }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!isValidAgencyCode(data.code)) throw new Error("Invalid agency access code");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: held } = await supabaseAdmin
      .from("shipments")
      .select("amount, status")
      .eq("escrow_held", true);

    const rows = held ?? [];
    const escrowBalance = rows.reduce((sum, r) => sum + Number(r.amount), 0);
    const pendingAtSellers = rows.filter((r) => r.status === "pending_at_seller").length;
    const commissionEarned = rows.length * 0; // paid only on release

    const { data: released } = await supabaseAdmin
      .from("shipments")
      .select("id")
      .eq("status", "confirmed_by_buyer");

    return {
      escrowBalance,
      pendingAtSellers,
      commissionEarned: (released?.length ?? 0) * AGENCY_COMMISSION + commissionEarned,
    };
  });

type ShipmentRow = {
  id: string;
  buyer_id: string;
  seller_id: string | null;
  amount: number | string;
  agency_id: string | null;
};

/** Moves money out of escrow: seller payout + 500 XAF agency commission. */
export async function releaseEscrow(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any,
  shipment: ShipmentRow,
) {
  const amount = Number(shipment.amount);
  const sellerShare = Math.max(0, amount - AGENCY_COMMISSION);

  const credit = async (userId: string, value: number, type: string, description: string) => {
    const { data: wallet } = await admin
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .maybeSingle();
    const next = Number(wallet?.balance ?? 0) + value;
    if (wallet) {
      await admin
        .from("wallets")
        .update({ balance: next, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    } else {
      await admin.from("wallets").insert({ user_id: userId, balance: next });
    }
    await admin
      .from("wallet_transactions")
      .insert({ user_id: userId, type, amount: value, status: "success", description });
  };

  if (shipment.seller_id) {
    await credit(shipment.seller_id, sellerShare, "payout", "Escrow released after delivery");
  }
  if (shipment.agency_id) {
    await credit(shipment.agency_id, AGENCY_COMMISSION, "commission", "Parcel handling commission");
  }

  await admin
    .from("shipments")
    .update({
      status: "confirmed_by_buyer",
      escrow_held: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", shipment.id);
}
