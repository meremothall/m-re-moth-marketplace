import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MallShell } from "@/components/mall/Chrome";
import { agencyShipments, agencyUpdateShipment } from "@/lib/logistics.functions";
import { fcfaAmount } from "@/lib/session";

export const Route = createFileRoute("/agency-login")({
  head: () => ({
    meta: [
      { title: "Bus Agency Portal — Meremoth Mall" },
      {
        name: "description",
        content:
          "Bus agency staff portal: confirm parcels received, record vehicle plate and driver, mark arrivals and hand over to buyers.",
      },
      { property: "og:title", content: "Bus Agency Portal — Meremoth Mall" },
      { property: "og:description", content: "Manage Meremoth Mall parcels moving between cities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgencyPortal,
});

type Shipment = Awaited<ReturnType<typeof agencyShipments>>[number];

function AgencyPortal() {
  const list = useServerFn(agencyShipments);
  const update = useServerFn(agencyUpdateShipment);
  const [code, setCode] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [rows, setRows] = useState<Shipment[]>([]);
  const [plate, setPlate] = useState<Record<string, string>>({});
  const [driver, setDriver] = useState<Record<string, string>>({});

  const refresh = async (accessCode: string) => {
    const data = await list({ data: { code: accessCode } });
    setRows(data);
    setSignedIn(true);
  };

  const advance = async (
    id: string,
    status: "received_by_agency" | "in_transit" | "arrived_at_destination" | "claimed_by_buyer",
  ) => {
    try {
      await update({
        data: {
          code,
          shipmentId: id,
          status,
          ...(plate[id] ? { vehiclePlate: plate[id] } : {}),
          ...(driver[id] ? { driverPhone: driver[id] } : {}),
        },
      });
      toast.success("Parcel updated. The buyer has been notified in the app.");
      await refresh(code);
    } catch {
      toast.error("Update failed. Check your access code.");
    }
  };

  if (!signedIn) {
    return (
      <MallShell title="Agency Portal" back>
        <form
          className="mx-auto max-w-sm space-y-3 rounded-2xl bg-card p-5 shadow-sm"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await refresh(code);
            } catch {
              toast.error("Invalid agency access code.");
            }
          }}
        >
          <Bus className="h-8 w-8 text-primary" />
          <h1 className="text-lg font-bold">Bus agency staff login</h1>
          <div className="space-y-1.5">
            <Label htmlFor="code">Agency access code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={64} required />
          </div>
          <Button type="submit" className="w-full rounded-2xl">Enter portal</Button>
        </form>
      </MallShell>
    );
  }

  return (
    <MallShell title="Agency Portal" back>
      <p className="text-sm text-muted-foreground">{rows.length} parcels in the pipeline.</p>
      <div className="mt-3 space-y-3">
        {rows.map((s) => (
          <div key={s.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold">{s.item_title}</p>
                <p className="text-xs text-muted-foreground">
                  Receipt code {s.receipt_code} · {s.bus_agencies?.name} ·{" "}
                  {s.agency_branches?.city} {s.agency_branches?.quarter}
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold text-primary">{fcfaAmount(Number(s.amount))}</p>
            </div>
            <Badge variant="secondary" className="mt-2 capitalize">{s.status.replaceAll("_", " ")}</Badge>

            {s.status === "pending_at_seller" && (
              <Button size="sm" className="mt-3 w-full rounded-xl" onClick={() => advance(s.id, "received_by_agency")}>
                Confirm parcel received
              </Button>
            )}

            {s.status === "received_by_agency" && (
              <div className="mt-3 space-y-2">
                <Input
                  placeholder="Vehicle plate"
                  value={plate[s.id] ?? ""}
                  onChange={(e) => setPlate((p) => ({ ...p, [s.id]: e.target.value }))}
                  maxLength={20}
                />
                <Input
                  placeholder="Driver phone"
                  value={driver[s.id] ?? ""}
                  onChange={(e) => setDriver((p) => ({ ...p, [s.id]: e.target.value }))}
                  maxLength={20}
                />
                <Button size="sm" className="w-full rounded-xl" onClick={() => advance(s.id, "in_transit")}>
                  Send on the road
                </Button>
              </div>
            )}

            {s.status === "in_transit" && (
              <Button size="sm" className="mt-3 w-full rounded-xl" onClick={() => advance(s.id, "arrived_at_destination")}>
                Mark arrived
              </Button>
            )}

            {s.status === "arrived_at_destination" && (
              <Button size="sm" className="mt-3 w-full rounded-xl" onClick={() => advance(s.id, "claimed_by_buyer")}>
                Claimed by owner
              </Button>
            )}

            {s.status === "claimed_by_buyer" && (
              <p className="mt-3 text-xs text-muted-foreground">
                Waiting for the buyer to confirm. Funds release automatically after 48 hours.
              </p>
            )}
          </div>
        ))}
      </div>
    </MallShell>
  );
}
