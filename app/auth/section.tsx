'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

export default function AuthSection() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectedFrom = searchParams.get("redirectedFrom") || "/feed";

    const [view, setView] = useState<'signIn' | 'signUp'>('signIn');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            if (view === 'signIn') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
            }
            router.push(redirectedFrom);
        } catch (err: any) {
            setError(err?.message ?? "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) setError(error.message);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{view === 'signIn' ? 'Sign in' : 'Create account'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2 ring-1 ring-red-200">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleAuth} className="space-y-3">
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                        <Input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                        />
                        <div className="flex items-center justify-between">
                            <Button type="submit" disabled={loading}>
                                {loading
                                    ? (view === 'signIn' ? 'Signing in…' : 'Signing up…')
                                    : (view === 'signIn' ? 'Sign in' : 'Sign up')}
                            </Button>
                            <button
                                type="button"
                                className="text-sm text-slate-600 hover:text-slate-900"
                                onClick={() => setView(view === 'signIn' ? 'signUp' : 'signIn')}
                            >
                                {view === 'signIn' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-4">
                        <Button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full"
                            variant="outline"
                        >
                            Continue with Google
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
