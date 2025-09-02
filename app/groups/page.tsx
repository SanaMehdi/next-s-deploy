'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('groups').select('*');
      setGroups(data || []);
    };
    load();
  }, []);

  const joinGroup = async (groupId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('group_members').insert([{ group_id: groupId, user_id: user.id }]);
    alert('Joined group!');
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Groups</h2>
      {groups.map(g => (
        <div key={g.id} className="mb-4 p-4 border rounded">
          <div className="font-bold">{g.name}</div>
          <div className="text-sm text-gray-500">{g.description}</div>
          <Button className="mt-2" onClick={() => joinGroup(g.id)}>Join</Button>
        </div>
      ))}
      {groups.length === 0 && <div>No groups yet.</div>}
    </div>
  );
}
