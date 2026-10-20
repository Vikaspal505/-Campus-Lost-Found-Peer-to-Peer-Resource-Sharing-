'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { mockStore } from '@/lib/mockStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, signOut, availableUsers, loginAs } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [matchCount, setMatchCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const matches = mockStore.getMatches();
      setMatchCount(matches.length);
    };
    updateStats();
    window.addEventListener('mock_store_updated', updateStats);
    return () => window.removeEventListener('mock_store_updated', updateStats);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Report Lost', href: '/report/lost', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z', badge: 'Lost' },
    { name: 'Report Found', href: '/report/found', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', badge: 'Found' },
    { name: 'My Items', href: '/my-items', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Matches', href: '/matches', icon: 'M13 10V3L4 14h7v7l9-11h-7z', badgeCount: matchCount },
    { name: 'Messages', href: '/messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  ];

  if (user?.role === 'admin') {
    navigation.push({
      name: 'Admin Panel',
      href: '/admin',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Light Theme Glassmorphism Top Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm lg:text-base font-extrabold text-slate-900 tracking-tight">Campus-Lost-Found-Peer-to-Peer-Resource-Sharing-</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 tracking-wide uppercase flex-shrink-0">SSPU</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal truncate">Campus Peer-to-Peer Resource Sharing & Item Recovery</p>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <div className="hidden lg:flex items-center space-x-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <svg className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span>{item.name}</span>
                      {item.badgeCount !== undefined && item.badgeCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs font-semibold bg-blue-600 text-white">
                          {item.badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Controls: Persona Switcher & User Profile */}
            <div className="flex items-center gap-3">
              {/* Persona Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200 transition-colors text-left"
                  title="Click to switch persona (Student / Admin)"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    user?.role === 'admin' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-semibold text-slate-800 leading-tight flex items-center gap-1.5">
                      {user?.name || 'Guest User'}
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                        user?.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user?.role === 'admin' ? 'Admin' : 'Student'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal">Switch Persona ▾</div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Persona</p>
                      <p className="text-xs text-slate-500">Test different views instantly</p>
                    </div>
                    <div className="py-1">
                      {availableUsers.map((u) => (
                        <button
                          key={u.uid}
                          onClick={() => {
                            loginAs(u);
                            setShowUserMenu(false);
                            if (u.role === 'admin') {
                              router.push('/admin');
                            }
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm hover:bg-slate-50 transition-colors ${
                            user?.uid === u.uid ? 'bg-blue-50/70 text-blue-700 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-900 truncate">{u.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {u.role === 'admin' ? 'Admin' : 'Student'}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          signOut();
                          router.push('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log out to Landing Page
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Report Button */}
              <Link
                href="/report/lost"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Report Item
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Navigation */}
        <div className="lg:hidden border-t border-slate-100 overflow-x-auto py-2 px-4 flex gap-1 scrollbar-none">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-600 bg-slate-100'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {children}
      </main>

      {/* Modern Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">Campus Demo Mode Active</span>
            <span>• Pre-loaded realistic campus data & local storage</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Shri Shankaracharya Technical Campus</span>
            <span>•</span>
            <button
              onClick={() => {
                if (confirm('Reset mock data back to default?')) {
                  mockStore.resetToDefault();
                  window.location.reload();
                }
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Reset Mock Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
