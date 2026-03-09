'use client';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type SnackItemData } from '../../data/snackItems';
import { SnackDetailModal } from './SnackDetailModal';

interface SnackModalContextValue {
  openSnack: (item: SnackItemData) => void;
}

const SnackModalContext = createContext<SnackModalContextValue | null>(null);

export function useSnackModal() {
  const ctx = useContext(SnackModalContext);
  if (!ctx) throw new Error('useSnackModal must be used within SnackModalProvider');
  return ctx;
}

export function SnackModalProvider({ children }: { children: ReactNode }) {
  const [selectedItem, setSelectedItem] = useState<SnackItemData | null>(null);

  const openSnack = useCallback((item: SnackItemData) => {
    setSelectedItem(item);
  }, []);

  return (
    <SnackModalContext.Provider value={{ openSnack }}>
      {children}
      <SnackDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </SnackModalContext.Provider>
  );
}
