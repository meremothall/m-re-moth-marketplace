import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Search,
  Plus,
  MessageCircle,
  Leaf,
  User,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Megaphone,
} from "lucide-react";
import type { ReactNode } from "react";
import { ADMIN, ADMIN_WA_LINK } from "@/lib/mall-data";
import { NEW_WANTED_COUNT } from "@/lib/wanted";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-2xl bg-white shadow-sm"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Leaf className="text-primary" style={{ width: size * 0.6, height: size * 0.6 }} />
    </span>
  );
}

export function AdminStrip() {
  return (
    <p className="text-xs text-muted-foreground">
      {ADMIN.name} — {ADMIN.role} · Contact us — {ADMIN.handle} · WhatsApp {ADMIN.whatsapp} ·{" "}
      {ADMIN.email} · {ADMIN.location} ({ADMIN.timezone})
    </p>
  );
}

export function MallHeader({ title, back }: { title?: string | undefined; back?: boolean | undefined }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
        {back && (
          <Link to="/" aria-label="Back" className="rounded-full p-1 hover:bg-white/15">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <Logo size={38} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold leading-tight">
            {title ?? "Meremoth Mall"}
          </p>
          <p className="truncate text-[11px] opacity-90">
            Complete Marketplace — Built in Douala for Cameroon, Open to the World
          </p>
        </div>
        <Link
          to="/dashboard"
          aria-label="Profile"
          className="rounded-full bg-white/15 p-2 hover:bg-white/25"
        >
          <User className="h-5 w-5" />
        </Link>
      </div>
      <div className="bg-primary/90 px-4 py-1 text-center text-[11px] text-primary-foreground/90">
        {ADMIN.name} — {ADMIN.role} · Contact us — {ADMIN.handle} · WhatsApp {ADMIN.whatsapp}
      </div>
    </header>
  );
}

export function MallFooter() {
  return (
    <footer className="mt-10 border-t border-border bg-card px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-3">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-bold">Meremoth Mall</span>
        </div>
        <AdminStrip />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Phone className="h-3 w-3" /> {ADMIN.whatsapp}
          </span>
          <span className="inline-flex items-center gap-1">
            <Mail className="h-3 w-3" /> {ADMIN.email}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {ADMIN.location}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link to="/about" className="text-primary hover:underline">
            About Us
          </Link>
          <Link to="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
          <Link to="/become-seller" className="text-primary hover:underline">
            Become a Seller
          </Link>
          <Link to="/pricing" className="text-primary hover:underline">
            Pricing & Boost
          </Link>
          <Link to="/terms" className="text-primary hover:underline">
            Terms
          </Link>
          <Link to="/admin" className="text-primary hover:underline">
            Admin
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Meremoth Mall • Customer Support • Safe & Trusted • {ADMIN.handle}
        </p>
      </div>
    </footer>
  );
}

export function WhatsAppWidget() {
  return (
    <a
      href={ADMIN_WA_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label={`Contact us on WhatsApp — ${ADMIN.handle} ${ADMIN.whatsapp}`}
      title={`Contact us — ${ADMIN.handle} · ${ADMIN.whatsapp}`}
      style={{ width: 56, height: 56, right: 20, bottom: 96, zIndex: 999 }}
      className="fixed flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

export function WantedFab() {
  return (
    <Link
      to="/wanted"
      aria-label="Post a WANTED request"
      style={{ right: 20, bottom: 164, zIndex: 999 }}
      className="fixed inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-amber-600"
    >
      <Megaphone className="h-4 w-4" /> WANTED
    </Link>
  );
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const item = (active: boolean) =>
    `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
      active ? "text-primary font-semibold" : "text-muted-foreground"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center">
        <Link to="/" className={item(pathname === "/")}>
          <Home className="h-5 w-5" />
          Home
        </Link>
        <Link to="/wanted" className={item(pathname.startsWith("/wanted"))}>
          <span className="relative">
            <Megaphone className="h-5 w-5" />
            <span className="absolute -right-3 -top-2 rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
              {NEW_WANTED_COUNT}
            </span>
          </span>
          Wanted
        </Link>
        <Link to="/add-listing" className="flex flex-1 flex-col items-center py-1">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Plus className="h-6 w-6" />
          </span>
          <span className="text-[11px] text-muted-foreground">Sell</span>
        </Link>
        <Link to="/inbox" className={item(pathname.startsWith("/inbox"))}>
          <MessageCircle className="h-5 w-5" />
          Chat
        </Link>
        <Link to="/dashboard" className={item(pathname.startsWith("/dashboard"))}>
          <User className="h-5 w-5" />
          Profile
        </Link>
      </div>
    </nav>
  );
}

export function MallShell({
  children,
  title,
  back,
  header = true,
}: {
  children: ReactNode;
  title?: string | undefined;
  back?: boolean | undefined;
  header?: boolean | undefined;
}) {
  return (
    <div className="min-h-screen bg-background pb-24">
      {header && <MallHeader title={title} back={back} />}
      <main className="mx-auto max-w-5xl px-4 py-5">{children}</main>
      <MallFooter />
      <WhatsAppWidget />
      <WantedFab />
      <BottomNav />
    </div>
  );
}
