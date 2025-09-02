'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('tags').select('*').limit(10).then(({ data }) => setTrending(data || []));
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    const { data: users } = await supabase.from('profiles').select('*').ilike('username', `%${query}%`);
    const { data: posts } = await supabase.from('posts').select('*').ilike('content', `%${query}%`);
    setResults([...(users || []), ...(posts || [])]);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search users, posts, tags"
        className="mb-4"
      />
      <button onClick={handleSearch} className="mb-4">Search</button>
      <div>
        <h3 className="font-bold mb-2">Trending Tags</h3>
        <div className="flex gap-2 flex-wrap">
          {trending.map(tag => (
            <span key={tag.id} className="bg-gray-200 rounded px-2 py-1 text-sm">#{tag.name}</span>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {results.map(r => (
          <div key={r.id} className="mb-2 border-b pb-2">{r.username || r.content}</div>
        ))}
      </div>
    </div>
  );
}
