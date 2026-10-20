'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { mockStore, MOCK_USERS } from '@/lib/mockStore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginAs: (user: User) => void;
  loginWithEmail: (email: string, name?: string, role?: 'user' | 'admin') => void;
  signOut: () => void;
  availableUsers: User[];
  setUserRole: (role: 'user' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginAs: () => {},
  loginWithEmail: () => {},
  signOut: () => {},
  availableUsers: MOCK_USERS,
  setUserRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load from mock store
    const currentUser = mockStore.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    const handleUpdate = () => {
      const u = mockStore.getCurrentUser();
      setUser(u);
    };

    window.addEventListener('mock_store_updated', handleUpdate);
    return () => window.removeEventListener('mock_store_updated', handleUpdate);
  }, []);

  const loginAs = (selectedUser: User) => {
    mockStore.setCurrentUser(selectedUser);
    setUser(selectedUser);
  };

  const loginWithEmail = (email: string, name?: string, role: 'user' | 'admin' = 'user') => {
    const existing = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      loginAs(existing);
      return;
    }
    const newUser: User = {
      uid: `user_${Date.now()}`,
      name: name || email.split('@')[0].replace('.', ' '),
      email,
      role,
      createdAt: new Date(),
    };
    loginAs(newUser);
  };

  const signOut = () => {
    // For local mock experience, setting user to null takes them back to landing / login
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sstc_mock_current_user_v2');
      window.dispatchEvent(new Event('mock_store_updated'));
    }
  };

  const setUserRole = (role: 'user' | 'admin') => {
    if (!user) return;
    const updated = { ...user, role };
    loginAs(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAs,
        loginWithEmail,
        signOut,
        availableUsers: MOCK_USERS,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
