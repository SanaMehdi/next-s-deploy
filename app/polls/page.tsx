'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PollsPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [option, setOption] = useState('');
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('polls').select('*');
      setPolls(data || []);
    };
    load();
  }, []);

  const createPoll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !question || options.length < 2) return;

    const { data: poll } = await supabase
      .from('polls')
      .insert([{ creator_id: user.id, question }])
      .select()
      .single();

    if (poll) {
      await Promise.all(
        options.map(opt =>
          supabase.from('poll_options').insert([{ poll_id: poll.id, option_text: opt }])
        )
      );
      setQuestion('');
      setOptions([]);
      const { data } = await supabase.from('polls').select('*');
      setPolls(data || []);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Polls</h2>

      <div className="mb-2">
        <Input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Poll question"
        />
      </div>

      <div className="mb-2 flex gap-2">
        <Input
          value={option}
          onChange={e => setOption(e.target.value)}
          placeholder="Add option"
        />
        <Button
          onClick={() => {
            if (!option) return;
            setOptions([...options, option]);
            setOption('');
          }}
        >
          Add
        </Button>
      </div>

      <div className="mb-2 flex gap-2 flex-wrap">
        {options.map((opt, i) => (
          <span key={i} className="bg-gray-200 rounded px-2 py-1">{opt}</span>
        ))}
      </div>

      <Button onClick={createPoll} disabled={!question || options.length < 2}>
        Create Poll
      </Button>

      <div className="mt-6">
        {polls.map(p => (
          <div key={p.id} className="mb-4 p-4 border rounded">
            <div className="font-bold">{p.question}</div>
            {/* TODO: Show options and voting */}
          </div>
        ))}
      </div>
    </div>
  );
}
