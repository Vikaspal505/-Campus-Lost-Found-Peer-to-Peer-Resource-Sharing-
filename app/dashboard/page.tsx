'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Item, ITEM_CATEGORIES } from '@/types';
import { mockStore } from '@/lib/mockStore';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemCard from '@/components/ItemCard';

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found' | 'resolved'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
    const handleUpdate = () => loadItems();
    window.addEventListener('mock_store_updated', handleUpdate);
    return () => window.removeEventListener('mock_store_updated', handleUpdate);
  }, []);

  const loadItems = () => {
    const all = mockStore.getItems();
    setItems(all);
    setLoading(false);
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    // Type filter
    if (selectedType === 'lost' && item.type !== 'lost') return false;
    if (selectedType === 'found' && item.type !== 'found') return false;
    if (selectedType === 'resolved' && item.status !== 'resolved') return false;
    if (selectedType !== 'resolved' && item.status === 'resolved' && selectedType !== 'all') return false;

    // Category filter
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchLoc = item.location.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchUser = item.userName.toLowerCase().includes(q);
      return matchDesc || matchLoc || matchCat || matchUser;
    }

    return true;
  });

  const lostCount = items.filter((i) => i.type === 'lost' && i.status === 'open').length;
  const foundCount = items.filter((i) => i.type === 'found' && i.status === 'open').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;
  const matchCount = mockStore.getMatches().length;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Top Welcome & Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Lost</p>
                <p className="text-3xl font-extrabold text-rose-600 mt-1">{lostCount}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Looking for finders</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">
                🔴
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Found</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{foundCount}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Awaiting rightful owner</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                🟢
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Potential Matches</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-1">{matchCount}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated suggestions</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                ⚡
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reunited & Resolved</p>
                <p className="text-3xl font-extrabold text-indigo-600 mt-1">{resolvedCount}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Successfully recovered</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                🤝
              </div>
            </div>
          </div>

          {/* Quick Action Banners */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Misplaced an item?
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Report a Lost Item</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Describe what you lost, select the campus location, and our matching algorithm will notify you when someone reports it found.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/report/lost"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-rose-500/20 transition-all"
                >
                  Report Lost Item →
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Found something on campus?
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">Report a Found Item</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Help a peer recover their keys, ID card, book, or gadget. Securely coordinate return without revealing personal contact details.
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/report/found"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all"
                >
                  Report Found Item →
                </Link>
              </div>
            </div>
          </div>

          {/* Search, Filter Tabs & Category Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {/* Search Box */}
              <div className="relative w-full sm:w-96">
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search item, keywords, or campus location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status / Type Filter Buttons */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
                {(
                  [
                    { id: 'all', label: 'All Items' },
                    { id: 'lost', label: '🔴 Lost' },
                    { id: 'found', label: '🟢 Found' },
                    { id: 'resolved', label: '✅ Resolved' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedType(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      selectedType === tab.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
              <span className="text-xs font-semibold text-slate-400 mr-1 whitespace-nowrap">Category:</span>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Categories
              </button>
              {ITEM_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid View */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedType === 'all'
                  ? 'All Campus Reports'
                  : selectedType === 'lost'
                  ? 'Active Lost Items'
                  : selectedType === 'found'
                  ? 'Active Found Items'
                  : 'Resolved & Recovered Items'}
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Showing {filteredItems.length} items
              </span>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-500">Loading campus reports...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
                  🔍
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">No items found</h3>
                <p className="text-xs text-slate-500 mb-4">
                  {searchQuery
                    ? `No matches for "${searchQuery}". Try clearing search or changing filters.`
                    : 'No items reported in this category yet.'}
                </p>
                {(searchQuery || selectedCategory !== 'all' || selectedType !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedType('all');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
