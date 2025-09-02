'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('events').select('*');
      setEvents(data || []);
    };
    load();
  }, []);

  const createEvent = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !title) return;
    await supabase.from('events').insert([{ creator_id: user.id, title, description }]);
    setTitle('');
    setDescription('');
    const { data } = await supabase.from('events').select('*');
    setEvents(data || []);
  };

  const rsvp = async (eventId: string, status: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('event_rsvps').upsert({ event_id: eventId, user_id: user.id, status });
    alert('RSVP updated!');
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Events</h2>
      <div className="flex gap-2 mb-4">
        <Input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Event title"
        />
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <Button onClick={createEvent}>Create</Button>
      </div>
      {events.map(e => (
        <div key={e.id} className="mb-4 p-4 border rounded">
          <div className="font-bold">{e.title}</div>
          <div className="text-sm text-gray-500">{e.description}</div>
          <Button size="sm" onClick={() => rsvp(e.id, 'going')}>RSVP</Button>
        </div>
      ))}
      {events.length === 0 && <div>No events yet.</div>}
    </div>
  );
}
