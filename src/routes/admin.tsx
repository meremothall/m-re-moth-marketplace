import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";
import { CATEGORIES, LISTINGS, SELLERS, fcfa, listingsByCategory } from "@/lib/mall-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Meremoth Mall" },
      { name: "description", content: "Private admin area for Meremoth Mall." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — Meremoth Mall" },
      { property: "og:description", content: "Private admin area." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

const ADMIN_PASS = "MMM-DOUALA-2026";

const REVENUE = [
  { month: "Apr", revenue: 420000 },
  { month: "May", revenue: 610000 },
  { month: "Jun", revenue: 555000 },
  { month: "Jul", revenue: 780000 },
  { month: "Aug", revenue: 920000 },
  { month: "Sep", revenue: 1140000 },
];

function AdminPage() {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  if (!ok) {
    return (
      <MallShell title="Admin — Eceo only" back>
        <form
          className="mx-auto max-w-sm space-y-3 rounded-2xl bg-card p-5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === ADMIN_PASS) {
              setOk(true);
              setError("");
            } else setError("Wrong password.");
          }}
        >
          <h1 className="text-lg font-bold">Admin access</h1>
          <div className="space-y-1.5">
            <Label htmlFor="pass">Password</Label>
            <Input
              id="pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full rounded-2xl">
            Enter
          </Button>
          <p className="text-xs text-muted-foreground">
            This is a temporary password gate. Turning on real accounts gives Eceo a proper secure
            login.
          </p>
        </form>
      </MallShell>
    );
  }

  return (
    <MallShell title="Admin — Eceo" back>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Revenue (6 mo)" value={fcfa(4425000)} />
        <Stat label="Commission" value={fcfa(442500)} />
        <Stat label="Subscriptions" value="128 active" />
        <Stat label="Featured payments" value={fcfa(310000)} />
        <Stat label="Total users" value="3,412" />
        <Stat label="Total listings" value={String(LISTINGS.length * 96)} />
        <Stat label="Pending approvals" value="14" />
        <Stat label="Open reports" value="3" />
      </div>

      <div className="mt-4 rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="mb-3 font-bold">Revenue</h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={(v: number) => `${v / 1000}k`} />
              <ChartTooltip formatter={(v: number) => fcfa(v)} />
              <Bar dataKey="revenue" fill="var(--color-primary)" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Tabs defaultValue="categories" className="mt-4">
        <TabsList className="flex w-full flex-wrap">
          <TabsTrigger value="categories">Listings</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-3 grid gap-2 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c.id} className="rounded-2xl bg-card p-3 text-sm shadow-sm">
              <p className="font-semibold">{c.name}</p>
              <p className="text-muted-foreground">
                {listingsByCategory(c.id).length} live · {c.count} total
              </p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="sellers" className="mt-3 space-y-2">
          {Object.values(SELLERS).map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-2 rounded-2xl bg-card p-3 text-sm shadow-sm"
            >
              <span className="text-xl">{s.flag}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {s.country} · ⭐ {s.rating}
                </p>
              </div>
              {s.verified ? (
                <Badge className="bg-primary text-primary-foreground">Verified</Badge>
              ) : (
                <Badge className="bg-amber-500 text-white">Pending</Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                onClick={() => toast.success(`${s.name} approved.`)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-destructive"
                onClick={() => toast.success(`${s.name} rejected.`)}
              >
                Reject
              </Button>
              <Button
                size="sm"
                className="rounded-xl"
                onClick={() => toast.success("Payout sent via MoMo.")}
              >
                Pay out
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="approvals" className="mt-3 space-y-2">
          {["International seller — Global Tech Store (🇳🇬)", "Featured slot request — Douala Land & Homes", "Reported listing — duplicate land plot"].map(
            (t) => (
              <div
                key={t}
                className="flex items-center justify-between gap-2 rounded-2xl bg-card p-3 text-sm shadow-sm"
              >
                <span>{t}</span>
                <Button
                  size="sm"
                  className="rounded-xl"
                  onClick={() => toast.success("Handled.")}
                >
                  Review
                </Button>
              </div>
            ),
          )}
        </TabsContent>
      </Tabs>
    </MallShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-bold">{value}</p>
    </div>
  );
}
