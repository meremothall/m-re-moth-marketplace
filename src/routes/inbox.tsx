import { createFileRoute, Link } from "@tanstack/react-router";
import { MallShell } from "@/components/mall/Chrome";
import { SELLERS } from "@/lib/mall-data";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — Chats with Buyers and Sellers | Meremoth Mall" },
      {
        name: "description",
        content:
          "All your Meremoth Mall conversations in one place: buyer requests, quotes and seller replies.",
      },
      { property: "og:title", content: "Inbox — Meremoth Mall" },
      { property: "og:description", content: "Chat with buyers and sellers on Meremoth Mall." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Inbox,
});

const PREVIEWS: Record<string, { last: string; time: string; unread: number; online: boolean }> = {
  s1: { last: "Yes we can come tomorrow morning 👍", time: "09:12", unread: 2, online: true },
  s2: { last: "I sent the POP design photos", time: "Yesterday", unread: 0, online: false },
  s3: { last: "Your session is booked for Friday", time: "Mon", unread: 1, online: true },
  s4: { last: "The land title is ready to view", time: "Sun", unread: 0, online: false },
  s5: { last: "Shipping takes 10 days to Douala", time: "Sat", unread: 0, online: false },
};

function Inbox() {
  return (
    <MallShell title="Inbox" back>
      <h1 className="text-xl font-bold">Messages</h1>
      <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-sm">
        {Object.values(SELLERS).map((s) => {
          const p = PREVIEWS[s.id]!;
          return (
            <Link
              key={s.id}
              to="/chat/$sellerId"
              params={{ sellerId: s.id }}
              className="flex items-center gap-3 p-3 hover:bg-secondary"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-xl">
                {s.flag}
                {p.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.last}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">{p.time}</p>
                {p.unread > 0 && (
                  <span className="mt-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">
                    {p.unread}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </MallShell>
  );
}
