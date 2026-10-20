'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_USERS } from '@/lib/mockStore';

export default function Home() {
  const { user, loginAs, loginWithEmail } = useAuth();
  const router = useRouter();
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');

  const handleQuickLogin = (selectedUser: typeof MOCK_USERS[0]) => {
    loginAs(selectedUser);
    router.push(selectedUser.role === 'admin' ? '/admin' : '/dashboard');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    loginWithEmail(
      customEmail,
      customName || customEmail.split('@')[0],
      selectedRole
    );
    router.push(selectedRole === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">Campus-Lost-Found-Peer-to-Peer-Resource-Sharing-</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                  SSPU
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Shri Shankaracharya Technical Campus</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuickLogin(MOCK_USERS[0])}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-blue-500/25 hover:shadow-md transition-all"
            >
              Enter Campus Portal →
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Institutional Peer-to-Peer Resource & Item Recovery
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Recover What You Lost. <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Connect With Campus Finders.
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              No more chaotic WhatsApp groups or untracked notice boards. A dedicated, intelligent campus platform for students and faculty to post reports, get automated high-confidence matches, and communicate securely.
            </p>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                <p className="text-2xl font-bold text-blue-600">94%</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Match Accuracy</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                <p className="text-2xl font-bold text-indigo-600">15+</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Active Campus Items</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                <p className="text-2xl font-bold text-emerald-600">100%</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Privacy Protected</p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-base">
                  ⚡
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Intelligent Matching</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Category, keyword & location proximity analysis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-base">
                  💬
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">In-App Chat</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Chat directly without exposing personal phone numbers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Instant Profile Access Card (No Google Sign-In) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-blue-500/5 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full pointer-events-none"></div>

              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Instant Campus Access
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Enter Campus Portal</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose a persona below or start exploring immediately with built-in data.
                </p>
              </div>

              {/* Quick Persona Buttons */}
              <div className="space-y-2.5 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Persona</p>

                {MOCK_USERS.slice(0, 3).map((u) => (
                  <button
                    key={u.uid}
                    onClick={() => handleQuickLogin(u)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 transition-all flex items-center justify-between group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {u.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {u.role === 'admin' ? 'Faculty Admin' : 'Student'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{u.email}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      Login →
                    </span>
                  </button>
                ))}
              </div>

              {/* Direct Primary Action */}
              <button
                onClick={() => handleQuickLogin(MOCK_USERS[0])}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Portal as Student User</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Custom Login Collapsible / Divider */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <details className="group">
                  <summary className="text-xs font-medium text-slate-500 hover:text-slate-800 cursor-pointer flex items-center justify-between list-none">
                    <span>Or login with custom campus credentials</span>
                    <span className="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <form onSubmit={handleCustomLogin} className="mt-4 space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Campus Email (e.g. name@sspubhilai.com)"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as any)}
                        className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="user">Role: Student</option>
                        <option value="admin">Role: Admin</option>
                      </select>
                      <button
                        type="submit"
                        className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                      >
                        Sign In Now
                      </button>
                    </div>
                  </form>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Banner Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 Shri Shankaracharya Technical Campus (SSTC/SSPU) • TechSprint</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All systems local & online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
