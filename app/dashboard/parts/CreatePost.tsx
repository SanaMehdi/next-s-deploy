'use client';

import { useState } from 'react';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (!title.trim()) {
      setMsg('Title is required.');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data?.error ?? 'Failed to create post');
        return;
      }
      // Simple refresh so the server page re-fetches
      window.location.reload();
    } catch (e: any) {
      setMsg(e?.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onCreate} className="space-y-3">
      <input
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 min-h-[90px]"
        placeholder="Body (optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
