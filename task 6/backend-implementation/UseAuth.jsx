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
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession]   = useState(null);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);

  // ── Fetch profile row ──────────────────────────────────────
  const fetchProfile = useCallback(async (userId) => {
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
  const signUp = useCallback(async ({ email, password, fullName, role = 'student' }) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    setLoading(false);
    if (error) throw error;
    return data;
  }, []);

  // ── Sign in ────────────────────────────────────────────────
  const signIn = useCallback(async ({ email, password }) => {
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
  const updateProfile = useCallback(async (updates) => {
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