import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft, Home, Mail, MapPin, Megaphone, MessageCircle, Plus, ShieldCheck, User } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ADMIN } from "@/lib/mall-data";
import { NEW_FIND_FOR_ME_COUNT } from "@/lib/find-for-me";

export function Logo({ size = 40 }: { size?: number }) {
  return <span className="brand-shield inline-flex shrink-0 items-center justify-center bg-primary text-accent shadow-sm" style={{ width: size, height: size }} aria-hidden><span className="text-[10px] font-black">MMM</span><ShieldCheck className="absolute h-4 w-4 opacity-0" /></span>;
}

export function MallHeader({ title, back }: { title?: string | undefined; back?: boolean | undefined }) {
  return <header className="sticky top-0 z-30 border-b border-border bg-primary text-primary-foreground">
    <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
      {back && <Link to="/" aria-label="Back" className="rounded-full p-1 hover:bg-primary-foreground/15"><ArrowLeft className="h-5 w-5" /></Link>}
      <Logo size={38} />
      <div className="min-w-0 flex-1"><p className="truncate text-base font-bold leading-tight">{title ?? "Meremoth Mall"}</p><p className="truncate text-[11px] opacity-90">Global Marketplace — Secured by Escrow</p></div>
      <Link to="/dashboard" aria-label="Profile" className="rounded-full bg-primary-foreground/15 p-2 hover:bg-primary-foreground/25"><User className="h-5 w-5" /></Link>
    </div>
  </header>;
}

export function MallFooter() {
  return <footer className="mt-10 border-t border-border bg-card px-4 py-8"><div className="mx-auto max-w-5xl space-y-3">
    <div className="flex items-center gap-2"><Logo size={36} /><div><span className="font-bold">Meremoth Mall</span><p className="text-[10px] font-semibold text-muted-foreground">Elevating Commerce</p></div></div>
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {ADMIN.email}</span><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {ADMIN.location}</span></div>
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm"><Link to="/about" className="text-primary hover:underline">About Us</Link><Link to="/contact" className="text-primary hover:underline">Contact us</Link><Link to="/become-seller" className="text-primary hover:underline">Become a Seller</Link><Link to="/pricing" className="text-primary hover:underline">Pricing &amp; Boost</Link><Link to="/terms" className="text-primary hover:underline">Terms</Link></div>
    <p className="text-xs text-muted-foreground">Meremoth Mall • Customer Support • Safe &amp; Trusted</p>
  </div></footer>;
}

type Point = { x: number; y: number };
const FLOAT_KEY = "meremoth-sell-position";
export function DraggableSellButton() {
  const [position, setPosition] = useState<Point | null>(null);
  const drag = useRef<{ dx: number; dy: number; moved: boolean } | null>(null);
  const blockClick = useRef(false);
  useEffect(() => { try { const saved = localStorage.getItem(FLOAT_KEY); if (saved) setPosition(JSON.parse(saved) as Point); } catch { /* unavailable */ } }, []);
  const clamp = (x: number, y: number) => ({ x: Math.max(8, Math.min(window.innerWidth - 53, x)), y: Math.max(72, Math.min(window.innerHeight - 126, y)) });
  const onPointerDown = (e: PointerEvent<HTMLAnchorElement>) => { const r=e.currentTarget.getBoundingClientRect(); drag.current={dx:e.clientX-r.left,dy:e.clientY-r.top,moved:false}; e.currentTarget.setPointerCapture(e.pointerId); };
  const onPointerMove = (e: PointerEvent<HTMLAnchorElement>) => { if(!drag.current) return; drag.current.moved=true; setPosition(clamp(e.clientX-drag.current.dx,e.clientY-drag.current.dy)); };
  const onPointerUp = () => { blockClick.current=Boolean(drag.current?.moved); if(position) try { localStorage.setItem(FLOAT_KEY, JSON.stringify(position)); } catch { /* unavailable */ } drag.current=null; };
  return <Link to="/add-listing" aria-label="Sell an item" title="Drag to move" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onClick={(e) => { if(blockClick.current) { e.preventDefault(); blockClick.current=false; } }} style={position ? { left: position.x, top: position.y } : { right: 16, bottom: 88 }} className="fixed z-50 flex h-11 w-11 touch-none items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><Plus className="h-5 w-5" /></Link>;
}

export function BottomNav() {
  const pathname=useRouterState({select:(s)=>s.location.pathname});
  const item=(active:boolean)=>`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[10px] ${active?"font-semibold text-primary":"text-muted-foreground"}`;
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card"><div className="mx-auto flex max-w-5xl items-center">
    <Link to="/" className={item(pathname==="/")}><Home className="h-5 w-5" />Home</Link>
    <Link to="/find-for-me" className={item(pathname.startsWith("/find-for-me"))}><span className="relative"><Megaphone className="h-5 w-5" /><span className="absolute -right-3 -top-2 rounded-full bg-amber-500 px-1 text-[9px] font-bold text-primary-foreground">{NEW_FIND_FOR_ME_COUNT}</span></span><span className="whitespace-nowrap">Find For Me</span></Link>
    <Link to="/add-listing" className={item(pathname.startsWith("/add-listing"))}><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"><Plus className="h-5 w-5" /></span>Sell</Link>
    <Link to="/inbox" className={item(pathname.startsWith("/inbox"))}><MessageCircle className="h-5 w-5" />Chat</Link>
    <Link to="/dashboard" className={item(pathname.startsWith("/dashboard"))}><User className="h-5 w-5" />Profile</Link>
  </div></nav>;
}

export function MallShell({ children, title, back, header=true }: { children:ReactNode; title?:string; back?:boolean; header?:boolean }) {
  return <div className="min-h-screen bg-background pb-24">{header && <MallHeader title={title} back={back} />}<main className="mx-auto max-w-5xl px-4 py-5">{children}</main><MallFooter /><DraggableSellButton /><BottomNav /></div>;
}
