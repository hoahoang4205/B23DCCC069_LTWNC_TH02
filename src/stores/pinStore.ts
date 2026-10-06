import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
  clearPins: () => void;
}

export const usePinStore = create<PinState>()(
  persist(
    (set, get) => ({
      pinnedIds: [],

      togglePin: (id) => {
        const exists = get().pinnedIds.includes(id);
        set({
          pinnedIds: exists
            ? get().pinnedIds.filter((pinnedId) => pinnedId !== id)
            : [...get().pinnedIds, id],
        });
      },

      isPinned: (id) => get().pinnedIds.includes(id),

      clearPins: () => set({ pinnedIds: [] }),
    }),
    { name: 'pinned-assignments' },
  ),
);