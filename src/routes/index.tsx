import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import * as Icons from "lucide-react";
import { Heart, MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MallShell } from "@/components/mall/Chrome";
import {
  CATEGORIES,
  LISTINGS,
  TOP_PAINTERS,
  fcfa,
  listingsByCategory,
  type Listing,
} from "@/lib/mall-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meremoth Mall — Complete Marketplace in Douala, Cameroon" },
      {
        name: "description",
        content:
          "Buy and sell products, services, consultants, house plans, real estate, vehicles, jobs, food and courses on Meremoth Mall. Built in Douala for Cameroon, open to the world.",
      },
      { property: "og:title", content: "Meremoth Mall — Complete Marketplace" },
      {
        property: "og:description",
        content:
          "9 categories, verified Cameroonian sellers, WhatsApp ordering and secure escrow. Contact meremoth admin on 653779134.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

export function ListingCard({ listing }: { listing: Listing }) {
  const seller = SELLERS[listing.sellerId];
  const tierClass =
    seller?.tier === "Gold"
      ? "bg-amber-500 text-white"
      : seller?.tier === "Blue"
        ? "bg-sky-600 text-white"
        : "bg-secondary text-secondary-foreground";

  return (
    <Card className="overflow-hidden rounded-2xl border-border shadow-sm transition hover:shadow-md">
      <Link to="/listing/$id" params={{ id: listing.id }}>
        <div className="relative flex h-28 items-center justify-center bg-secondary text-5xl">
          {listing.emoji}
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow">
            <ShieldCheck className="h-3 w-3" /> Escrow
          </span>
          <Heart className="absolute right-2 top-2 h-5 w-5 text-muted-foreground" />
          {listing.sponsored && (
            <Badge className="absolute bottom-2 left-2 bg-amber-500 text-white">Sponsored</Badge>
          )}
        </div>
        <CardContent className="space-y-1 p-3">
          <p className="line-clamp-2 text-sm font-semibold leading-tight">{listing.title}</p>
          <p className="text-base font-extrabold text-primary">
            {fcfa(listing.price)}
            {listing.priceUnit ?? ""}
          </p>
          <div className="flex flex-wrap items-center gap-1">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
              {listing.condition === "Service" ? "Service" : listing.condition}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {listing.stock ? `${listing.stock} in stock` : "In stock"}
            </span>
          </div>
          {listing.amenities && (
            <div className="flex flex-wrap gap-1 text-[10px] text-muted-foreground">
              {listing.amenities.slice(0, 3).map((a) => (
                <span key={a} className="rounded-full bg-secondary px-2 py-0.5">
                  {a}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {listing.rating} · {listing.sold ? `${listing.sold} sold` : `${listing.reviews} reviews`}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="mt-1 border-t border-border pt-1">
            <p className="truncate text-[11px] font-semibold">{seller?.name}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tierClass}`}
              >
                <BadgeCheck className="h-3 w-3" />
                {seller?.verified ? `Verified ${seller.tier}` : "Unverified"}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">{seller?.area}</span>
            </div>
          </div>
        </CardContent>
      </Link>
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

function Home() {
  const [condition, setCondition] = useState<"All" | "Brand New" | "Okaza / Second Hand">("All");
  const [query, setQuery] = useState("");

  const filter = (items: Listing[]) =>
    items.filter(
      (l) =>
        (condition === "All" || l.condition === condition) &&
        (query.trim() === "" || l.title.toLowerCase().includes(query.toLowerCase())),
    );

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
          {CATEGORIES.map((c) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[c.icon] ?? Icons.Tag;
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
                  <Icon className="h-5 w-5 text-primary" />
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
      <Row title="Latest Jobs" items={filter(listingsByCategory("jobs"))} />
      <Row title="Food & Restaurants" items={filter(listingsByCategory("food"))} />
      <Row title="Education & Training" items={filter(listingsByCategory("education"))} />
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
