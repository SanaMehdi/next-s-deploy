'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [twofa, setTwofa] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(data);
      setBio(data?.bio || '');
      setTwofa(Boolean(data?.twofa_enabled));
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ bio, twofa_enabled: twofa })
      .eq('id', user.id);
    setSaving(false);
    alert('Saved!');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      <div className="mb-4">
        <label className="block mb-1">Bio</label>
        <Input value={bio} onChange={e => setBio(e.target.value)} />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          id="twofa"
          type="checkbox"
          checked={twofa}
          onChange={e => setTwofa(e.target.checked)}
        />
        <label htmlFor="twofa">Enable 2FA</label>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}
