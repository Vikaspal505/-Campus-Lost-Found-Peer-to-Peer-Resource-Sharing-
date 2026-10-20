'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Match, Item } from '@/types';
import { mockStore } from '@/lib/mockStore';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemCard from '@/components/ItemCard';

interface MatchWithItems {
  match: Match;
  lostItem: Item;
  foundItem: Item;
}

export default function Matches() {
  const { user } = useAuth();
  const router = useRouter();
  const [matchList, setMatchList] = useState<MatchWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
    const handleUpdate = () => loadMatches();
    window.addEventListener('mock_store_updated', handleUpdate);
    return () => window.removeEventListener('mock_store_updated', handleUpdate);
  }, [user]);

  const loadMatches = () => {
    const rawMatches = mockStore.getMatches();
    const items = mockStore.getItems();
    const itemMap = new Map(items.map((i) => [i.id, i]));

    const populated: MatchWithItems[] = [];
    for (const m of rawMatches) {
      const lost = itemMap.get(m.lostItemId);
      const found = itemMap.get(m.foundItemId);
      if (lost && found) {
        populated.push({
          match: m,
          lostItem: lost,
          foundItem: found,
        });
      }
    }

    // Sort by confidence descending
    populated.sort((a, b) => b.match.confidence - a.match.confidence);
    setMatchList(populated);
    setLoading(false);
  };

  const handleStartChat = (matchId: string) => {
    router.push(`/chat/${matchId}`);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                AI Smart Matching Engine
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Suggested Item Matches</h2>
              <p className="text-xs text-slate-500 mt-1">
                Our algorithm matches lost and found reports based on category, keywords, time proximity, and location.
              </p>
            </div>
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {matchList.length} Active Suggested Matches
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500">Evaluating match probabilities...</p>
            </div>
          ) : matchList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
                ⚡
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No Matches Yet</h3>
              <p className="text-xs text-slate-500 mb-4">
                When new lost or found items with overlapping categories or keywords are reported, they will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {matchList.map(({ match, lostItem, foundItem }) => {
                const isHighConfidence = match.confidence >= 85;
                const isUserInvolved = user?.uid === lostItem.userId || user?.uid === foundItem.userId;

                return (
                  <div
                    key={match.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden hover:border-blue-300 transition-all"
                  >
                    {/* Match Banner Bar */}
                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Confidence Score Pill */}
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                            match.confidence >= 90
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : match.confidence >= 80
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          <span>⚡</span>
                          <span>{match.confidence}% Match Confidence</span>
                        </div>

                        {isHighConfidence && (
                          <span className="text-xs font-semibold text-emerald-700 hidden md:inline">
                            Strong match found in {lostItem.category}
                          </span>
                        )}

                        {isUserInvolved && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold">
                            Your Item
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartChat(match.id!)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Open In-App Chat
                      </button>
                    </div>

                    {/* Side-by-side comparison */}
                    <div className="p-6 grid md:grid-cols-2 gap-6 relative">
                      {/* Lost Item Side */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            Lost Report
                          </span>
                          <span className="text-xs text-slate-400">Reported by {lostItem.userName}</span>
                        </div>
                        <ItemCard item={lostItem} />
                      </div>

                      {/* Found Item Side */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Found Report
                          </span>
                          <span className="text-xs text-slate-400">Found by {foundItem.userName}</span>
                        </div>
                        <ItemCard item={foundItem} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
