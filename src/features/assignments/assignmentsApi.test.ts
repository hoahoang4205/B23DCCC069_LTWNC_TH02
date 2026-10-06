import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { fetchMockAssignments } from './assignmentsApi';

describe('fetchMockAssignments', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('trả mock response sau delay', async () => {
    jest.useFakeTimers();
    const response = fetchMockAssignments();
    jest.advanceTimersByTime(800);

    await expect(response).resolves.toMatchObject({
      statusCode: 200,
      data: expect.any(Array),
    });
  });
});