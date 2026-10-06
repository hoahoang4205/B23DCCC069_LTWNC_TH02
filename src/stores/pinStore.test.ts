import { beforeEach, describe, expect, it } from '@jest/globals';
import { usePinStore } from './pinStore';

describe('usePinStore', () => {
  beforeEach(() => {
    usePinStore.persist.clearStorage();
    usePinStore.getState().clearPins();
  });

  it('ghim, bỏ ghim và xóa toàn bộ pin', () => {
    const store = usePinStore.getState();
    store.togglePin('a1');
    expect(usePinStore.getState().isPinned('a1')).toBe(true);

    usePinStore.getState().togglePin('a1');
    expect(usePinStore.getState().isPinned('a1')).toBe(false);

    usePinStore.getState().togglePin('a2');
    usePinStore.getState().clearPins();
    expect(usePinStore.getState().pinnedIds).toEqual([]);
  });
});