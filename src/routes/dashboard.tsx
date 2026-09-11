import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, MessageCircle, ShoppingBag, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";
import { LISTINGS, fcfa } from "@/lib/mall-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Seller Dashboard — Meremoth Mall" },
      {
        name: "description",
        content:
          "Track views, chats, sales and earnings, manage listings, orders and payouts on your Meremoth Mall seller dashboard.",
      },
      { property: "og:title", content: "Seller Dashboard — Meremoth Mall" },
      {
        property: "og:description",
        content: "Your listings, orders, earnings and payouts in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const MY_LISTINGS = LISTINGS.slice(0, 5);
const ORDERS = [
  { id: "ORD-1041", item: "Insulating Gloves 12kV", buyer: "Alain T.", total: 25000, status: "Awaiting delivery confirmation" },
  { id: "ORD-1040", item: "Modern 3-Bedroom House Plan", buyer: "Grace N.", total: 25000, status: "Completed" },
  { id: "ORD-1039", item: "Sparkle Clean — 4 hours", buyer: "Bertrand K.", total: 40000, status: "In escrow" },
];

function Dashboard() {
  const gross = 100000;
  const fee = gross * 0.1;

  return (
    <MallShell title="Seller Dashboard" back>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={<Eye className="h-4 w-4" />} label="Total Views" value="12,480" />
        <Stat icon={<MessageCircle className="h-4 w-4" />} label="Total Chats" value="317" />
        <Stat icon={<ShoppingBag className="h-4 w-4" />} label="Total Sales" value="86" />
        <Stat icon={<Wallet className="h-4 w-4" />} label="Balance" value={fcfa(437500)} />
      </div>

      <Tabs defaultValue="listings" className="mt-5">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-3 space-y-3">
          <Button asChild className="w-full rounded-2xl">
            <Link to="/add-listing">+ Add New Listing</Link>
          </Button>
          {MY_LISTINGS.map((l) => (
            <div key={l.id} className="rounded-2xl bg-card p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{l.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.title}</p>
                  <p className="text-sm font-bold text-primary">{fcfa(l.price)}</p>
                </div>
                {l.sponsored && <Badge className="bg-amber-500 text-white">Boosted</Badge>}
              </div>
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-xl" asChild>
                  <Link to="/add-listing">Edit</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-destructive"
                  onClick={() => toast.success("Listing deleted.")}
                >
                  Delete
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl"
                  onClick={() => toast.success("Boost activated: 2,000 FCFA for 3 days.")}
                >
                  Boost 2,000 FCFA / 3 days
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="orders" className="mt-3 space-y-3">
          {ORDERS.map((o) => (
            <div key={o.id} className="rounded-2xl bg-card p-4 shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">{o.item}</span>
                <span className="font-bold text-primary">{fcfa(o.total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {o.id} · Buyer {o.buyer}
              </p>
              <Badge variant="secondary" className="mt-2">
                {o.status}
              </Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="earnings" className="mt-3 space-y-3">
          <div className="rounded-2xl bg-card p-4 text-sm shadow-sm">
            <h2 className="font-bold">Commission breakdown</h2>
            <div className="mt-2 space-y-1">
              <Line label="You sold" value={fcfa(gross)} />
              <Line label="meremoth fee (10%)" value={`- ${fcfa(fee)}`} />
              <Line label="Platform fee (5% + 100 FCFA)" value={`- ${fcfa(gross * 0.05 + 100)}`} />
              <div className="border-t border-border pt-1">
                <Line label="You receive" value={fcfa(gross - fee - (gross * 0.05 + 100))} bold />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 text-sm shadow-sm">
            <h2 className="font-bold">Payout method</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {["MTN MoMo", "Orange Money", "PayPal", "Paystack"].map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => toast.success(`Payout requested via ${m}.`)}
                >
                  {m}
                </Button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Escrow: the buyer pays Meremoth Mall, we hold the money, and release it to you after
              the buyer confirms delivery — minus commission.
            </p>
          </div>
          <Button asChild variant="outline" className="w-full rounded-2xl">
            <Link to="/pricing">Boost & Subscription plans</Link>
          </Button>
        </TabsContent>
      </Tabs>
    </MallShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-sm">
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-primary" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
