import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Megaphone, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MallShell } from "@/components/mall/Chrome";
import { DOUALA_AREAS, fcfa } from "@/lib/mall-data";
import { timeAgo, useFindForMe, type FindForMeRequest } from "@/lib/find-for-me";

export const Route = createFileRoute("/find-for-me")({
  head: () => ({
    meta: [
      { title: "Find For Me — Post What You Need | Meremoth Mall" },
      {
        name: "description",
        content:
          "Can't find it? Post a Find For Me request on Meremoth Mall and let Douala vendors send you offers with escrow protection.",
      },
      { property: "og:title", content: "Find For Me — Meremoth Mall" },
      {
        property: "og:description",
        content: "Reverse marketplace: buyers post requests, verified vendors send offers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FindForMePage,
});

function FindForMePage() {
  const { items, add } = useFindForMe();

  return (
    <MallShell title="Find For Me" back>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold">Find For Me</h1>
          <p className="text-xs text-muted-foreground">
            Post what you need — Douala vendors send you offers. Escrow applies once you agree.
          </p>
        </div>
        <PostFindForMeDialog onSubmit={add} />
      </div>

      <div className="mt-4 space-y-3">
        {items.map((w) => (
          <FindForMeCard key={w.id} req={w} />
        ))}
      </div>
    </MallShell>
  );
}

function FindForMeCard({ req }: { req: FindForMeRequest }) {
  const [sent, setSent] = useState(false);
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("Brand New");

  return (
    <article className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{req.product}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{req.description}</p>
        </div>
        <Badge className="shrink-0 bg-amber-500 text-white">{req.urgency}</Badge>
      </div>
      <p className="mt-2 text-lg font-bold text-primary">
        Budget {fcfa(req.budget)}
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          Qty {req.quantity}
        </span>
      </p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {req.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {timeAgo(req.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3 w-3" /> {req.offers} offers
        </span>
        <span>by {req.requester}</span>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-3 w-full rounded-2xl" disabled={sent}>
            {sent ? "Offer sent — check your chat" : "I Have It — Send Offer"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send an offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor={`price-${req.id}`}>My price (FCFA)</Label>
              <Input
                id={`price-${req.id}`}
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 280000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`cond-${req.id}`}>Condition</Label>
              <select
                id={`cond-${req.id}`}
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option>Brand New</option>
                <option>Okaza / Second Hand</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`photos-${req.id}`}>Photos</Label>
              <Input id={`photos-${req.id}`} type="file" accept="image/*" multiple />
            </div>
            <p className="inline-flex items-center gap-1 rounded-xl bg-secondary p-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Payment is held in Meremoth escrow
              until the buyer confirms delivery.
            </p>
            <Button
              className="w-full rounded-2xl"
              onClick={() => {
                setSent(true);
                toast.success("Offer sent to the buyer's chat");
              }}
            >
              Send offer in chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}

export function PostFindForMeDialog({
  onSubmit,
  trigger,
}: {
  onSubmit: (req: {
    product: string;
    description: string;
    budget: number;
    quantity: number;
    location: string;
    urgency: "Today" | "This Week";
    requester: string;
  }) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [location, setLocation] = useState("Akwa, Douala");
  const [urgency, setUrgency] = useState<"Today" | "This Week">("This Week");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="shrink-0 rounded-2xl bg-amber-500 text-white hover:bg-amber-600">
            <Megaphone className="mr-1 h-4 w-4" /> Post Find For Me
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Post a Find For Me request</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="w-product">Product name</Label>
            <Input
              id="w-product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="What are you looking for?"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="w-desc">Description</Label>
            <Textarea
              id="w-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Size, colour, brand, delivery needs..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="w-budget">Budget (FCFA)</Label>
              <Input
                id="w-budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="w-qty">Quantity</Label>
              <Input
                id="w-qty"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="w-loc">Location</Label>
            <select
              id="w-loc"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {DOUALA_AREAS.map((a) => (
                <option key={a} value={`${a}, Douala`}>
                  {a}, Douala
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Urgency</Label>
            <div className="flex gap-2">
              {(["Today", "This Week"] as const).map((u) => (
                <Button
                  key={u}
                  type="button"
                  size="sm"
                  variant={urgency === u ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setUrgency(u)}
                >
                  {u}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="w-photo">Photo (optional)</Label>
            <Input id="w-photo" type="file" accept="image/*" />
          </div>
          <Button
            className="w-full rounded-2xl"
            onClick={() => {
              if (!product.trim()) {
                toast.error("Please say what you are looking for");
                return;
              }
              onSubmit({
                product: product.trim(),
                description: description.trim(),
                budget: Number(budget) || 0,
                quantity: Number(quantity) || 1,
                location,
                urgency,
                requester: "You",
              });
              toast.success("Find For Me request posted — vendors can now send offers");
              setOpen(false);
              setProduct("");
              setDescription("");
              setBudget("");
            }}
          >
            Post request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
