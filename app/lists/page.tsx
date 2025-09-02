'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ListsPage() {
  const [lists, setLists] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('user_lists')
        .select('*')
        .eq('user_id', user.id);
      setLists(data || []);
    };
    load();
  }, []);

  const createList = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !name) return;

    await supabase
      .from('user_lists')
      .insert([{ user_id: user.id, name }]);

    setName('');

    const { data } = await supabase
      .from('user_lists')
      .select('*')
      .eq('user_id', user.id);
    setLists(data || []);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Lists</h2>
      <div className="flex gap-2 mb-4">
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New list name"
        />
        <Button onClick={createList}>Create</Button>
      </div>
      {lists.map(l => (
        <div key={l.id} className="mb-2 border-b pb-2">{l.name}</div>
      ))}
      {lists.length === 0 && <div>No lists yet.</div>}
    </div>
  );
}
