'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthShell from '../(auth)/AuthShell';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('StrongPass123!');
  const [confirm, setConfirm] = useState('StrongPass123!');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (password !== confirm) {
      setMsg('Passwords do not match.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.error ?? 'Signup failed');
        return;
      }
      // If email confirmations are enabled in your Supabase project,
      // the user may need to confirm. For this demo we redirect to dashboard.
      router.push('/dashboard');
    } catch (err: any) {
      setMsg(err?.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      footer={
        <span>
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            Log in
          </a>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              className="w-full rounded-lg border px-3 py-2 pr-16 outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Confirm password</label>
          <input
            type={showPw ? 'text' : 'password'}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            minLength={8}
            required
          />
        </div>

        {msg && <p className="text-sm text-red-600">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>

        <div className="pt-2 text-xs text-gray-500">
          By continuing you agree to the Terms and acknowledge the Privacy Policy.
        </div>
      </form>
    </AuthShell>
  );
}
