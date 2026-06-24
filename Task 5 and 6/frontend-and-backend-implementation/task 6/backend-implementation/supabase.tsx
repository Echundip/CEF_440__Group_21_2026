/**
 * supabase.ts
 * ─────────────────────────────────────────────────────────────
 * Supabase client — place this at: src/lib/supabase.ts
 *
 * Install dependencies:
 *   npx expo install @supabase/supabase-js @react-native-async-storage/async-storage expo-secure-store
 *
 * Add to app.json / app.config.js:
 *   "plugins": ["expo-secure-store"]
 *
 * Add to your .env (or app.config.js extra):
 *   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

// ── Secure storage adapter (tokens stored in SecureStore on device) ──
const ExpoSecureStoreAdapter = {
  getItem:    (key: string): Promise<string | null> => SecureStore.getItemAsync(key),
  setItem:    (key: string, value: string): Promise<void> => SecureStore.setItemAsync(key, value),
  removeItem: (key: string): Promise<void> => SecureStore.deleteItemAsync(key),
};

// Use SecureStore on native, AsyncStorage on web
const storage = Platform.OS === 'web' ? AsyncStorage : ExpoSecureStoreAdapter;

const SUPABASE_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error(
    'Missing Supabase env vars. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env',
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage,
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: false,
  },
});