import { create } from 'zustand';
import type { Profile, SnackItem, Drop } from '@/lib/supabase';

interface AppState {
  // User state
  user: Profile | null;
  setUser: (user: Profile | null) => void;
  updateCredits: (credits: number) => void;
  
  // Drop state
  selectedCase: 'snack_crate' | 'premium_box' | 'legend_drop';
  setSelectedCase: (caseType: 'snack_crate' | 'premium_box' | 'legend_drop') => void;
  multiOpenCount: 1 | 3 | 5;
  setMultiOpenCount: (count: 1 | 3 | 5) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  
  // Live feed
  liveDrops: Drop[];
  addLiveDrop: (drop: Drop) => void;
  setLiveDrops: (drops: Drop[]) => void;
  
  // Snack items
  snackItems: SnackItem[];
  setSnackItems: (items: SnackItem[]) => void;
}

export const useStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  updateCredits: (credits) => set((state) => ({
    user: state.user ? { ...state.user, credits } : null
  })),
  
  // Drop
  selectedCase: 'snack_crate',
  setSelectedCase: (caseType) => set({ selectedCase: caseType }),
  multiOpenCount: 1,
  setMultiOpenCount: (count) => set({ multiOpenCount: count }),
  isSpinning: false,
  setIsSpinning: (spinning) => set({ isSpinning: spinning }),
  
  // Live feed
  liveDrops: [],
  addLiveDrop: (drop) => set((state) => ({
    liveDrops: [drop, ...state.liveDrops].slice(0, 50)
  })),
  setLiveDrops: (drops) => set({ liveDrops: drops }),
  
  // Snack items
  snackItems: [],
  setSnackItems: (items) => set({ snackItems: items }),
}));
