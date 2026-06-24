/**
 * useAuth.jsx
 * ─────────────────────────────────────────────────────────────
 * Authentication hook — place at: hooks/useAuth.jsx
 *
 * Provides: session, profile, loading, signUp, signIn, signOut
 *
 * Usage:
 *   const { session, profile, signIn, signOut } = useAuth();
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../backend-implementation/supabase'
import type { Session } from '@supabase/supabase-js';

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  role?: string;
}

interface SignInParams {
  email: string;
  password: string;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null); // or define a Profile interface
  const [loading, setLoading]   = useState(true);

  // ── Fetch profile row ──────────────────────────────────────
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) console.error('fetchProfile:', error.message);
    else setProfile(data);
  }, []);

  // ── Listen for auth state changes ─────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) fetchProfile(session.user.id);
        else setProfile(null);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── Sign up (role passed as user_metadata) ─────────────────
  const signUp = useCallback(async ({
  email,
  password,
  fullName,
  role = 'student',
}: SignUpParams) => {
  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    setLoading(false);
    throw error;
  }

  const user = data.user;

  if (user) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName,
      role: role,
    });
  }

  setLoading(false);
  return data;
}, []);

  // ── Sign in ────────────────────────────────────────────────
  const signIn = useCallback(async ({
    email,
    password,
  }: SignInParams) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) throw error;
    return data;
  }, []);

  // ── Sign out ───────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  // ── Update profile ─────────────────────────────────────────
  const updateProfile = useCallback(async (updates: Record<string, unknown>) => {
    if (!session?.user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  }, [session]);

  return { session, profile, loading, signUp, signIn, signOut, updateProfile };
}