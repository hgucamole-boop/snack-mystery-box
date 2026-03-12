import { create } from 'zustand';

export const useStore = create((set) => ({
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