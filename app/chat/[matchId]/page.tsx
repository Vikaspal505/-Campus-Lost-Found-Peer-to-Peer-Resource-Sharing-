'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage, Match, Item } from '@/types';
import { mockStore } from '@/lib/mockStore';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Chat() {
  const params = useParams();
  const matchId = typeof params.matchId === 'string' ? params.matchId : params.matchId?.[0];
  const router = useRouter();
  const { user } = useAuth();

  const [match, setMatch] = useState<Match | null>(null);
  const [lostItem, setLostItem] = useState<Item | null>(null);
  const [foundItem, setFoundItem] = useState<Item | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherUserName, setOtherUserName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId) return;
    loadChatData();
    const handleUpdate = () => loadChatData();
    window.addEventListener('mock_store_updated', handleUpdate);
    return () => window.removeEventListener('mock_store_updated', handleUpdate);
  }, [matchId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatData = () => {
    if (!matchId) return;
    const m = mockStore.getMatchById(matchId);
    if (!m) {
      setLoading(false);
      return;
    }
    setMatch(m);

    const lost = mockStore.getItemById(m.lostItemId);
    const found = mockStore.getItemById(m.foundItemId);
    if (lost) setLostItem(lost);
    if (found) setFoundItem(found);

    // Determine other user's name
    if (user && lost && found) {
      if (lost.userId === user.uid) {
        setOtherUserName(found.userName);
      } else {
        setOtherUserName(lost.userName);
      }
    } else {
      setOtherUserName(lost?.userName || found?.userName || 'Campus Peer');
    }

    const msgs = mockStore.getMessages(matchId);
    setMessages(msgs);
    setLoading(false);
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || newMessage).trim();
    if (!textToSend || !matchId || !user) return;

    mockStore.sendMessage(matchId, user.uid, user.name, textToSend);
    setNewMessage('');

    // If this is a new inquiry, simulate a realistic auto-reply from the campus peer after 1.5s
    const currentMsgs = mockStore.getMessages(matchId);
    if (currentMsgs.filter((m) => m.senderId !== user.uid).length === 0) {
      setTimeout(() => {
        mockStore.sendMessage(
          matchId,
          'peer_responder',
          otherUserName || 'Campus Peer',
          'Hello! Thanks for reaching out. Yes, I have the item safe with me. We can meet up on campus or at the security office!'
        );
      }, 1500);
    }
  };

  const markResolved = () => {
    if (lostItem) mockStore.updateItem(lostItem.id!, { status: 'resolved' });
    if (foundItem) mockStore.updateItem(foundItem.id!, { status: 'resolved' });
    alert('🎉 Item marked as resolved and recovered!');
  };

  const quickReplies = [
    'Can we meet near the Central Library?',
    'Does it have any specific marks or stickers?',
    'I submitted it to the Main Gate Security desk.',
    'Thank you so much for returning it!',
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-500">Opening secure chat...</p>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!match) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-md mx-auto text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Conversation Not Found</h3>
            <p className="text-xs text-slate-500 mb-4">This match conversation is either closed or does not exist.</p>
            <Link href="/messages" className="text-xs font-bold text-blue-600 hover:underline">
              ← Return to Messages
            </Link>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Back button & Subject Bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/messages"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              All Messages
            </Link>

            <button
              onClick={markResolved}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition-colors border border-emerald-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark Recovered & Close
            </button>
          </div>

          {/* Matched Items Context Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                {otherUserName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{otherUserName}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {match.confidence}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Item: <span className="font-medium text-slate-700">{lostItem?.category}</span> • {lostItem?.description.slice(0, 45)}...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Encrypted peer channel</span>
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <span className="text-4xl mb-2">💬</span>
                  <p className="text-xs font-semibold text-slate-600">Start the conversation</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                    Say hello to {otherUserName} and ask questions to verify ownership.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === user?.uid;
                  const date = msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt);
                  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[80%]">
                        {!isMe && (
                          <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {msg.senderName.charAt(0)}
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <div
                            className={`text-[10px] mt-1 text-right ${
                              isMe ? 'text-blue-100' : 'text-slate-400'
                            }`}
                          >
                            {timeStr}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider py-1">Quick:</span>
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => handleSendMessage(undefined, reply)}
                  className="whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Message ${otherUserName}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
