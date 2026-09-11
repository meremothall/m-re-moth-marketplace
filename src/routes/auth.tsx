import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";
import { COUNTRIES } from "@/lib/mall-data";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Sign up — Meremoth Mall" },
      {
        name: "description",
        content:
          "Sign in to Meremoth Mall with your phone number to chat with sellers, save favourites and manage your listings.",
      },
      { property: "og:title", content: "Login or Sign up — Meremoth Mall" },
      { property: "og:description", content: "Phone number login for buyers and sellers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [sent, setSent] = useState(false);

  return (
    <MallShell title="Login / Sign up" back>
      <div className="mx-auto max-w-sm rounded-2xl bg-card p-5 shadow-sm">
        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">
              Sign up
            </TabsTrigger>
          </TabsList>

          {["login", "signup"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!sent) {
                    setSent(true);
                    toast.success("Code sent by SMS.");
                  } else {
                    toast.info("Phone login goes live once the cloud backend is switched on.");
                  }
                }}
              >
                {tab === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" required maxLength={100} />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <div className="flex gap-2">
                    <span className="flex items-center rounded-xl border border-input px-3 text-sm">
                      {COUNTRIES[0]!.flag} +237
                    </span>
                    <Input id="phone" type="tel" required placeholder="653779134" maxLength={20} />
                  </div>
                </div>
                {sent && (
                  <div className="space-y-1.5">
                    <Label htmlFor="otp">SMS code</Label>
                    <Input id="otp" inputMode="numeric" maxLength={6} placeholder="6 digits" />
                  </div>
                )}
                <Button type="submit" className="w-full rounded-2xl">
                  {sent ? "Verify code" : "Send code"}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MallShell>
  );
}
