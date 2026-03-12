'use client';
import Drop from './Drop';
import { SnackModalProvider } from './components/SnackModalProvider';
export default function DropPage() {
  return (
  <SnackModalProvider>
    <Drop />;
  </SnackModalProvider>)
}