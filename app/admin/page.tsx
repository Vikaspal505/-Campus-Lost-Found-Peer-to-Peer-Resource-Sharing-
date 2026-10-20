'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Item, ITEM_CATEGORIES } from '@/types';
import { mockStore, MOCK_USERS } from '@/lib/mockStore';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Admin() {
  const { user, loginAs } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
    const handleUpdate = () => loadAdminData();
    window.addEventListener('mock_store_updated', handleUpdate);
    return () => window.removeEventListener('mock_store_updated', handleUpdate);
  }, [user]);

  const loadAdminData = () => {
    const all = mockStore.getItems();
    setItems(all);
    setLoading(false);
  };

  const deleteItem = (itemId: string) => {
    if (confirm('Delete this report from campus database?')) {
      mockStore.deleteItem(itemId);
    }
  };

  const markResolved = (itemId: string) => {
    mockStore.updateItem(itemId, { status: 'resolved' });
  };

  const resetAll = () => {
    if (confirm('Reset entire campus database back to factory demo state?')) {
      mockStore.resetToDefault();
      alert('Campus dataset restored to default!');
    }
  };

  // If user is not admin, display friendly persona switcher
  if (user?.role !== 'admin') {
    const adminUser = MOCK_USERS.find((u) => u.role === 'admin') || MOCK_USERS[1];
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-lg mx-auto my-12 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto mb-4">
              🛡️
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Faculty Admin Access Required</h3>
            <p className="text-xs text-slate-500 mb-6">
              You are currently viewing as student <strong>{user?.name}</strong>. Switch to the Faculty Admin persona to access moderation and institutional analytics.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => loginAs(adminUser)}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Switch to {adminUser.name} (Admin) →
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const totalReports = items.length;
  const lostCount = items.filter((i) => i.type === 'lost' && i.status === 'open').length;
  const foundCount = items.filter((i) => i.type === 'found' && i.status === 'open').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;
  const matchesCount = mockStore.getMatches().length;

  const filteredItems = items.filter((i) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      i.description.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.userName.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  });

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Campus Faculty Administration
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Institutional Administration Dashboard</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Oversee campus lost & found reporting, resolve spam/fake submissions, and review peer matching rates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                ↻ Reset Demo Data
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Reports</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalReports}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-[11px] font-semibold text-rose-500 uppercase tracking-wider">Active Lost</p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">{lostCount}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Active Found</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{foundCount}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Generated Matches</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{matchesCount}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 md:col-span-1">
              <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Reunited / Resolved</p>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">{resolvedCount}</p>
            </div>
          </div>

          {/* Items Table & Moderation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Campus Report Directory</h3>
                <p className="text-xs text-slate-500">Monitor and moderate all active student and faculty postings</p>
              </div>

              <div className="w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Filter by keyword, user, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{item.category}</td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-900">{item.description}</td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-[150px]">{item.location}</td>
                      <td className="py-3 px-4">
                        <div className="truncate max-w-[140px]">
                          <span className="font-medium text-slate-800">{item.userName}</span>
                          <span className="block text-[10px] text-slate-400">{item.userEmail}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.status === 'resolved'
                              ? 'bg-slate-100 text-slate-700'
                              : item.status === 'matched'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {item.status !== 'resolved' && (
                            <button
                              onClick={() => markResolved(item.id!)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold transition-colors"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={() => deleteItem(item.id!)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-semibold transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
