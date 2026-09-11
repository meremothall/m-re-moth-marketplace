import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, MessageCircle, MessageSquare, Phone, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Logo, MallShell } from "@/components/mall/Chrome";
import { ADMIN, ADMIN_WA_LINK } from "@/lib/mall-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact us — meremoth admin | Meremoth Mall" },
      {
        name: "description",
        content:
          "Reach Eceo Admin, founder of Meremoth Mall, on WhatsApp 653779134 or support@meremothmall.com. Support 8AM-9PM daily from Douala, Cameroon.",
      },
      { property: "og:title", content: "Contact us — meremoth admin" },
      {
        property: "og:description",
        content: "WhatsApp, call or email Meremoth Mall support in Douala, Cameroon.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <MallShell title={`Contact us — ${ADMIN.handle}`} back>
      <div className="flex flex-col items-center text-center">
        <Logo size={64} />
        <h1 className="mt-3 text-2xl font-bold">Meremoth Mall</h1>
        <p className="text-sm text-muted-foreground">We're here to help you</p>
      </div>

      <div className="mt-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl">
            🧑🏿‍💼
          </div>
          <div>
            <p className="text-lg font-bold">{ADMIN.name}</p>
            <p className="text-sm text-muted-foreground">Founder of meremoth mall</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {ADMIN.location}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <p className="flex items-center gap-2 font-semibold text-primary">
            <MessageCircle className="h-4 w-4" /> WhatsApp {ADMIN.whatsapp}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" /> {ADMIN.email}
          </p>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-bold">Get in Touch</h2>
        <p className="text-sm text-muted-foreground">Choose how you'd like to reach us</p>
        <div className="mt-3 grid gap-2">
          <Button asChild className="rounded-2xl">
            <a href={ADMIN_WA_LINK} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Chat
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl border-primary text-primary">
            <a href={`tel:+${ADMIN.whatsappIntl}`}>
              <Phone className="mr-2 h-4 w-4" /> Call Admin
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl border-primary text-primary">
            <a href={`mailto:${ADMIN.email}`}>
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </a>
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl border-primary text-primary"
            onClick={() => toast.info("Live chat is open — use the green bubble bottom right.")}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Live Chat on site
          </Button>
          <Button
            variant="outline"
            className="rounded-2xl border-destructive text-destructive"
            onClick={() => toast.success("Issue reported. meremoth admin will contact you.")}
          >
            <TriangleAlert className="mr-2 h-4 w-4" /> Report Issue
          </Button>
        </div>
      </section>

      <div className="mt-6 space-y-2 rounded-2xl bg-secondary p-4 text-sm">
        <p className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Support Hours: {ADMIN.hours} (
          {ADMIN.timezone})
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Location: {ADMIN.location}
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Meremoth Mall • Customer Support • Safe & Trusted • {ADMIN.handle}
      </p>
    </MallShell>
  );
}
