import { describe, it, expect } from 'vitest';
import { ApiError, parseSupabaseError, withApiError } from './api-error';
import type { ApiErrorCode } from './api-error';

describe('ApiError', () => {
  it('should create an error with all properties', () => {
    const error = new ApiError({
      code: 'AUTH_ERROR',
      message: 'Token expired',
      hint: 'Please sign in again',
      retryable: false,
      originalError: new Error('jwt expired'),
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.name).toBe('ApiError');
    expect(error.code).toBe('AUTH_ERROR');
    expect(error.message).toBe('Token expired');
    expect(error.hint).toBe('Please sign in again');
    expect(error.retryable).toBe(false);
    expect(error.originalError).toBeInstanceOf(Error);
  });

  it('should work without optional fields', () => {
    const error = new ApiError({
      code: 'UNKNOWN',
      message: 'Something failed',
      retryable: true,
    });

    expect(error.hint).toBeUndefined();
    expect(error.originalError).toBeUndefined();
  });

  describe('getUserMessage', () => {
    const cases: Array<{ code: ApiErrorCode; expectedSubstring: string }> = [
      { code: 'NETWORK_ERROR', expectedSubstring: 'חיבור' },
      { code: 'AUTH_ERROR', expectedSubstring: 'להתחבר' },
      { code: 'FORBIDDEN', expectedSubstring: 'הרשאה' },
      { code: 'NOT_FOUND', expectedSubstring: 'לא נמצא' },
      { code: 'VALIDATION_ERROR', expectedSubstring: 'תקינים' },
      { code: 'CONFLICT', expectedSubstring: 'זהים' },
      { code: 'RATE_LIMITED', expectedSubstring: 'בקשות' },
      { code: 'SERVER_ERROR', expectedSubstring: 'שרת' },
      { code: 'UNKNOWN', expectedSubstring: 'שגיאה' },
    ];

    it.each(cases)(
      'should return Hebrew message for $code',
      ({ code, expectedSubstring }) => {
        const error = new ApiError({
          code,
          message: 'test',
          retryable: false,
        });
        expect(error.getUserMessage()).toContain(expectedSubstring);
      }
    );

    it('should return a non-empty string for every error code', () => {
      const codes: ApiErrorCode[] = [
        'NETWORK_ERROR', 'AUTH_ERROR', 'FORBIDDEN', 'NOT_FOUND',
        'VALIDATION_ERROR', 'CONFLICT', 'RATE_LIMITED', 'SERVER_ERROR', 'UNKNOWN',
      ];
      for (const code of codes) {
        const error = new ApiError({ code, message: 'test', retryable: false });
        expect(error.getUserMessage().length).toBeGreaterThan(0);
      }
    });
  });
});

describe('parseSupabaseError', () => {
  it('should handle null/undefined input', () => {
    const result = parseSupabaseError(null);
    expect(result).toBeInstanceOf(ApiError);
    expect(result.code).toBe('UNKNOWN');
    expect(result.retryable).toBe(true);
  });

  it('should handle undefined input', () => {
    const result = parseSupabaseError(undefined);
    expect(result.code).toBe('UNKNOWN');
  });

  describe('network errors', () => {
    it('should detect "Failed to fetch"', () => {
      const result = parseSupabaseError({ message: 'Failed to fetch' });
      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.retryable).toBe(true);
    });

    it('should detect "Network" in message', () => {
      const result = parseSupabaseError({ message: 'Network Error' });
      expect(result.code).toBe('NETWORK_ERROR');
    });

    it('should detect "ECONNREFUSED"', () => {
      const result = parseSupabaseError({ message: 'ECONNREFUSED' });
      expect(result.code).toBe('NETWORK_ERROR');
    });
  });

  describe('auth errors', () => {
    it('should detect PGRST301', () => {
      const result = parseSupabaseError({ code: 'PGRST301', message: 'JWT expired' });
      expect(result.code).toBe('AUTH_ERROR');
      expect(result.retryable).toBe(false);
    });

    it('should detect code 401', () => {
      const result = parseSupabaseError({ code: '401', message: 'Unauthorized' });
      expect(result.code).toBe('AUTH_ERROR');
    });

    it('should detect invalid_token', () => {
      const result = parseSupabaseError({ code: 'invalid_token', message: 'bad token' });
      expect(result.code).toBe('AUTH_ERROR');
    });
  });

  describe('forbidden errors', () => {
    it('should detect code 403', () => {
      const result = parseSupabaseError({ code: '403', message: 'Forbidden' });
      expect(result.code).toBe('FORBIDDEN');
      expect(result.retryable).toBe(false);
    });

    it('should detect PGRST403', () => {
      const result = parseSupabaseError({ code: 'PGRST403', message: 'Insufficient privilege' });
      expect(result.code).toBe('FORBIDDEN');
    });

    it('should preserve hint from original error', () => {
      const result = parseSupabaseError({ code: '403', message: 'Forbidden', hint: 'Check RLS' });
      expect(result.hint).toBe('Check RLS');
    });
  });

  describe('not found errors', () => {
    it('should detect PGRST116', () => {
      const result = parseSupabaseError({ code: 'PGRST116', message: 'Not found' });
      expect(result.code).toBe('NOT_FOUND');
      expect(result.retryable).toBe(false);
    });

    it('should detect code 404', () => {
      const result = parseSupabaseError({ code: '404', message: 'Not found' });
      expect(result.code).toBe('NOT_FOUND');
    });
  });

  describe('conflict errors', () => {
    it('should detect unique constraint violation (23505)', () => {
      const result = parseSupabaseError({
        code: '23505',
        message: 'duplicate key value violates unique constraint',
        hint: 'Key already exists',
      });
      expect(result.code).toBe('CONFLICT');
      expect(result.retryable).toBe(false);
      expect(result.message).toBe('A record with this value already exists');
    });
  });

  describe('validation errors', () => {
    it('should detect foreign key violation (23503)', () => {
      const result = parseSupabaseError({
        code: '23503',
        message: 'violates foreign key constraint',
      });
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.message).toBe('Referenced record does not exist');
    });

    it('should detect check constraint violation (23514)', () => {
      const result = parseSupabaseError({
        code: '23514',
        message: 'violates check constraint',
      });
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.message).toBe('Data validation failed');
    });
  });

  describe('rate limiting', () => {
    it('should detect code 429', () => {
      const result = parseSupabaseError({ code: '429', message: 'Too many requests' });
      expect(result.code).toBe('RATE_LIMITED');
      expect(result.retryable).toBe(true);
    });

    it('should detect "rate limit" in message', () => {
      const result = parseSupabaseError({ code: 'some_code', message: 'rate limit exceeded' });
      expect(result.code).toBe('RATE_LIMITED');
    });
  });

  describe('server errors', () => {
    it('should detect 5xx codes', () => {
      const result = parseSupabaseError({ code: '500', message: 'Internal server error' });
      expect(result.code).toBe('SERVER_ERROR');
      expect(result.retryable).toBe(true);
    });

    it('should detect 503', () => {
      const result = parseSupabaseError({ code: '503', message: 'Service unavailable' });
      expect(result.code).toBe('SERVER_ERROR');
    });

    it('should detect PGRST500', () => {
      const result = parseSupabaseError({ code: 'PGRST500', message: 'DB error' });
      expect(result.code).toBe('SERVER_ERROR');
    });
  });

  describe('unknown errors', () => {
    it('should fall back to UNKNOWN for unrecognized errors', () => {
      const result = parseSupabaseError({ message: 'Something weird happened' });
      expect(result.code).toBe('UNKNOWN');
      expect(result.retryable).toBe(true);
    });

    it('should preserve the original error object', () => {
      const original = { code: '403', message: 'Forbidden' };
      const result = parseSupabaseError(original);
      expect(result.originalError).toBe(original);
    });

    it('should use "Unknown error" when message is missing', () => {
      const result = parseSupabaseError({});
      expect(result.message).toBe('Unknown error');
    });
  });
});

describe('withApiError', () => {
  it('should return data on successful operation', async () => {
    const result = await withApiError(async () => ({
      data: { id: '1', name: 'Test' },
      error: null,
    }));

    expect(result).toEqual({ id: '1', name: 'Test' });
  });

  it('should throw ApiError when operation returns an error', async () => {
    await expect(
      withApiError(async () => ({
        data: null,
        error: { code: '403', message: 'Forbidden' },
      }))
    ).rejects.toThrow(ApiError);

    try {
      await withApiError(async () => ({
        data: null,
        error: { code: '403', message: 'Forbidden' },
      }));
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).code).toBe('FORBIDDEN');
    }
  });

  it('should throw NOT_FOUND when data is null and no error', async () => {
    await expect(
      withApiError(async () => ({
        data: null,
        error: null,
      }))
    ).rejects.toThrow(ApiError);

    try {
      await withApiError(async () => ({
        data: null,
        error: null,
      }));
    } catch (e) {
      expect((e as ApiError).code).toBe('NOT_FOUND');
      expect((e as ApiError).message).toBe('No data returned');
    }
  });

  it('should return falsy data values that are not null', async () => {
    // 0 is falsy but not null
    const result = await withApiError(async () => ({
      data: 0 as unknown,
      error: null,
    }));
    expect(result).toBe(0);
  });

  it('should return empty string data', async () => {
    const result = await withApiError(async () => ({
      data: '' as unknown,
      error: null,
    }));
    expect(result).toBe('');
  });

  it('should return empty array data', async () => {
    const result = await withApiError(async () => ({
      data: [],
      error: null,
    }));
    expect(result).toEqual([]);
  });

  it('should prioritize error over data when both present', async () => {
    await expect(
      withApiError(async () => ({
        data: { id: '1' },
        error: { code: '500', message: 'Server error' },
      }))
    ).rejects.toThrow(ApiError);
  });
});
