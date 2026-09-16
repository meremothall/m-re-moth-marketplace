import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Seller Plans, Boost & Commission — Meremoth Mall" },
      {
        name: "description",
        content:
          "Free, Basic 5,000 FCFA, Pro 15,000 FCFA and Premium 30,000 FCFA monthly plans, plus listing boost from 2,000 FCFA for 3 days.",
      },
      { property: "og:title", content: "Seller Plans & Boost — Meremoth Mall" },
      {
        property: "og:description",
        content: "Unlimited listings, PRO badge, top search and homepage featuring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  { name: "Free Plan", price: "0 FCFA", features: ["3 listings", "In-app buyer chat", "Basic support"] },
  {
    name: "Basic",
    price: "5,000 FCFA/month",
    features: ["50 listings", "In-app chat", "Standard search placement"],
  },
  {
    name: "Pro",
    price: "15,000 FCFA/month",
    highlight: true,
    features: [
      "Unlimited listings",
      "Green PRO badge",
      "Top search placement",
      "Priority in-app chat",
      "Verified after ID check",
    ],
  },
  {
    name: "Premium",
    price: "30,000 FCFA/month",
    features: [
      "Homepage featured slot",
      "Verified badge",
      "Priority support",
      "0% commission first month",
    ],
  },
];

function Pricing() {
  return (
    <MallShell title="Plans & Boost" back>
      <h1 className="text-2xl font-bold">Boost & Subscription</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Platform fee 5% + 100 FCFA per transaction, plus 10% sales commission (waived the first
        month on Premium). Pay with MTN MoMo, Orange Money, PayPal or Paystack.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`rounded-2xl bg-card p-4 shadow-sm ${
              p.highlight ? "ring-2 ring-primary" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold">{p.name}</h2>
              {p.highlight && <Badge className="bg-primary text-primary-foreground">Popular</Badge>}
            </div>
            <p className="mt-1 text-xl font-extrabold text-primary">{p.price}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full rounded-2xl"
              variant={p.highlight ? "default" : "outline"}
              onClick={() => toast.success(`${p.name} selected. Choose MoMo, Orange Money or PayPal.`)}
            >
              Choose {p.name}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="font-bold">Boost a listing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sponsored placement at the top of its category and on the homepage.
        </p>
        <Button
          className="mt-3 rounded-2xl"
          onClick={() => toast.success("Boost activated for 3 days.")}
        >
          Boost this listing for 2,000 FCFA for 3 days
        </Button>
      </div>

      <div className="mt-5 rounded-2xl bg-secondary p-4 text-sm">
        <h2 className="font-bold">Seller badges</h2>
        <p className="mt-1 text-muted-foreground">
          🇨🇲 Verified Cameroon Seller (green) for +237 sellers with ID — they rank higher in search.
          🇳🇬 🇬🇭 International Seller (yellow) with country flag, approved by meremoth admin.
        </p>
      </div>
    </MallShell>
  );
}
