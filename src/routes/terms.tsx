import { createFileRoute } from "@tanstack/react-router";
import { MallShell } from "@/components/mall/Chrome";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Meremoth Mall" },
      {
        name: "description",
        content:
          "Meremoth Mall terms: FCFA escrow payments, seller verification, commissions, and international seller customs and delivery responsibilities.",
      },
      { property: "og:title", content: "Terms & Conditions — Meremoth Mall" },
      {
        property: "og:description",
        content: "Rules for buyers, Cameroonian sellers and international sellers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. Using Meremoth Mall",
    body: "Meremoth Mall is a marketplace connecting buyers and sellers. We are not the seller of items listed by third parties. Buyers must confirm goods and services before releasing payment.",
  },
  {
    title: "2. Payments and escrow",
    body: "All payments are made in FCFA and are held in escrow by Meremoth Mall. Funds are released to the seller after the buyer confirms delivery, minus the applicable commission.",
  },
  {
    title: "3. Fees",
    body: "Platform fee 5% plus 100 FCFA per transaction, and 10% sales commission (waived on the Premium plan's first month). Subscription and boost fees are non-refundable once activated.",
  },
  {
    title: "4. Verification",
    body: "Verification is required before a seller receives a Verified or PRO badge. Cameroonian sellers with a +237 number get the Verified Cameroon Seller badge. International sellers are reviewed and approved manually by meremoth admin.",
  },
  {
    title: "5. International sellers",
    body: "International sellers are fully responsible for customs clearance, duties and delivery of their goods. Meremoth Mall is not liable for cross-border delays, seizures or additional charges applied by customs authorities.",
  },
  {
    title: "6. Prohibited conduct",
    body: "No fraud, counterfeit documents, fake land titles or misleading listings. PPE, building materials, cement and all lawful goods are permitted. Accounts breaking these rules are removed.",
  },
  {
    title: "7. Disputes",
    body: "Report any issue to meremoth admin on WhatsApp 653779134 or support@meremothmall.com within 7 days of delivery. Escrow funds stay held until the dispute is resolved.",
  },
];

function TermsPage() {
  return (
    <MallShell title="Terms" back>
      <h1 className="text-2xl font-bold">Terms & Conditions</h1>
      <div className="mt-4 space-y-3">
        {SECTIONS.map((s) => (
          <div key={s.title} className="rounded-2xl bg-card p-4 shadow-sm">
            <h2 className="font-bold">{s.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </MallShell>
  );
}
