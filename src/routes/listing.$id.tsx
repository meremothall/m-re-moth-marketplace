import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";
import { LISTINGS, SELLERS, fcfa, getListing, usd } from "@/lib/mall-data";
import { CheckoutDrawer } from "@/components/mall/CheckoutDrawer";

export const Route = createFileRoute("/listing/$id")({
  loader: ({ params }) => {
    const listing = getListing(params.id);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Listing unavailable — Meremoth Mall" }, { name: "robots", content: "noindex" }] };
    }
    const l = loaderData.listing;
    const title = `${l.title} — ${fcfa(l.price)} | Meremoth Mall`;
    const description = `${l.description} Located in ${l.location}. Contact the seller privately through Meremoth Mall in-app chat.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ListingPage,
});

function ListingPage() {
  const { listing } = Route.useLoaderData();
  const seller = SELLERS[listing.sellerId]!;
  const [active, setActive] = useState(0);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const isPro = listing.category === "consultants" || listing.category === "builders";
  const priceText = `${fcfa(listing.price)}${listing.priceUnit ?? ""}`;
  const related = LISTINGS.filter(
    (l) => l.category === listing.category && l.id !== listing.id,
  ).slice(0, 4);

  return (
    <MallShell title={listing.title} back>
      <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="flex h-56 items-center justify-center bg-secondary text-8xl">
          {listing.emoji}
        </div>
        <div className="flex gap-2 overflow-x-auto p-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl ${
                active === i ? "ring-2 ring-primary" : ""
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              {listing.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{listing.sub}</Badge>
          <Badge variant="outline">{listing.condition}</Badge>
          {seller.pro && <Badge className="bg-primary text-primary-foreground">Verified PRO</Badge>}
          {seller.country === "Cameroon" ? (
            <Badge className="bg-primary text-primary-foreground">🇨🇲 Verified Cameroon Seller</Badge>
          ) : (
            <Badge className="bg-amber-500 text-white">{seller.flag} International Seller</Badge>
          )}
        </div>
        <h1 className="text-xl font-bold">{listing.title}</h1>
        <p className="text-2xl font-extrabold text-primary">
          {priceText}{" "}
          <span className="text-xs font-normal text-muted-foreground" title="Indicative conversion">
            {usd(listing.price)}
          </span>
        </p>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {listing.location}
        </p>
        <p className="flex items-center gap-1 text-sm">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-4 w-4 ${
                s <= Math.round(listing.rating) ? "fill-amber-400 text-amber-400" : "text-muted"
              }`}
            />
          ))}
          <span className="ml-1 text-muted-foreground">
            {listing.rating} · {listing.reviews} reviews
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Status: <span className="font-medium text-foreground">Available</span>
          {listing.sold ? ` · ${listing.sold} sold` : ""}
        </p>
      </div>

      <Card className="mt-4 rounded-2xl">
        <CardContent className="space-y-3 p-4">
          <h2 className="font-bold">Description</h2>
          <p className="text-sm text-muted-foreground">{listing.description}</p>
          <h2 className="pt-2 font-bold">Specifications</h2>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(listing.specs).map(([k, v]) => (
                <tr key={k} className="border-b border-border last:border-0">
                  <td className="py-2 text-muted-foreground">{k}</td>
                  <td className="py-2 text-right font-medium">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {listing.category === "builders" && (
        <Card className="mt-4 rounded-2xl">
          <CardContent className="space-y-2 p-4 text-sm">
            <h2 className="font-bold">Plan pack included</h2>
            <ul className="list-inside list-disc text-muted-foreground">
              <li>Floor plan drawing</li>
              <li>3D render of the finished house</li>
              <li>PDF download after payment</li>
              <li>Bill of Quantities (BOQ)</li>
              <li>Construction cost estimate for Douala prices</li>
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="mt-4 rounded-2xl">
        <CardContent className="space-y-3 p-4">
          <h2 className="font-bold">Seller</h2>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-xl">
              {seller.flag}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{seller.name}</p>
              <p className="text-xs text-muted-foreground">
                ⭐ {seller.rating} · {seller.jobs} completed · {seller.country}
              </p>
            </div>
            {seller.verified && <ShieldCheck className="h-5 w-5 text-primary" />}
          </div>
        </CardContent>
      </Card>

      <section className="mt-4 rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="text-lg font-bold">Get in Touch — Contact Seller</h2>
        <div className="mt-3 grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline"><Link to="/chat/$sellerId" params={{ sellerId: seller.id }}><MessageSquare className="mr-2 h-4 w-4" />Chat Seller</Link></Button>
            <CheckoutDrawer listing={listing} />
          </div>
          <Button variant="outline" className="rounded-2xl" onClick={() => setQuoteOpen(true)}>
            Request Quote / Request Service
          </Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => setMessageOpen(true)}>
            <Send className="mr-2 h-4 w-4" /> Send Message
          </Button>
          {isPro && (
            <div className="grid gap-2 sm:grid-cols-2">
              <Button className="rounded-2xl" onClick={() => setQuoteOpen(true)}>
                Hire {seller.name.split(" ")[0]}
              </Button>
              <Button variant="outline" className="rounded-2xl" onClick={() => setBookOpen(true)}>
                <CalendarDays className="mr-2 h-4 w-4" /> Book Consultation
              </Button>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-bold">Similar listings</h2>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
            {related.map((l) => (
              <Link
                key={l.id}
                to="/listing/$id"
                params={{ id: l.id }}
                className="w-40 shrink-0 rounded-2xl bg-card p-3 shadow-sm"
              >
                <div className="flex h-16 items-center justify-center text-4xl">{l.emoji}</div>
                <p className="line-clamp-2 text-sm font-medium">{l.title}</p>
                <p className="text-sm font-bold text-primary">{fcfa(l.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Request Quote / Request Service</DialogTitle>
            <DialogDescription>
              Sent privately to the seller inbox.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setQuoteOpen(false);
              toast.success("Request sent to the seller. They usually reply within a few hours.");
            }}
          >
            <Field label="Your Name" required />
            <Field label="Phone" type="tel" required />
            <div className="space-y-1.5">
              <Label htmlFor="need">What do you need?</Label>
              <Textarea id="need" required maxLength={1000} />
            </div>
            <Field label="Location" />
            <Field label="Budget (FCFA)" type="number" />
            <Field label="Date needed" type="date" />
            <Button type="submit" className="w-full rounded-2xl">
              Send request
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Your message goes straight to {seller.name}.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setMessageOpen(false);
              toast.success("Message sent.");
            }}
          >
            <Field label="Your Name" required />
            <Field label="Phone or Email" required />
            <div className="space-y-1.5">
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" required maxLength={1000} />
            </div>
            <Button type="submit" className="w-full rounded-2xl">
              Send
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Book Consultation</DialogTitle>
            <DialogDescription>
              Pick a date and time. {priceText} per session.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setBookOpen(false);
              toast.success("Booking request sent. The consultant will confirm your slot.");
            }}
          >
            <Field label="Your Name" required />
            <Field label="Phone" type="tel" required />
            <Field label="Date" type="date" required />
            <Field label="Time" type="time" required />
            <Button type="submit" className="w-full rounded-2xl">
              Request booking
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </MallShell>
  );
}

function Field({
  label,
  type = "text",
  required,
}: {
  label: string;
  type?: string;
  required?: boolean;
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required={required} maxLength={120} />
    </div>
  );
}
