import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bus, CreditCard, ShieldCheck, Smartphone } from "lucide-react";
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
import { listBranches, createShipment, type BranchOption } from "@/lib/logistics.functions";
import { payFromWallet } from "@/lib/wallet.functions";
import { useSessionUser } from "@/lib/session";

const DELIVERY_FEE = 2000;
const CITIES = ["Douala", "Yaounde", "Buea", "Bamenda", "Limbe", "Bafoussam"];

export function CheckoutDrawer({ listing }: { listing: Listing }) {
  const { user } = useSessionUser();
  const [payment, setPayment] = useState("MoMo");
  const [step, setStep] = useState<"review" | "agency" | "done">("review");
  const [city, setCity] = useState("Douala");
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [receipt, setReceipt] = useState("");
  const [busy, setBusy] = useState(false);

  const loadBranches = useServerFn(listBranches);
  const makeShipment = useServerFn(createShipment);
  const pay = useServerFn(payFromWallet);

  const total = listing.price + DELIVERY_FEE;

  const startDelivery = async () => {
    if (!user) {
      toast.info("Sign in first so we can hold your payment in escrow.");
      return;
    }
    setBusy(true);
    try {
      const result = await pay({ data: { amount: total, description: `Order: ${listing.title}` } });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      const list = await loadBranches({ data: { city } });
      setBranches(list);
      setStep("agency");
    } catch {
      toast.error("Payment could not be completed.");
    } finally {
      setBusy(false);
    }
  };

  const chooseCity = async (value: string) => {
    setCity(value);
    setBranches(await loadBranches({ data: { city: value } }));
  };

  const chooseBranch = async (branch: BranchOption) => {
    setBusy(true);
    try {
      const shipment = await makeShipment({
        data: { branchId: branch.branchId, itemTitle: listing.title, amount: total },
      });
      setReceipt(shipment.receiptCode);
      setStep("done");
    } catch {
      toast.error("Could not book the parcel. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" className="min-w-0 flex-1 rounded-lg px-2 text-xs">
          Buy Now
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto max-h-[88vh] max-w-xl">
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {step === "review" ? "Protected checkout" : step === "agency" ? "Choose your bus agency" : "Parcel booked"}
          </DrawerTitle>
          <DrawerDescription>
            {step === "review"
              ? "Review your order and choose a payment method."
              : step === "agency"
                ? "Pick the office where you will collect your parcel."
                : "Keep your receipt code safe — you need it to collect."}
          </DrawerDescription>
        </DrawerHeader>

        {step === "review" && (
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
              <div className="flex justify-between"><span>Bus agency delivery</span><span>{fcfa(DELIVERY_FEE)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                <span>Total</span><span>{fcfa(total)}</span>
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
              <p className="mt-2 text-xs text-muted-foreground">
                Paid from your Meremoth wallet balance. Top up with {payment} on the wallet page.
              </p>
            </fieldset>
          </div>
        )}

        {step === "agency" && (
          <div className="space-y-3 overflow-y-auto px-4 pb-2">
            <label className="block text-sm font-semibold" htmlFor="city">Your city</label>
            <select
              id="city"
              className="w-full rounded-xl border border-input bg-background p-3 text-sm"
              value={city}
              onChange={(e) => chooseCity(e.target.value)}
            >
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {branches.map((b) => (
              <button
                key={b.branchId}
                disabled={busy}
                onClick={() => chooseBranch(b)}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left"
              >
                <Bus className="h-6 w-6 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{b.agencyName}</p>
                  <p className="text-xs text-muted-foreground">{b.quarter} · {b.phone ?? b.agencyPhone}</p>
                </div>
              </button>
            ))}
            {branches.length === 0 && <p className="text-sm text-muted-foreground">No agency office in this city yet.</p>}
          </div>
        )}

        {step === "done" && (
          <div className="space-y-3 px-4 pb-2 text-sm">
            <div className="rounded-xl bg-secondary p-4 text-center">
              <p className="text-xs text-muted-foreground">Your receipt code</p>
              <p className="text-3xl font-extrabold tracking-widest text-primary">{receipt}</p>
            </div>
            <p className="text-muted-foreground">
              The seller will drop your parcel at the agency office. You will be notified when the bus
              arrives — bring this code and your ID to collect, then confirm so the seller is paid.
            </p>
          </div>
        )}

        <DrawerFooter>
          {step === "review" && (
            <Button className="h-12 w-full" disabled={busy} onClick={startDelivery}>
              <ShieldCheck className="mr-2 h-5 w-5" /> Pay Now &amp; Protect with Escrow
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
