import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { confirmReceived, myShipments } from "@/lib/logistics.functions";
import { fcfaAmount, useSessionUser } from "@/lib/session";

type Shipment = Awaited<ReturnType<typeof myShipments>>[number];

const LABEL: Record<string, string> = {
  pending_at_seller: "Waiting for the seller to drop the parcel",
  received_by_agency: "Received by the agency",
  in_transit: "On the road",
  arrived_at_destination: "Arrived — go and collect",
  claimed_by_buyer: "Collected — please confirm",
  confirmed_by_buyer: "Completed",
};

export function Deliveries() {
  const { user } = useSessionUser();
  const load = useServerFn(myShipments);
  const confirm = useServerFn(confirmReceived);
  const [rows, setRows] = useState<Shipment[]>([]);

  useEffect(() => {
    if (!user) return;
    load().then(setRows).catch(() => undefined);
  }, [user, load]);

  if (!user) return <p className="text-sm text-muted-foreground">Sign in to follow your deliveries.</p>;
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">No deliveries yet.</p>;

  return (
    <div className="space-y-3">
      {rows.map((s) => (
        <div key={s.id} className="rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex justify-between gap-2">
            <p className="min-w-0 truncate font-semibold">{s.item_title}</p>
            <p className="shrink-0 font-bold text-primary">{fcfaAmount(Number(s.amount))}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {s.bus_agencies?.name} · {s.agency_branches?.city} {s.agency_branches?.quarter} · Receipt code{" "}
            <span className="font-bold text-foreground">{s.receipt_code}</span>
            {s.vehicle_plate ? ` · Vehicle ${s.vehicle_plate}` : ""}
          </p>
          <Badge variant="secondary" className="mt-2">{LABEL[s.status] ?? s.status}</Badge>
          {s.status === "claimed_by_buyer" && s.escrow_held && (
            <Button
              size="sm"
              className="mt-3 w-full rounded-xl"
              onClick={async () => {
                await confirm({ data: { shipmentId: s.id } });
                toast.success("Thank you — the seller has been paid.");
                setRows(await load());
              }}
            >
              Confirm I received the correct item
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
