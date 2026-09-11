import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Image as ImageIcon, MapPin, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";
import { SELLERS } from "@/lib/mall-data";

export const Route = createFileRoute("/chat/$sellerId")({
  loader: ({ params }) => {
    const seller = SELLERS[params.sellerId];
    if (!seller) throw notFound();
    return { seller };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Chat — Meremoth Mall" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      meta: [
        { title: `Chat with ${loaderData.seller.name} — Meremoth Mall` },
        {
          name: "description",
          content: `Message ${loaderData.seller.name} directly on Meremoth Mall about their listings.`,
        },
        { property: "og:title", content: `Chat with ${loaderData.seller.name}` },
        { property: "og:description", content: "In-app chat on Meremoth Mall." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: ChatPage,
});

type Msg = { id: number; from: "me" | "them"; text: string; time: string; read?: boolean };

function ChatPage() {
  const { seller } = Route.useLoaderData();
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: "them", text: `Hello, welcome to ${seller.name}. How can I help?`, time: "09:02" },
    { id: 2, from: "me", text: "Good morning, is it still available?", time: "09:05", read: true },
    { id: 3, from: "them", text: "Yes it is available. When do you need it?", time: "09:06" },
  ]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (body: string) => {
    if (!body.trim()) return;
    setMessages((m) => [
      ...m,
      {
        id: m.length + 1,
        from: "me",
        text: body.trim(),
        time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        read: false,
      },
    ]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: m.length + 1,
          from: "them",
          text: "Noted 👍 I will send you the details right away.",
          time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1400);
  };

  return (
    <MallShell title={seller.name} back>
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-primary" /> Online now
      </div>

      <div className="space-y-2 rounded-2xl bg-card p-3 shadow-sm">
        {messages.map((m) => (
          <div key={m.id} className={m.from === "me" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                m.from === "me"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <p>{m.text}</p>
              <p className="mt-0.5 text-right text-[10px] opacity-75">
                {m.time} {m.from === "me" ? (m.read ? "✓✓" : "✓") : ""}
              </p>
            </div>
          </div>
        ))}
        {typing && <p className="text-xs text-muted-foreground">{seller.name} is typing…</p>}
      </div>

      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
      >
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-label="Send photo"
          onClick={() => toast.info("Photo upload opens your gallery once accounts are live.")}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-label="Voice note"
          onClick={() => toast.info("Hold to record a voice note once accounts are live.")}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-label="Share location"
          onClick={() => send("📍 Shared my location: Douala, Akwa")}
        >
          <MapPin className="h-4 w-4" />
        </Button>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="rounded-full bg-card"
          maxLength={500}
        />
        <Button type="submit" size="icon" className="rounded-full" aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </MallShell>
  );
}
