'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function BookmarksPage() {
  const [folders, setFolders] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      // getUser() is async
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: folderRows }, { data: bookmarkRows }] = await Promise.all([
        supabase.from('bookmark_folders').select('*').eq('user_id', user.id),
        // Prefer an alias to pull the joined post content
        supabase.from('bookmarks').select('*, post:post_id(*)').eq('user_id', user.id),
      ]);

      setFolders(folderRows || []);
      setBookmarks(bookmarkRows || []);
    };
    load();
  }, []);

  const filtered = selected
    ? bookmarks.filter((b: any) => b.folder_id === selected)
    : bookmarks;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Bookmarks</h2>

      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={!selected ? 'default' : 'outline'}
          onClick={() => setSelected(null)}
        >
          All
        </Button>
        {folders.map((f: any) => (
          <Button
            key={f.id}
            size="sm"
            variant={selected === f.id ? 'default' : 'outline'}
            onClick={() => setSelected(f.id)}
          >
            {f.name}
          </Button>
        ))}
      </div>

      {filtered.map((b: any) => (
        <div key={b.id} className="mb-2 border-b pb-2">
          {b.post?.content ?? '(post unavailable)'}
        </div>
      ))}

      {filtered.length === 0 && <div>No bookmarks yet.</div>}
    </div>
  );
}
