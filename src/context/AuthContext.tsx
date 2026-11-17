import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (identifier: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ismp_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore session from localStorage on initial app load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (identifier: string): Promise<User> => {
    setLoading(true);
    try {
      const user = await authApi.login(identifier);
      setCurrentUser(user);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authApi.logout();
      setCurrentUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
