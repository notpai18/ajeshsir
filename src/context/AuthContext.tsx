import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { AUTHORIZED_EMAILS } from '../constants/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthorizedProf: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  setDemoAuth: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthorizedProf: false,
  loading: true,
  logout: async () => {},
  setDemoAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoProf, setDemoProf] = useState(() => {
    try {
      return localStorage.getItem('prof_demo_auth') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (hasSupabase && supabase?.auth) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    if (hasSupabase && supabase?.auth) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    try {
      localStorage.removeItem('prof_demo_auth');
    } catch {}
    setDemoProf(false);
  };

  const isAuthorizedProf = demoProf || (!!user?.email && AUTHORIZED_EMAILS.map(e => e.toLowerCase()).includes(user.email.toLowerCase()));

  return (
    <AuthContext.Provider value={{ user, session, isAuthorizedProf, loading, logout, setDemoAuth: setDemoProf }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
