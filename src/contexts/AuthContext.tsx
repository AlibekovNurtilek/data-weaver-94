//AuthContext.tsx


import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, getMe, logoutUser } from '@/lib/api';

interface User {
  username: string;
  role: string;
  id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current user from server (cookie-based session)
  const loadCurrentUser = async () => {
    try {
      const response = await getMe();
      if (response.ok) {
        const data = await response.json();
        setUser(data as User);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadCurrentUser().finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser(username, password);
      if (response.ok) {
        // Cookie is set by server; fetch current user
        await loadCurrentUser();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};