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
import {
  agencyShipments,
  agencyStats,
  agencyUpdateShipment,
} from "@/lib/logistics.functions";
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
type Stats = Awaited<ReturnType<typeof agencyStats>>;

const STORE_KEY = "meremoth-agency-code";

function AgencyPortal() {
  const list = useServerFn(agencyShipments);
  const stats = useServerFn(agencyStats);
  const update = useServerFn(agencyUpdateShipment);
  const [code, setCode] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [rows, setRows] = useState<Shipment[]>([]);
  const [totals, setTotals] = useState<Stats | null>(null);
  const [plate, setPlate] = useState<Record<string, string>>({});
  const [driver, setDriver] = useState<Record<string, string>>({});

  const refresh = async (accessCode: string) => {
    const [data, numbers] = await Promise.all([
      list({ data: { code: accessCode } }),
      stats({ data: { code: accessCode } }),
    ]);
    setRows(data);
    setTotals(numbers);
    setSignedIn(true);
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORE_KEY);
    if (!saved) return;
    setCode(saved);
    refresh(saved).catch(() => localStorage.removeItem(STORE_KEY));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = () => {
    localStorage.removeItem(STORE_KEY);
    setSignedIn(false);
    setCode("");
    setRows([]);
    setTotals(null);
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
              await refresh(code.trim());
              localStorage.setItem(STORE_KEY, code.trim());
            } catch {
              toast.error("Wrong access code. Ask your branch manager for the staff code.");
            }
          }}
        >
          <Bus className="h-8 w-8 text-primary" />
          <h1 className="text-lg font-bold">Meremoth Agency Portal</h1>
          <p className="text-xs text-muted-foreground">Secured by Escrow — staff only</p>
          <div className="space-y-1.5">
            <Label htmlFor="code">Agency access code</Label>
            <Input
              id="code"
              type="password"
              placeholder="Enter agency code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={64}
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-2xl">Unlock agency portal</Button>
        </form>
      </MallShell>
    );
  }

  return (
    <MallShell title="Agency Portal" back>
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg font-bold">Agency dashboard</h1>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={signOut}>
          Log out
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
          <p className="text-xs opacity-80">Held in escrow</p>
          <p className="text-xl font-bold">{fcfaAmount(totals?.escrowBalance ?? 0)}</p>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Waiting at sellers</p>
          <p className="text-xl font-bold">{totals?.pendingAtSellers ?? 0}</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">Commission earned (500 FCFA per parcel)</p>
          <p className="text-xl font-bold text-primary">{fcfaAmount(totals?.commissionEarned ?? 0)}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{rows.length} parcels in the pipeline.</p>
      <div className="mt-3 space-y-3">
        {rows.length === 0 && (
          <div className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
            No parcels yet. New escrow orders appear here automatically.
          </div>
        )}
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
                  placeholder="Plate number e.g. CE 123 AB"
                  value={plate[s.id] ?? ""}
                  onChange={(e) => setPlate((p) => ({ ...p, [s.id]: e.target.value }))}
                  maxLength={20}
                />
                <Input
                  placeholder="Driver phone +237..."
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
                Mark arrived at {s.agency_branches?.city ?? "destination"}
              </Button>
            )}

            {s.status === "arrived_at_destination" && (
              <Button size="sm" className="mt-3 w-full rounded-xl" onClick={() => advance(s.id, "claimed_by_buyer")}>
                Mark claimed — release escrow +500 FCFA
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
