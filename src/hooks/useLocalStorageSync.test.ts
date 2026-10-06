import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { useLocalStorageSync } from './useLocalStorageSync';

describe('useLocalStorageSync', () => {
  beforeEach(() => localStorage.clear());

  it('ghi và cập nhật giá trị trong localStorage', () => {
    const { rerender } = renderHook(({ value }) => useLocalStorageSync('test-key', value), {
      initialProps: { value: ['first'] },
    });
    expect(localStorage.getItem('test-key')).toBe('["first"]');

    rerender({ value: ['second'] });
    expect(localStorage.getItem('test-key')).toBe('["second"]');
  });
});