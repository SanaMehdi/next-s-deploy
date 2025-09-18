'use client';

import { useState } from 'react';
import { deletePost } from '@/app/posts/actions';

type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  image_url?: string | null;
  created_at: string;
};

// ✅ Stable date formatter so SSR and CSR match exactly
const fmt = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'UTC',
});
const formatDate = (iso: string) => fmt.format(new Date(iso)) + ' UTC';

export default function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEdit = (p: Post) => {
    setUpdatingId(p.id);
    setEditTitle(p.title);
  };

  const cancelEdit = () => {
    setUpdatingId(null);
    setEditTitle('');
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Update failed');
      setPosts((prev) => prev.map((p) => (p.id === id ? data.post : p)));
      cancelEdit();
    } catch (e) {
      alert((e as any)?.message ?? 'Update failed');
    }
  };

  if (!posts.length) {
    return <p className="text-sm text-gray-500">No posts yet. Create one on the right →</p>;
  }

  return (
    <ul className="space-y-3">
      {posts.map((p) => (
        <li key={p.id} className="rounded-xl border p-3">
          <div className="flex items-center justify-between gap-3">
            {updatingId === p.id ? (
              <div className="flex-1">
                <input
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
            ) : (
              <div className="font-medium">{p.title}</div>
            )}

            <div className="shrink-0 flex items-center gap-2">
              {updatingId === p.id ? (
                <>
                  <button
                    onClick={() => saveEdit(p.id)}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-white text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="rounded-lg border px-3 py-1.5 text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(p)}
                    className="rounded-lg border px-3 py-1.5 text-sm"
                  >
                    Edit
                  </button>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-500 text-red-500 px-3 py-1.5 text-sm"
                    >
                      Delete
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {p.content && <p className="text-sm text-gray-600 mt-2">{p.content}</p>}
          {p.image_url && <img key={p.id} src={p.image_url} alt="Post image" className="mt-2 w-full h-auto rounded-lg" />}

          {/* ✅ Fix hydration mismatch by using deterministic formatting */}
          <div className="text-xs text-gray-500 mt-2" suppressHydrationWarning>
            {formatDate(p.created_at)}
          </div>
        </li>
      ))}
    </ul>
  );
}
