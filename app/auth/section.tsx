"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AuthClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const mode = sp.get("mode") === "signup" ? "signup" : "signin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast("Account created. Check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast("Signed in");
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message ?? "Auth error");
    }
  };

  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "signup" ? "Create account" : "Sign in"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={submit}>
            <Input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
            <Input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
            <Button className="w-full" type="submit">
              {mode === "signup" ? "Sign up" : "Sign in"}
            </Button>
          </form>
          <div className="mt-3 text-xs text-muted-foreground">
            {mode === "signup" ? (
              <>Already have an account? <a className="underline" href="/auth">Sign in</a></>
            ) : (
              <>New here? <a className="underline" href="/auth?mode=signup">Create account</a></>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
