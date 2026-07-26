import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, hasSupabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { AUTHORIZED_EMAILS, DEFAULT_PROF_PASSWORD } from '../constants/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthorizedProf: boolean;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setDemoAuth: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthorizedProf: false,
  loading: true,
  login: async () => false,
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
    if (!hasSupabase || !supabase?.auth) {
      setLoading(false);
      return;
    }

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
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    const raw = usernameOrEmail.trim().toLowerCase();
    const email = raw.includes('@') ? raw : `${raw}@ajeshsir.com`;

    let loggedIn = false;
    if (hasSupabase && supabase?.auth) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!error) loggedIn = true;
      } catch (err) {
        console.warn('Supabase login error:', err);
      }
    }

    if (!loggedIn) {
      const isAuthEmail = AUTHORIZED_EMAILS.map(e => e.toLowerCase()).includes(email);
      if ((isAuthEmail || raw === 'admin' || raw === 'professor') && (password === DEFAULT_PROF_PASSWORD || password === 'AjeshSir@2026!')) {
        try {
          localStorage.setItem('prof_demo_auth', 'true');
        } catch {}
        setDemoProf(true);
        loggedIn = true;
      }
    }

    return loggedIn;
  };

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

  const isAuthorizedProf = demoProf || !!user;

  return (
    <AuthContext.Provider value={{ user, session, isAuthorizedProf, loading, login, logout, setDemoAuth: setDemoProf }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
