import { useState } from "react";
import { CreditCard, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { fcfa, type Listing } from "@/lib/mall-data";

const DELIVERY_FEE = 2000;

export function CheckoutDrawer({ listing }: { listing: Listing }) {
  const [payment, setPayment] = useState("MoMo");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" className="min-w-0 flex-1 rounded-lg px-2 text-xs">
          Buy Now
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-h-[88vh] max-w-xl">
        <DrawerHeader className="text-left">
          <DrawerTitle>Protected checkout</DrawerTitle>
          <DrawerDescription>Review your order and choose a payment method.</DrawerDescription>
        </DrawerHeader>

        <div className="space-y-4 overflow-y-auto px-4 pb-2">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-3xl">
              {listing.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{listing.title}</p>
              <p className="text-sm text-muted-foreground">{listing.condition}</p>
            </div>
            <p className="text-sm font-bold">{fcfa(listing.price)}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Product</span><span>{fcfa(listing.price)}</span></div>
            <div className="flex justify-between"><span>Delivery · Douala</span><span>{fcfa(DELIVERY_FEE)}</span></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span><span>{fcfa(listing.price + DELIVERY_FEE)}</span>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg bg-secondary p-3 text-sm">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
            <div><p className="font-semibold">Escrow protection</p><p className="text-muted-foreground">Your money is safe until you confirm delivery.</p></div>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Payment method</legend>
            <div className="grid grid-cols-3 gap-2">
              {[{ name: "MoMo", icon: Smartphone }, { name: "Orange Money", icon: Smartphone }, { name: "Card", icon: CreditCard }].map(({ name, icon: Icon }) => (
                <Button key={name} type="button" variant={payment === name ? "default" : "outline"} className="h-16 flex-col gap-1 px-1 text-xs" onClick={() => setPayment(name)}>
                  <Icon className="h-4 w-4" />{name}
                </Button>
              ))}
            </div>
          </fieldset>
        </div>

        <DrawerFooter>
          <Button className="h-12 w-full" onClick={() => toast.info("Payment backend coming - Phase 1")}>
            <ShieldCheck className="mr-2 h-5 w-5" /> Pay Now &amp; Protect with Escrow
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}