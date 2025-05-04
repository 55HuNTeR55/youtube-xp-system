import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  level: number;
  xp: number;
  subscription?: string;
  subscriptionExpiry?: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserXP: (amount: number) => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async () => {
    try {
      // Mock sign in
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        picture: 'https://via.placeholder.com/150',
        level: 1,
        xp: 0,
        joinDate: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (err) {
      setError('Failed to sign in');
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      setError('Failed to sign out');
    }
  };

  const updateUserXP = (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        xp: user.xp + amount,
        level: Math.floor((user.xp + amount) / 1000) + 1,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut, updateUserXP, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 