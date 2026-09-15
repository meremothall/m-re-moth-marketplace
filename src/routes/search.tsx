import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MallShell } from "@/components/mall/Chrome";
import { ListingCard } from "./index";
import { CATEGORIES, CITIES, LISTINGS, SELLERS, type CategoryId } from "@/lib/mall-data";

type SearchParams = { category?: CategoryId; q?: string };

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    ...(typeof s["category"] === "string" ? { category: s["category"] as CategoryId } : {}),
    ...(typeof s["q"] === "string" ? { q: s["q"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Search Products, Services & Property — Meremoth Mall" },
      {
        name: "description",
        content:
          "Filter listings by price, location, category, condition, verified sellers and delivery time on Meremoth Mall Cameroon.",
      },
      { property: "og:title", content: "Search — Meremoth Mall" },
      {
        property: "og:description",
        content: "Find products, services, land, vehicles, jobs and food across Cameroon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const [category, setCategory] = useState<CategoryId | "all">(search.category ?? "all");
  const [city, setCity] = useState("All");
  const [condition, setCondition] = useState("All");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [proOnly, setProOnly] = useState(false);
  const [internationalOnly, setInternationalOnly] = useState(false);
  const [vehicleType, setVehicleType] = useState("All");
  const [transportService, setTransportService] = useState("All");

  const results = LISTINGS.filter((l) => {
    const seller = SELLERS[l.sellerId]!;
    if (q && !`${l.title} ${l.sub} ${l.description}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    if (category !== "all" && l.category !== category) return false;
    if (category === "transport") {
      if (vehicleType !== "All" && l.vehicleType !== vehicleType) return false;
      if (transportService !== "All" && l.transportService !== transportService) return false;
    }
    if (city !== "All" && !l.location.includes(city)) return false;
    if (condition !== "All" && l.condition !== condition) return false;
    if (min && l.price < Number(min)) return false;
    if (max && l.price > Number(max)) return false;
    if (verifiedOnly && !seller.verified) return false;
    if (proOnly && !seller.pro) return false;
    if (internationalOnly && seller.country === "Cameroon") return false;
    return true;
  });

  return (
    <MallShell title="Search" back>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, services, properties, jobs, vehicles..."
          className="rounded-2xl bg-card pl-9"
        />
      </div>

      <div className="mt-3 space-y-3 rounded-2xl bg-card p-4 shadow-sm">
        <p className="font-semibold">Filters</p>
        <div className="flex flex-wrap gap-2">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            All categories
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
              {c.name}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...CITIES].map((c) => (
            <Chip key={c} active={city === c} onClick={() => setCity(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Brand New", "Okaza / Second Hand", "Service"].map((c) => (
            <Chip key={c} active={condition === c} onClick={() => setCondition(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="min">Min price (FCFA)</Label>
            <Input id="min" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="max">Max price (FCFA)</Label>
            <Input id="max" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={verifiedOnly} onClick={() => setVerifiedOnly(!verifiedOnly)}>
            Verified
          </Chip>
          <Chip active={proOnly} onClick={() => setProOnly(!proOnly)}>
            PRO
          </Chip>
          <Chip active={internationalOnly} onClick={() => setInternationalOnly(!internationalOnly)}>
            International
          </Chip>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{results.length} results</p>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {results.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No listing matches these filters yet.
        </p>
      )}
    </MallShell>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      size="sm"
      variant={active ? "default" : "outline"}
      className="rounded-full"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
