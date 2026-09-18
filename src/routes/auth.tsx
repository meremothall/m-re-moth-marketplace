import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { MallShell } from "@/components/mall/Chrome";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Sign up — Meremoth Mall" },
      {
        name: "description",
        content:
          "Create your Meremoth Mall account to use your wallet, pay with escrow protection and track bus agency deliveries.",
      },
      { property: "og:title", content: "Login or Sign up — Meremoth Mall" },
      { property: "og:description", content: "Secure account for buyers and sellers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (mode: "login" | "signup") => {
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <MallShell title="Login / Sign up" back>
      <div className="mx-auto max-w-sm rounded-2xl bg-card p-5 shadow-sm">
        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">Sign up</TabsTrigger>
          </TabsList>

          {(["login", "signup"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit(tab);
                }}
              >
                {tab === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor={`email-${tab}`}>Email</Label>
                  <Input
                    id={`email-${tab}`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`password-${tab}`}>Password</Label>
                  <Input
                    id={`password-${tab}`}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={72}
                  />
                </div>
                <Button type="submit" className="w-full rounded-2xl" disabled={busy}>
                  {tab === "login" ? "Login" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MallShell>
  );
}
