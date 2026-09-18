import { createFileRoute } from "@tanstack/react-router";
import { releaseEscrow } from "@/lib/logistics.functions";

/** Called on a schedule: releases escrow 48h after a buyer claimed the parcel. */
export const Route = createFileRoute("/api/public/logistics/auto-release")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["LOVABLE_CRON_SECRET"];
        const provided = request.headers.get("x-cron-secret");
        if (!secret || provided !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

        const { data: rows } = await supabaseAdmin
          .from("shipments")
          .select("id, buyer_id, seller_id, amount, agency_id")
          .eq("status", "claimed_by_buyer")
          .eq("escrow_held", true)
          .lt("claimed_at", cutoff)
          .limit(50);

        for (const shipment of rows ?? []) {
          await releaseEscrow(supabaseAdmin, shipment);
        }

        return Response.json({ released: rows?.length ?? 0 });
      },
    },
  },
});
