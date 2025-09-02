'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      // getUser() is async
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNotifications(data || []);
    };
    load();
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.map(n => (
        <div key={n.id} className={`mb-2 p-2 rounded ${n.read ? 'bg-gray-100' : 'bg-blue-50'}`}>
          <div>{n.type}</div>
          <div className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</div>
          {!n.read && (
            <Button size="sm" onClick={() => markAsRead(n.id)} className="mt-1">Mark as read</Button>
          )}
        </div>
      ))}
      {notifications.length === 0 && <div>No notifications yet.</div>}
    </div>
  );
}
