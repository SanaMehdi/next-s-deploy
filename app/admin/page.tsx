'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const supabase = createClient();
  const [reports, setReports] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: reportRows } = await supabase.from('abuse_reports').select('*');
      const { data: flagRows } = await supabase.from('feature_flags').select('*');
      setReports(reportRows || []);
      setFlags(flagRows || []);
    };
    load();
  }, []);

  const resolveReport = async (id: string) => {
    await supabase.from('abuse_reports').update({ status: 'resolved' }).eq('id', id);
    setReports(reports.map(r => r.id === id ? { ...r, status: 'resolved' } : r));
  };

  const toggleFlag = async (key: string, value: boolean) => {
    await supabase.from('feature_flags').upsert({ key, value: !value });
    setFlags(flags.map(f => f.key === key ? { ...f, value: !value } : f));
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>

      <h3 className="font-bold mb-2">Abuse Reports</h3>
      {reports.map(r => (
        <div key={r.id} className="mb-2 border-b pb-2">
          <div>Post: {r.post_id}</div>
          <div>Reason: {r.reason}</div>
          <div>Status: {r.status}</div>
          {r.status === 'pending' && (
            <Button size="sm" onClick={() => resolveReport(r.id)}>Resolve</Button>
          )}
        </div>
      ))}
      {reports.length === 0 && <div>No reports found.</div>}

      <h3 className="font-bold mt-6 mb-2">Feature Flags</h3>
      {flags.map(f => (
        <div key={f.key} className="mb-2 flex items-center gap-2">
          <span>{f.key}</span>
          <Button size="sm" onClick={() => toggleFlag(f.key, f.value)}>
            {f.value ? 'Disable' : 'Enable'}
          </Button>
        </div>
      ))}
      {flags.length === 0 && <div>No flags found.</div>}
    </div>
  );
}
