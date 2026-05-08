import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const triggerHaptic = (type: 'success' | 'error' | 'warning') => {
  if (typeof window === 'undefined' || !("vibrate" in navigator)) return;
  switch (type) {
    case 'success': navigator.vibrate([100]); break;
    case 'warning': navigator.vibrate([200, 100, 200]); break;
    case 'error': navigator.vibrate([500, 100, 500]); break;
  }
};
