import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";
import { CATEGORIES, CITIES, COUNTRIES, SELLER_TYPES } from "@/lib/mall-data";

export const Route = createFileRoute("/become-seller")({
  head: () => ({
    meta: [
      { title: "Become a Seller on Meremoth Mall — Earn Money" },
      {
        name: "description",
        content:
          "Register as a product seller, service provider, consultant, builder, agent, dealer, employer, restaurant or educator on Meremoth Mall Cameroon.",
      },
      { property: "og:title", content: "Become a Seller on Meremoth Mall" },
      {
        property: "og:description",
        content: "Free plan available. Sell to buyers in Cameroon and worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BecomeSeller,
});

function BecomeSeller() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("Cameroon");
  const code = COUNTRIES.find((c) => c.name === country)?.code ?? "+237";

  return (
    <MallShell title="Become a Seller" back>
      <h1 className="text-2xl font-bold">Become a Seller on meremoth mall — Earn Money</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Free plan to start. Upgrade any time for more listings, PRO badge and top search placement.
      </p>

      <form
        className="mt-5 space-y-4 rounded-2xl bg-card p-4 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Application received. Welcome to your seller dashboard.");
          void navigate({ to: "/dashboard" });
        }}
      >
        <div className="space-y-1.5">
          <Label>Seller Type</Label>
          <Select defaultValue={SELLER_TYPES[0]!}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SELLER_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fullname">Full Name</Label>
          <Input id="fullname" required maxLength={100} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="wa">WhatsApp Number</Label>
          <div className="flex gap-2">
            <span className="flex items-center rounded-xl border border-input px-3 text-sm">
              {code}
            </span>
            <Input id="wa" type="tel" required maxLength={20} placeholder="653779134" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.flag} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Location / City</Label>
          <Select defaultValue="Douala">
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="business">Business Name</Label>
          <Input id="business" maxLength={100} />
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select defaultValue={CATEGORIES[0]!.id}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" maxLength={1000} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="idcard">ID Card upload</Label>
          <Input id="idcard" type="file" accept="image/*,.pdf" />
          <p className="text-xs text-muted-foreground">
            Needed for the Verified badge. Cameroon numbers (+237) get 🇨🇲 Verified Cameroon Seller;
            other countries get the International Seller badge after admin approval.
          </p>
        </div>

        <Button type="submit" className="w-full rounded-2xl">
          Create seller account
        </Button>
      </form>
    </MallShell>
  );
}
