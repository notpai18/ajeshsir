import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthorizedProf: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthorizedProf: false,
  loading: true,
  login: async () => false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasSupabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string) => {
    if (!hasSupabase) {
      console.error("Login failed: Supabase is not configured.");
      return false;
    }

    // We map the simple 'admin' username to a hidden email for Supabase Auth
    const email = `${username.toLowerCase()}@ajeshsir.com`;
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login failed:", error);
      return false;
    }
    return true;
  };

  const logout = async () => {
    if (!hasSupabase) return;
    await supabase.auth.signOut();
  };

  // If there is any logged in user, they are considered the authorized professor
  // since students don't have accounts.
  const isAuthorizedProf = !!user;

  return (
    <AuthContext.Provider value={{ user, session, isAuthorizedProf, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
