import { createFileRoute } from "@tanstack/react-router";
import { MallShell } from "@/components/mall/Chrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Meremoth Mall — Global Marketplace" },
      {
        name: "description",
        content:
          "Meremoth Mall is a global marketplace protecting every trade with private chat and secure escrow payments.",
      },
      { property: "og:title", content: "About Meremoth Mall" },
      {
        property: "og:description",
        content: "Elevating commerce worldwide. Your treasure is safe with us.",
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
      <article className="mx-auto max-w-2xl py-8 text-center">
        <h1 className="text-3xl font-bold">Meremoth Mall — Global Marketplace</h1>
        <p className="mt-3 text-lg font-semibold text-primary">Elevating Commerce.</p>
        <div className="mt-8 space-y-5 text-left text-base leading-7 text-muted-foreground">
          <p>In ancient times, Meremoth was the guardian of temple treasures, trusted to keep gold and sacred vessels safe.</p>
          <p>Today we are guardians of your trade. A complete marketplace where you can buy anything, hire anyone, and sell to the world, with private in-app chat and secure escrow payments.</p>
          <p className="font-semibold text-foreground">Your treasure is safe with us.</p>
        </div>
        <p className="mt-8 text-lg font-bold text-primary">Buy • Sell • Secure.</p>
      </article>
    </MallShell>
  );
}
