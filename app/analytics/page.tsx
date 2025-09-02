'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('posts')
        .select('id, content, post_analytics(*)')
        .eq('user_id', user.id);
      setAnalytics(data || []);
    };
    load();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      {analytics.map((a: any) => (
        <div key={a.id} className="mb-4 p-4 border rounded">
          <div className="mb-2">{a.content}</div>
          <div className="text-sm text-gray-500">
            Impressions: {a.post_analytics?.impressions || 0} | Likes: {a.post_analytics?.likes || 0} | Comments: {a.post_analytics?.comments || 0} | Reposts: {a.post_analytics?.reposts || 0}
          </div>
        </div>
      ))}
      {analytics.length === 0 && <div>No analytics yet.</div>}
    </div>
  );
}
