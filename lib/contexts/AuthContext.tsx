'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/lib/supabase/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole | null;
  isAdmin: () => boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('[AuthContext] Fetching user role for userId:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[AuthContext] Error fetching user role:', error);
        throw error;
      }
      
      console.log('[AuthContext] User role data:', data);
      setRole(data?.role || null);
    } catch (error) {
      console.error('[AuthContext] Error fetching user role:', error);
      setRole(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = () => {
    return role === 'admin';
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] signIn attempt:', {
        email: email,
        emailLength: email.length,
        emailTrimmed: email.trim(),
        passwordLength: password.length,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[AuthContext] signIn response:', {
        error: error ? error.message : null,
        errorStatus: error ? (error as any).status : null,
        errorName: error ? (error as any).name : null,
        data: data ? {
          user: data.user ? { id: data.user.id, email: data.user.email } : null,
          session: data.session ? 'exists' : 'none'
        } : null,
        timestamp: new Date().toISOString()
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      console.error('[AuthContext] signIn unexpected error:', error);
      return { error: 'Terjadi kesalahan saat login' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Log the signup attempt for debugging
      console.log('[AuthContext] signUp attempt:', {
        email: email,
        emailLength: email.length,
        emailTrimmed: email.trim(),
        name: name,
        passwordLength: password.length,
        timestamp: new Date().toISOString()
      });

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      // Log the response from Supabase
      console.log('[AuthContext] signUp response:', {
        error: error ? error.message : null,
        errorStatus: error ? (error as any).status : null,
        errorName: error ? (error as any).name : null,
        data: data ? {
          user: data.user ? { id: data.user.id, email: data.user.email } : null,
          session: data.session ? 'exists' : 'none'
        } : null,
        timestamp: new Date().toISOString()
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Terjadi kesalahan saat mendaftar' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        role,
        isAdmin,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
