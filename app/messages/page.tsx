'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockStore } from '@/lib/mockStore';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ConversationItem {
  matchId: string;
  otherUserName: string;
  itemTitle: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount?: number;
}

export default function Messages() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
    const handleUpdate = () => loadConversations();
    window.addEventListener('mock_store_updated', handleUpdate);
    return () => window.removeEventListener('mock_store_updated', handleUpdate);
  }, [user]);

  const loadConversations = () => {
    const matches = mockStore.getMatches();
    const items = mockStore.getItems();
    const itemMap = new Map(items.map((i) => [i.id, i]));
    const convos: ConversationItem[] = [];

    for (const match of matches) {
      const lost = itemMap.get(match.lostItemId);
      const found = itemMap.get(match.foundItemId);
      const msgs = mockStore.getMessages(match.id);

      if (msgs.length > 0 && lost && found) {
        const lastMsg = msgs[msgs.length - 1];

        // Determine counterpart user name
        let otherName = 'Campus Peer';
        if (user) {
          if (lost.userId === user.uid) otherName = found.userName;
          else if (found.userId === user.uid) otherName = lost.userName;
          else otherName = `${lost.userName} & ${found.userName}`;
        }

        convos.push({
          matchId: match.id!,
          otherUserName: otherName,
          itemTitle: `${lost.category} • ${lost.description.slice(0, 35)}...`,
          lastMessage: lastMsg.message,
          lastMessageTime: lastMsg.createdAt instanceof Date ? lastMsg.createdAt : new Date(lastMsg.createdAt),
          unreadCount: 1,
        });
      }
    }

    convos.sort((a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime());
    setConversations(convos);
    setLoading(false);
  };

  const formatTime = (date: Date) => {
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    const days = Math.floor(diff / 86400);
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Secure Peer Messaging
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Campus In-App Messages</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Coordinate safe returns with match finders or owners without sharing phone numbers.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-xs">
              {conversations.length} Active Chats
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500">Loading conversation threads...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
                💬
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No Active Messages Yet</h3>
              <p className="text-xs text-slate-500 mb-4">
                Head over to the Matches tab to initiate a chat with a potential finder or owner.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
              {conversations.map((convo) => (
                <div
                  key={convo.matchId}
                  onClick={() => router.push(`/chat/${convo.matchId}`)}
                  className="p-5 hover:bg-slate-50/80 cursor-pointer transition-colors flex items-center gap-4 group"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-xs">
                    {convo.otherUserName.charAt(0)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 truncate">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {convo.otherUserName}
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 hidden sm:inline truncate">
                          {convo.itemTitle}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                        {formatTime(convo.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate font-normal">
                      {convo.lastMessage}
                    </p>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
