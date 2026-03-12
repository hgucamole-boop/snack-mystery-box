'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { SnackDetailModal } from './SnackDetailModal';

const SnackModalContext = createContext(null);

export function useSnackModal() {
  const ctx = useContext(SnackModalContext);
  if (!ctx) throw new Error('useSnackModal must be used within SnackModalProvider');
  return ctx;
}

export function SnackModalProvider({ children }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const openSnack = useCallback((item) => {
    setSelectedItem(item);
  }, []);

  return (
    <SnackModalContext.Provider value={{ openSnack }}>
      {children}
      <SnackDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </SnackModalContext.Provider>
  );
}