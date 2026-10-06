import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('chỉ cập nhật giá trị sau khi delay kết thúc', () => {
    jest.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    expect(result.current).toBe('a');
    rerender({ value: 'b' });
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('b');
  });
});