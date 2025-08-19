'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { getBrowserSupabase } from '@/lib/supabase/client';

export function LoginForm() {
  const supabase = getBrowserSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();

  const signInEmail = () => startTransition(async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return toast({ variant: 'destructive', title: error.message });
    window.location.href = '/posts';
  });

  const signUpEmail = () => startTransition(async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return toast({ variant: 'destructive', title: error.message });
    toast({ title: 'Account created. You can sign in now.' });
  });

  const signInGoogle = () => startTransition(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    });
    if (error) toast({ variant: 'destructive', title: error.message });
    else if (data.url) window.location.href = data.url;
  });

  return (
    <div className="rounded-2xl border bg-white p-6 shadow">
      <div className="space-y-3">
        <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex gap-2">
          <Button disabled={isPending} onClick={signInEmail} className="flex-1">Sign in</Button>
          <Button variant="secondary" disabled={isPending} onClick={signUpEmail} className="flex-1">Sign up</Button>
        </div>
        <Separator />
        <Button variant="outline" onClick={signInGoogle}>Continue with Google</Button>
      </div>
    </div>
  );
}
