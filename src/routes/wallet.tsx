import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowDownToLine, ArrowUpRight, Wallet as WalletIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MallShell } from "@/components/mall/Chrome";
import { useSessionUser, fcfaAmount } from "@/lib/session";
import { getWallet, initTopup, type WalletSummary } from "@/lib/wallet.functions";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "My Wallet — Meremoth Mall" },
      {
        name: "description",
        content:
          "Top up your Meremoth Mall wallet in FCFA with mobile money, pay protected orders and follow every transaction.",
      },
      { property: "og:title", content: "My Wallet — Meremoth Mall" },
      { property: "og:description", content: "Top up, pay and withdraw in FCFA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const { user, loading } = useSessionUser();
  const load = useServerFn(getWallet);
  const topup = useServerFn(initTopup);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [amount, setAmount] = useState("5000");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    load().then(setWallet).catch(() => toast.error("Could not load your wallet."));
  }, [user, load]);

  if (loading) return <MallShell title="My Wallet" back>Loading…</MallShell>;

  if (!user) {
    return (
      <MallShell title="My Wallet" back>
        <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
          <WalletIcon className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-2 font-semibold">Sign in to see your wallet</p>
          <Button asChild className="mt-4 rounded-2xl">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </MallShell>
    );
  }

  const onTopup = async () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 500) {
      toast.error("Enter at least 500 FCFA.");
      return;
    }
    setBusy(true);
    try {
      const result = await topup({
        data: { amount: Math.round(value), origin: window.location.origin },
      });
      if (result.ok) window.location.href = result.paymentUrl;
      else toast.info(result.message);
    } catch {
      toast.error("Top up could not be started. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <MallShell title="My Wallet" back>
      <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm">
        <p className="text-xs opacity-80">Available balance</p>
        <p className="mt-1 text-3xl font-extrabold">{fcfaAmount(wallet?.balance ?? 0)}</p>
        <p className="mt-1 text-xs opacity-80">Protected by Meremoth escrow</p>
      </div>

      <div className="mt-4 rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="font-bold">Top up</h2>
        <div className="mt-2 space-y-2">
          <Label htmlFor="amount">Amount (FCFA)</Label>
          <Input
            id="amount"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            maxLength={9}
          />
          <div className="flex flex-wrap gap-2">
            {[2000, 5000, 10000, 25000].map((v) => (
              <Button key={v} size="sm" variant="outline" className="rounded-full" onClick={() => setAmount(String(v))}>
                {fcfaAmount(v)}
              </Button>
            ))}
          </div>
          <Button className="w-full rounded-2xl" disabled={busy} onClick={onTopup}>
            <ArrowUpRight className="mr-2 h-4 w-4" /> Top up with mobile money
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={() => toast.info("Withdrawals open once your seller payout details are verified.")}
          >
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Withdraw (sellers)
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-card p-4 shadow-sm">
        <h2 className="font-bold">Transactions</h2>
        {wallet && wallet.transactions.length > 0 ? (
          <table className="mt-2 w-full text-sm">
            <tbody>
              {wallet.transactions.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="py-2">
                    <p className="font-medium capitalize">{t.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.created_at).toLocaleDateString()} · {t.description ?? ""}
                    </p>
                  </td>
                  <td className="py-2 text-right">
                    <p className="font-bold">{fcfaAmount(t.amount)}</p>
                    <p className="text-xs capitalize text-muted-foreground">{t.status}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No transactions yet.</p>
        )}
      </div>
    </MallShell>
  );
}
