'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Item } from '@/types';
import { mockStore } from '@/lib/mockStore';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ItemCard from '@/components/ItemCard';

export default function MyItems() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyItems();
    const handleUpdate = () => loadMyItems();
    window.addEventListener('mock_store_updated', handleUpdate);
    return () => window.removeEventListener('mock_store_updated', handleUpdate);
  }, [user]);

  const loadMyItems = () => {
    if (!user) return;
    const all = mockStore.getItems();
    const my = all.filter((i) => i.userId === user.uid);
    setItems(my);
    setLoading(false);
  };

  const markAsResolved = (itemId: string) => {
    mockStore.updateItem(itemId, { status: 'resolved' });
    alert('🎉 Item marked as resolved and recovered!');
  };

  const deleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to remove this report?')) {
      mockStore.deleteItem(itemId);
    }
  };

  const filtered = items.filter((i) => {
    if (filterType === 'lost') return i.type === 'lost';
    if (filterType === 'found') return i.type === 'found';
    return true;
  });

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                Personal Report Manager
              </div>
              <h2 className="text-2xl font-bold text-slate-900">My Reported Items</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your active lost and found reports, monitor status, and mark items as recovered.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/report/lost"
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                + Report Lost
              </Link>
              <Link
                href="/report/found"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                + Report Found
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl w-fit">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All My Items ({items.length})
            </button>
            <button
              onClick={() => setFilterType('lost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'lost' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost ({items.filter((i) => i.type === 'lost').length})
            </button>
            <button
              onClick={() => setFilterType('found')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'found' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found ({items.filter((i) => i.type === 'found').length})
            </button>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-slate-500">Loading your items...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
                📦
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No items reported</h3>
              <p className="text-xs text-slate-500 mb-4">
                You currently don't have any {filterType === 'all' ? '' : filterType} items recorded under your account.
              </p>
              <div className="flex justify-center gap-2">
                <Link
                  href="/report/lost"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Report Item
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  showActions={true}
                  onResolve={markAsResolved}
                  onDelete={deleteItem}
                />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
