import { createClient } from '@supabase/supabase-js';

const getEnv = (key) => {
  try {
    return import.meta.env[key] || '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Create a single supabase client for interacting with your database
let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Supabase initialization failed:', err.message);
  }
}

export const supabase = supabaseInstance;

if (!supabase) {
  console.warn('Supabase URL or Anon Key is missing or invalid. Supabase features will not work.');
}
