// lib/supabase.ts
// Supabase stub — no account needed yet
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ 
      data: { subscription: { unsubscribe: () => {} } } 
    }),
    signOut: async () => {},
    signInWithPassword: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
  }
} as any;

export type Profile = {
  id: string;
  username: string;
  credits: number;
  created_at: string;
};

export type SnackItem = {
  id: number;
  name: string;
  emoji: string;
  country: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'ULTRA';
  retail_value: number;
};

export type Drop = {
  id: number;
  user_id: string;
  case_type: string;
  item_id: number;
  created_at: string;
  snack_items?: SnackItem;
  profiles?: { username: string };
};