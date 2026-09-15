import { useEffect } from 'react';

export function useLocalStorageSync<T>(key: string, value: T): void {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
}
