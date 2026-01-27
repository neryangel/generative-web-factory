/**
 * Client-side rate limiting utility
 * Prevents users from spamming API calls
 */

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

interface RateLimitState {
  count: number;
  resetTime: number;
}

// Store rate limit state per key
const rateLimitStore = new Map<string, RateLimitState>();

/**
 * Check if an action is rate limited
 * @param key - Unique identifier for the rate limit (e.g., 'create-site', 'ai-generate')
 * @param config - Rate limit configuration
 * @returns Object with isLimited flag and remaining requests/time
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): {
  isLimited: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const state = rateLimitStore.get(key);

  // No existing state or window has expired - reset
  if (!state || now >= state.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      isLimited: false,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  // Window is still active
  if (state.count >= config.maxRequests) {
    return {
      isLimited: true,
      remaining: 0,
      resetIn: state.resetTime - now,
    };
  }

  // Increment count
  state.count++;
  rateLimitStore.set(key, state);

  return {
    isLimited: false,
    remaining: config.maxRequests - state.count,
    resetIn: state.resetTime - now,
  };
}

/**
 * Create a rate-limited function wrapper
 * @param key - Unique identifier for the rate limit
 * @param fn - Function to wrap
 * @param config - Rate limit configuration
 * @param onLimited - Callback when rate limited
 */
export function withRateLimit<T extends (...args: unknown[]) => Promise<unknown>>(
  key: string,
  fn: T,
  config: RateLimitConfig,
  onLimited?: (resetIn: number) => void
): T {
  return (async (...args: Parameters<T>) => {
    const { isLimited, resetIn } = checkRateLimit(key, config);

    if (isLimited) {
      onLimited?.(resetIn);
      throw new RateLimitError(
        `Rate limit exceeded. Please wait ${Math.ceil(resetIn / 1000)} seconds.`,
        resetIn
      );
    }

    return fn(...args);
  }) as T;
}

/**
 * Custom error class for rate limiting
 */
export class RateLimitError extends Error {
  public resetIn: number;

  constructor(message: string, resetIn: number) {
    super(message);
    this.name = 'RateLimitError';
    this.resetIn = resetIn;
  }
}

/**
 * Predefined rate limit configurations
 */
export const RateLimits = {
  // AI generation - 5 requests per minute
  AI_GENERATE: {
    maxRequests: 5,
    windowMs: 60 * 1000,
  },
  // Site creation - 10 requests per minute
  CREATE_SITE: {
    maxRequests: 10,
    windowMs: 60 * 1000,
  },
  // Publishing - 20 requests per minute
  PUBLISH: {
    maxRequests: 20,
    windowMs: 60 * 1000,
  },
  // Domain operations - 10 requests per minute
  DOMAIN: {
    maxRequests: 10,
    windowMs: 60 * 1000,
  },
  // General API calls - 100 requests per minute
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000,
  },
} as const;

/**
 * Format reset time for user display
 */
export function formatResetTime(resetIn: number): string {
  const seconds = Math.ceil(resetIn / 1000);
  if (seconds < 60) {
    return `${seconds} שניות`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} דקות`;
}
