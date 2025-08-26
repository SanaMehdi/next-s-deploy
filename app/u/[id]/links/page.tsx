'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function UserLinksPage() {
  const { id } = useParams();
  const supabase = createClient();
  const [links, setLinks] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data } = await supabase
        .from('user_links')
        .select('*')
        .eq('user_id', id);
      setLinks(data || []);
    };
    load();
  }, [id]);

  const addLink = async () => {
    if (!id || !url) return;
    await supabase.from('user_links').insert([{ user_id: id, url, label }]);
    setUrl('');
    setLabel('');
    const { data } = await supabase
      .from('user_links')
      .select('*')
      .eq('user_id', id);
    setLinks(data || []);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Links</h2>
      <div className="mb-2 flex gap-2">
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="URL"
        />
        <Input
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Label"
        />
        <Button onClick={addLink}>Add</Button>
      </div>
      <div>
        {links.map(l => (
          <div key={l.id} className="mb-2">
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {l.label || l.url}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
