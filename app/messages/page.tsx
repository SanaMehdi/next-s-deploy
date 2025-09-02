'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const load = async () => {
      // getUser() is async
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (!data) return;
      const ids = data.map((d: any) => d.conversation_id);
      const { data: convs } = await supabase
        .from('conversations')
        .select('*')
        .in('id', ids);
      setConversations(convs || []);
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!selected) return;
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', selected.id)
        .order('created_at');
      setMessages(data || []);
    };
    load();
  }, [selected]);

  const sendMessage = async () => {
    if (!input || !selected) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from('messages')
      .insert([{ conversation_id: selected.id, sender_id: user.id, content: input }]);
    setInput('');
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', selected.id)
      .order('created_at');
    setMessages(data || []);
  };

  return (
    <div className="flex max-w-4xl mx-auto mt-8">
      <div className="w-1/3 border-r pr-4">
        <h2 className="font-bold mb-2">Conversations</h2>
        {conversations.map(c => (
          <div
            key={c.id}
            className={`p-2 cursor-pointer ${selected?.id === c.id ? 'bg-blue-100' : ''}`}
            onClick={() => setSelected(c)}
          >
            Conversation {c.id.slice(0, 6)}
          </div>
        ))}
      </div>
      <div className="w-2/3 pl-4">
        {selected ? (
          <>
            <div className="h-96 overflow-y-auto border-b mb-2">
              {messages.map(m => (
                <div key={m.id} className="mb-2">
                  <span className="font-bold">{m.sender_id.slice(0, 6)}:</span> {m.content}
                </div>
              ))}
            </div>
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <Button onClick={sendMessage} className="mt-2">Send</Button>
          </>
        ) : (
          <div>Select a conversation</div>
        )}
      </div>
    </div>
  );
}
