import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import * as Icons from "lucide-react";
import {
  BadgeCheck,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  Megaphone,
  MessageCircle,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MallShell } from "@/components/mall/Chrome";
import { CheckoutDrawer } from "@/components/mall/CheckoutDrawer";
import {
  CATEGORIES,
  DOUALA_AREAS,
  LISTINGS,
  SELLERS,
  TOP_PAINTERS,
  fcfa,
  listingsByCategory,
  type Listing,
} from "@/lib/mall-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meremoth Mall — Global Marketplace" },
      {
        name: "description",
        content:
          "Buy, sell and hire worldwide with private chat and secure escrow protection on Meremoth Mall.",
      },
      { property: "og:title", content: "Meremoth Mall — Global Marketplace" },
      {
        property: "og:description",
        content:
          "Verified Cameroonian sellers, in-app chat, and secure escrow shopping across Douala.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

export function ListingCard({ listing }: { listing: Listing }) {
  const seller = SELLERS[listing.sellerId];
  const tierClass = seller?.tier === "Gold" ? "text-amber-600" : seller?.tier === "Blue" ? "text-sky-600" : "text-muted-foreground";

  return (
    <Card className="overflow-hidden border-border shadow-sm transition hover:shadow-md">
      <Link to="/listing/$id" params={{ id: listing.id }}>
        <div className="relative flex h-28 items-center justify-center bg-secondary text-5xl">
          {listing.emoji}
          <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground shadow">✓ Escrow Protected</span>
          <Heart className="absolute right-2 top-2 h-5 w-5 text-muted-foreground" />
          {listing.sponsored && <Badge className="absolute bottom-2 left-2 bg-amber-500 text-primary-foreground">Sponsored</Badge>}
        </div>
      </Link>
      <CardContent className="space-y-2 p-3">
        <Link to="/listing/$id" params={{ id: listing.id }} className="block">
          <p className="line-clamp-2 text-sm font-semibold leading-tight">{listing.title}</p>
          <p className="mt-1 text-base font-extrabold text-foreground">{fcfa(listing.price)}{listing.priceUnit ?? ""}</p>
        </Link>
        <p className="line-clamp-2 text-[11px] font-semibold">
          {seller?.name} <span className={tierClass}>✓ {seller?.tier}</span> · <span className="text-muted-foreground">{seller?.area}</span>
        </p>
        <div className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{listing.condition}</span>
          <span>{listing.stock ? `${listing.stock} in stock` : "In stock"}</span>
        </div>
        {listing.amenities && <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground">{listing.amenities.slice(0,3).map((a)=><span key={a} className="rounded-full bg-secondary px-2 py-0.5">{a}</span>)}</div>}
        <div className="flex gap-2 pt-1">
          <Button asChild size="sm" variant="outline" className="min-w-0 flex-1 rounded-lg px-2 text-xs"><Link to="/chat/$sellerId" params={{ sellerId: seller?.id ?? listing.sellerId }}><MessageCircle className="mr-1 h-3.5 w-3.5" />Chat Seller</Link></Button>
          <CheckoutDrawer listing={listing} />
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: Listing[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-7">
      <div className="mb-2 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <Link to="/search" className="text-sm text-primary hover:underline">
          See all
        </Link>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {items.map((l) => (
          <div key={l.id} className="w-44 shrink-0">
            <ListingCard listing={l} />
          </div>
        ))}
      </div>
    </section>
  );
}

const PLACE_PILLS = ["All", "Akwa", "Bonapriso", "Bonaberi", "Deido", "Bonanjo", "Bali"] as const;

function Home() {
  const [condition, setCondition] = useState<"All" | "Brand New" | "Okaza / Second Hand">("All");
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<string>("All");
  const [sort, setSort] = useState<"none" | "price" | "nearest">("none");

  const filter = (items: Listing[]) => {
    const out = items.filter((l) => {
      if (condition !== "All" && l.condition !== condition) return false;
      if (query.trim() !== "" && !l.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (place === "Hotels") return l.category === "hotels";
      if (place === "Transport") return l.category === "transport";
      if (place !== "All" && !l.location.includes(place)) return false;
      return true;
    });
    if (sort === "price") return [...out].sort((a, b) => a.price - b.price);
    if (sort === "nearest") {
      const near = place === "All" || place === "Hotels" || place === "Transport" ? "Douala" : place;
      return [...out].sort(
        (a, b) => Number(b.location.includes(near)) - Number(a.location.includes(near)),
      );
    }
    return out;
  };


  return (
    <MallShell>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, services, properties, jobs, vehicles..."
            className="rounded-2xl bg-card pl-9"
          />
        </div>
        <Button asChild variant="outline" size="icon" className="rounded-2xl">
          <Link to="/search" aria-label="Filters">
            <SlidersHorizontal className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {[...PLACE_PILLS, "Hotels", "Transport"].map((p) => (
          <Button
            key={p}
            size="sm"
            variant={place === p ? "default" : "outline"}
            className="shrink-0 rounded-full"
            onClick={() => setPlace(p)}
          >
            {p}
          </Button>
        ))}
        <Button
          size="sm"
          variant={sort === "price" ? "default" : "outline"}
          className="shrink-0 rounded-full"
          onClick={() => setSort(sort === "price" ? "none" : "price")}
        >
          Sort by: Price Low-High
        </Button>
        <Button
          size="sm"
          variant={sort === "nearest" ? "default" : "outline"}
          className="shrink-0 rounded-full"
          onClick={() => setSort(sort === "nearest" ? "none" : "nearest")}
        >
          Sort by: Nearest
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(["All", "Brand New", "Okaza / Second Hand"] as const).map((c) => (
          <Button
            key={c}
            size="sm"
            variant={condition === c ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setCondition(c)}
          >
            {c === "Okaza / Second Hand" ? "Okaza / Second Hand" : c}
          </Button>
        ))}
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-bold">Categories</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link to="/find-for-me" className="relative flex flex-col items-center gap-1 rounded-2xl bg-card p-3 text-center shadow-sm transition hover:shadow-md">
            <Badge className="absolute -right-1 -top-2 bg-amber-500 text-primary-foreground"><Megaphone className="mr-1 h-3 w-3" />Find For Me</Badge>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary"><Megaphone className="h-5 w-5 text-amber-600" /></span>
            <span className="text-xs font-semibold leading-tight">Find For Me</span><span className="text-[10px] text-muted-foreground">12 new</span>
          </Link>
          {CATEGORIES.map((c) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[c.icon] ?? Icons.Tag;
            if (c.id === "jobs") {
              return (
                <Link key={c.id} to="/jobs" className="relative flex flex-col items-center gap-1 rounded-2xl bg-card p-3 text-center shadow-sm transition hover:shadow-md">
                  <Badge className="absolute -right-1 -top-2 bg-primary text-primary-foreground">NEW</Badge>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">{c.id === "school-corner" ? <span className="text-xl" aria-hidden>🎒</span> : <Icon className="h-5 w-5 text-primary" />}</span>
                  <span className="text-xs font-semibold leading-tight">{c.name}</span><span className="text-[10px] text-muted-foreground">Offers &amp; talent</span>
                </Link>
              );
            }
            return (
              <Link
                key={c.id}
                to="/search"
                search={{ category: c.id }}
                className="relative flex flex-col items-center gap-1 rounded-2xl bg-card p-3 text-center shadow-sm transition hover:shadow-md"
              >
                {c.isNew && (
                  <Badge className="absolute -right-1 -top-2 bg-primary text-primary-foreground">
                    NEW
                  </Badge>
                )}
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
                    {c.id === "school-corner" ? <span className="text-xl" aria-hidden>🎒</span> : <Icon className="h-5 w-5 text-primary" />}
                </span>
                <span className="text-xs font-semibold leading-tight">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{c.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <Row
        title="Trending products"
        subtitle="Most viewed this week"
        items={filter(listingsByCategory("products"))}
      />
      <Row
        title="Hotels & Short Stays"
        subtitle="Price per night · escrow-protected 30% deposit"
        items={filter(listingsByCategory("hotels"))}
      />
      <Row
        title="Transportation"
        subtitle="Cars, motos, trucks and bus tickets with verified drivers"
        items={filter(listingsByCategory("transport"))}
      />

      <section className="mt-7">
        <h2 className="mb-2 text-lg font-bold">Top Painters</h2>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {TOP_PAINTERS.map((p) => (
            <Link
              key={p.name}
              to="/listing/$id"
              params={{ id: p.id }}
              className="w-40 shrink-0 rounded-2xl bg-card p-3 text-center shadow-sm"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-lg font-bold text-primary">
                {p.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </div>
              <p className="mt-2 text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                ⭐ {p.rating} · {p.jobs} jobs
              </p>
              <Badge className="mt-1 bg-primary text-primary-foreground">Verified</Badge>
            </Link>
          ))}
        </div>
      </section>

      <Row
        title="House Plans from 25,000 FCFA"
        subtitle="Floor plan + 3D render + PDF + Bill of Quantities"
        items={filter(listingsByCategory("builders"))}
      />
      <Row
        title="Land Plots"
        subtitle="Aerial drone views with location pin"
        items={filter(LISTINGS.filter((l) => l.sub === "Land for Sale"))}
      />
      <Row
        title="Top Real Estate"
        items={filter(listingsByCategory("real-estate"))}
      />
      <Row title="Latest Vehicles" items={filter(listingsByCategory("vehicles"))} />
      <section className="mt-7"><div className="mb-2 flex items-end justify-between"><h2 className="text-lg font-bold">Jobs</h2><Link to="/jobs" className="text-sm text-primary hover:underline">Job Offers · Find Talent</Link></div><Row title="Latest Job Offers" items={filter(listingsByCategory("jobs"))} /></section>
      <Row title="Food & Restaurants" items={filter(listingsByCategory("food"))} />
      <Row title="Education & Training" items={filter(listingsByCategory("education"))} />
      <Row title="School Corner" subtitle="Uniforms, books, bags, shoes and lab equipment by school" items={filter(listingsByCategory("school-corner"))} />
      <Row title="Services near you" items={filter(listingsByCategory("services"))} />
      <Row title="Consultants" items={filter(listingsByCategory("consultants"))} />

      <div className="mt-8 rounded-2xl bg-card p-5 text-center shadow-sm">
        <h3 className="text-lg font-bold">Sell on Meremoth Mall</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Products, services, house plans, land, vehicles, jobs, food and courses — reach buyers in
          Cameroon and worldwide.
        </p>
        <Button asChild className="mt-3 rounded-2xl">
          <Link to="/become-seller">Become a Seller</Link>
        </Button>
      </div>
    </MallShell>
  );
}
