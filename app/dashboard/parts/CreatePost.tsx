'use client';

import { useState, useRef } from 'react';
import { createPost } from '@/app/posts/actions';

export default function CreatePost() {
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    const title = String(formData.get('title') || '').trim();

    if (!title) {
      setMsg('Title is required.');
      return;
    }

    try {
      setSaving(true);
      const { error } = await createPost(formData);
      if (error) {
        setMsg(error);
        return;
      }
      formRef.current?.reset();
    } catch (e: any) {
      setMsg(e?.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={onCreate} className="space-y-3">
      <input
        name="title"
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
        placeholder="Title"
      />
      <textarea
        name="content"
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 min-h-[90px]"
        placeholder="Content (optional)"
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
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
