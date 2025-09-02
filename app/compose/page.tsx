'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function ComposePage() {
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('Public');
  const [saving, setSaving] = useState(false);

  const handlePost = async () => {
    setSaving(true);
    await supabase.from('posts').insert([{ content, audience }]);
    setContent('');
    setSaving(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="mb-4"
      />
      <select value={audience} onChange={e => setAudience(e.target.value)} className="mb-4">
        <option value="Public">Public</option>
        <option value="Friends">Friends</option>
        <option value="Private">Private</option>
      </select>
      <Button onClick={handlePost} disabled={saving || !content}>
        {saving ? 'Posting...' : 'Post'}
      </Button>
    </div>
  );
}
