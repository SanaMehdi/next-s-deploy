'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  username: string;
  avatar_url: string;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  user: User;
  last_message: string;
  updated_at: string;
  updated_at_relative: string;
  read: boolean;
  last_sender_id: string;
  messages?: Message[];
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadMessages = async (conversationId: string) => {
    if (!currentUser) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);
      
      // Get all conversations where user is a member
      const { data: memberships } = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          conversations (
            id,
            created_at,
            updated_at,
            last_message_id,
            messages!last_message_id (
              id,
              content,
              created_at,
              sender:profiles!messages_sender_id_fkey (id, username, avatar_url)
            )
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false, foreignTable: 'conversations' });

      if (!memberships) return;
      
      // Format conversations with user data and last message
      const formattedConvs = await Promise.all(memberships.map(async (m: any) => {
        const conversation = m.conversations;
        
        // Get the other users in the conversation (excluding current user)
        const { data: members } = await supabase
          .from('conversation_members')
          .select('user_id, profiles!inner(id, username, avatar_url)')
          .eq('conversation_id', conversation.id)
          .neq('user_id', user.id);
        
        // For direct messages, get the other user's info
        const otherUser = Array.isArray(conversation.participants) 
          ? conversation.participants.find((p: any) => p.id !== user?.id)
          : conversation.participants;
          
        if (!otherUser) {
          console.error('Could not find other user in conversation', conversation);
          return null;
        }
        
        const lastMessage = {
          id: 'temp',
          content: conversation.last_message || 'No messages yet',
          created_at: conversation.updated_at,
          sender: otherUser
        };
        
        return {
          id: conversation.id,
          user: {
            id: otherUser.id,
            username: otherUser.username || 'Unknown User',
            avatar_url: otherUser.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
          },
          last_message: lastMessage.content,
          updated_at: lastMessage.created_at,
          updated_at_relative: formatRelativeTime(new Date(lastMessage.created_at)),
          read: true, // You might want to implement read status logic
          last_sender_id: lastMessage.sender?.id
        };
      }));
      
      setConversations(formattedConvs);
    };
    
    load();
    
    // Helper function to format relative time (e.g., "2h ago")
    function formatRelativeTime(date: Date) {
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }, []);

  // Load messages for active conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversation) return;
      
      // Fetch messages for the active conversation
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversation.id)
        .order('created_at');
      
      if (data) {
        setMessages(data);
        
        // Mark messages as read
        const unreadMessages = data.filter(m => !m.is_read && m.sender_id !== currentUser?.id);
        if (unreadMessages.length > 0) {
          const messageIds = unreadMessages.map(m => m.id);
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', messageIds);
        }
      }
    };
    
    loadMessages();
  }, [activeConversation, currentUser]);

  const sendMessage = async () => {
    if (!input.trim() || !activeConversation || !currentUser) return;
    
    // Create the message
    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([{ 
        conversation_id: activeConversation.id, 
        sender_id: currentUser.id, 
        content: input,
        is_read: false
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error sending message:', error);
      return;
    }
    
    // Update the conversation's last message and timestamp
    await supabase
      .from('conversations')
      .update({ 
        last_message_id: newMessage.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', activeConversation.id);
    
    // Refresh messages
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', activeConversation.id)
      .order('created_at');
      
    setMessages(data || []);
    setInput('');
  };

  return (
    <main className="flex justify-center bg-gray-50 min-h-screen">
      <section className="w-full max-w-[900px] bg-white border flex h-[calc(100vh-60px)]">
        {/* Inbox */}
        <aside className="w-[320px] border-r flex flex-col">
          {/* Inbox header */}
          <div className="px-4 py-3 border-b font-semibold">
            Messages
          </div>

          {/* Conversation list */}
          <div className="divide-y overflow-y-auto">
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50
                  ${!c.read ? "bg-blue-50" : ""}
                `}
                onClick={() => {
                  setSelectedConversationId(c.id);
                  setActiveConversation(c);
                  // Load messages for this conversation
                  loadMessages(c.id);
                }}
              >
                {/* Avatar */}
                <img
                  src={c.user.avatar_url}
                  alt={c.user.username}
                  className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {c.user.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {c.last_message}
                  </p>
                </div>

                {/* Time */}
                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                  {c.updated_at_relative}
                </span>
                
                {/* Unread indicator */}
                {!c.read && (
                  <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></span>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Conversation panel */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {activeConversation ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Conversation header */}
              <div className="px-4 py-3 border-b flex items-center gap-3 bg-white">
                <img
                  src={activeConversation.user.avatar_url}
                  alt={activeConversation.user.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">
                    {activeConversation.user.username}
                  </p>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No messages yet. Send a message to start the conversation.
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                          message.sender_id === currentUser?.id
                            ? 'bg-blue-500 text-white rounded-tr-none'
                            : 'bg-white border rounded-tl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                          message.sender_id === currentUser?.id ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          <span>
                            {new Date(message.created_at).toLocaleTimeString([], {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                          {message.sender_id === currentUser?.id && (
                            <span>
                              {message.is_read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Input area */}
              <div className="border-t bg-white p-4">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message..."
                    className="min-h-[40px] max-h-32 resize-none border-0 bg-gray-50 focus-visible:ring-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={sendMessage}
                    className="h-10 w-10 p-0 flex-shrink-0 bg-blue-500 hover:bg-blue-600"
                    disabled={!input.trim()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="max-w-xs">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Your messages</h3>
                <p className="text-sm text-gray-500 mb-4">Send private photos and messages to a friend</p>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Send message
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
