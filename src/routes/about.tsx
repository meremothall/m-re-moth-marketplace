import { createFileRoute } from "@tanstack/react-router";
import { MallShell, AdminStrip } from "@/components/mall/Chrome";
import { CATEGORIES } from "@/lib/mall-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Meremoth Mall — Built in Douala for Cameroon" },
      {
        name: "description",
        content:
          "Meremoth Mall connects buyers and sellers across 9 categories: products, services, consultants, builders, real estate, vehicles, jobs, food and education.",
      },
      { property: "og:title", content: "About Meremoth Mall" },
      {
        property: "og:description",
        content: "Built in Douala for Cameroon, open to the world. Proudly Cameroonian.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <MallShell title="About Us" back>
      <h1 className="text-2xl font-bold">About Meremoth Mall</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Built in Douala for Cameroon, Open to the World — Proudly Cameroonian. Meremoth Mall is one
        marketplace where you can buy anything, hire anyone and sell to buyers at home and abroad,
        with WhatsApp contact on every listing and secure escrow payment in FCFA.
      </p>

      <div className="mt-6 grid gap-3">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="rounded-2xl bg-card p-4 shadow-sm">
            <h2 className="font-bold">
              {c.name} <span className="text-xs font-normal text-muted-foreground">({c.count})</span>
            </h2>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              {c.subs.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-secondary p-4">
        <h2 className="font-bold">Our mission</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Give every Cameroonian trader, artisan, consultant and farmer a trusted online shopfront —
          and let buyers anywhere in the world reach them safely.
        </p>
        <div className="mt-3">
          <AdminStrip />
        </div>
      </div>
    </MallShell>
  );
}
