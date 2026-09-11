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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";
import { CATEGORIES, CITIES, type CategoryId } from "@/lib/mall-data";

export const Route = createFileRoute("/add-listing")({
  head: () => ({
    meta: [
      { title: "Add a New Listing — Meremoth Mall" },
      {
        name: "description",
        content:
          "Post a product, service, house plan, land, vehicle, job, meal or course on Meremoth Mall with photos, price in FCFA and delivery options.",
      },
      { property: "og:title", content: "Add a New Listing — Meremoth Mall" },
      {
        property: "og:description",
        content: "Upload 6 photos, set your FCFA price and start selling today.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AddListing,
});

function AddListing() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryId>("products");
  const [delivers, setDelivers] = useState(true);
  const subs = CATEGORIES.find((c) => c.id === category)?.subs ?? [];

  return (
    <MallShell title="Add New Listing" back>
      <form
        className="space-y-4 rounded-2xl bg-card p-4 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Listing submitted for review.");
          void navigate({ to: "/dashboard" });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="photos">Upload photos (up to 6)</Label>
          <Input id="photos" type="file" accept="image/*" multiple />
          <div className="mt-2 grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-xl bg-secondary text-xs text-muted-foreground"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <F label="Title" id="title" required />
        <div className="grid grid-cols-2 gap-3">
          <F label="Price (FCFA)" id="price" type="number" required />
          <F label="Original Price (FCFA)" id="orig" type="number" />
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as CategoryId)}>
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
          <Label>Subcategory</Label>
          <Select key={category} defaultValue={subs[0] ?? ""}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subs.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Condition</Label>
          <Select defaultValue="Brand New">
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Brand New">Brand New</SelectItem>
              <SelectItem value="Okaza / Second Hand">Okaza / Second Hand</SelectItem>
              <SelectItem value="Service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="d">Description</Label>
          <Textarea id="d" maxLength={1000} />
        </div>

        <div className="space-y-1.5">
          <Label>Location</Label>
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

        <F label="Quantity" id="qty" type="number" />

        <div className="flex items-center justify-between rounded-xl bg-secondary p-3">
          <div>
            <p className="text-sm font-medium">I deliver to Cameroon</p>
            <p className="text-xs text-muted-foreground">
              If off, only digital items are allowed: house plan PDFs, consultation hours, courses.
            </p>
          </div>
          <Switch checked={delivers} onCheckedChange={setDelivers} />
        </div>

        {delivers ? (
          <div className="grid grid-cols-2 gap-3">
            <F label="Shipping cost to Douala (FCFA)" id="ship" type="number" />
            <F label="Delivery time" id="time" placeholder="7-14 days" />
          </div>
        ) : (
          <p className="rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
            Digital delivery only. Buyers download the file or book the hours after payment.
          </p>
        )}

        <Button type="submit" className="w-full rounded-2xl">
          Publish listing
        </Button>
      </form>
    </MallShell>
  );
}

function F({
  label,
  id,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} required={required} placeholder={placeholder} maxLength={140} />
    </div>
  );
}
