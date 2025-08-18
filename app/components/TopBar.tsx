'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TopBar({ email }: { email: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur sticky top-0">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-semibold">Dashboard</div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{email}</span>
          <button
            onClick={logout}
            disabled={loading}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? '...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  );
}
