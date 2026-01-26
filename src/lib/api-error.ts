/**
 * Standardized API error handling
 * Provides consistent error classification and messaging
 */

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'AUTH_ERROR'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export interface ApiErrorDetails {
  code: ApiErrorCode;
  message: string;
  originalError?: unknown;
  hint?: string;
  retryable: boolean;
}

/**
 * Custom API error class with structured error information
 */
export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly hint?: string;
  public readonly retryable: boolean;
  public readonly originalError?: unknown;

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = 'ApiError';
    this.code = details.code;
    this.hint = details.hint;
    this.retryable = details.retryable;
    this.originalError = details.originalError;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Returns a user-friendly error message in Hebrew
   */
  getUserMessage(): string {
    switch (this.code) {
      case 'NETWORK_ERROR':
        return 'בעיית חיבור לרשת. אנא בדוק את החיבור לאינטרנט ונסה שוב.';
      case 'AUTH_ERROR':
        return 'יש להתחבר מחדש למערכת.';
      case 'FORBIDDEN':
        return 'אין לך הרשאה לבצע פעולה זו.';
      case 'NOT_FOUND':
        return 'הפריט המבוקש לא נמצא.';
      case 'VALIDATION_ERROR':
        return 'הנתונים שהוזנו אינם תקינים. אנא בדוק ונסה שוב.';
      case 'CONFLICT':
        return 'קיים כבר פריט עם נתונים זהים.';
      case 'RATE_LIMITED':
        return 'יותר מדי בקשות. אנא המתן מספר שניות ונסה שוב.';
      case 'SERVER_ERROR':
        return 'שגיאת שרת. צוות התמיכה שלנו מטפל בבעיה.';
      default:
        return 'אירעה שגיאה בלתי צפויה. אנא נסה שוב.';
    }
  }
}

/**
 * Parse Supabase error and return structured ApiError
 */
export function parseSupabaseError(error: unknown): ApiError {
  // Handle null/undefined
  if (!error) {
    return new ApiError({
      code: 'UNKNOWN',
      message: 'An unknown error occurred',
      retryable: true,
      originalError: error,
    });
  }

  // Type guard for error-like objects
  const err = error as Record<string, unknown>;
  const code = err.code as string | undefined;
  const message = (err.message as string) || 'Unknown error';
  const hint = err.hint as string | undefined;

  // Network errors
  if (
    message.includes('Failed to fetch') ||
    message.includes('Network') ||
    message.includes('ECONNREFUSED')
  ) {
    return new ApiError({
      code: 'NETWORK_ERROR',
      message,
      hint: 'Check your internet connection',
      retryable: true,
      originalError: error,
    });
  }

  // PostgreSQL/Supabase error codes
  if (code) {
    // Auth errors (JWT expired, invalid, etc.)
    if (code === 'PGRST301' || code === '401' || code === 'invalid_token') {
      return new ApiError({
        code: 'AUTH_ERROR',
        message,
        hint: 'Please sign in again',
        retryable: false,
        originalError: error,
      });
    }

    // Forbidden
    if (code === '403' || code === 'PGRST403') {
      return new ApiError({
        code: 'FORBIDDEN',
        message,
        hint,
        retryable: false,
        originalError: error,
      });
    }

    // Not found
    if (code === 'PGRST116' || code === '404') {
      return new ApiError({
        code: 'NOT_FOUND',
        message,
        hint,
        retryable: false,
        originalError: error,
      });
    }

    // Unique constraint violation
    if (code === '23505') {
      return new ApiError({
        code: 'CONFLICT',
        message: 'A record with this value already exists',
        hint,
        retryable: false,
        originalError: error,
      });
    }

    // Foreign key violation
    if (code === '23503') {
      return new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Referenced record does not exist',
        hint,
        retryable: false,
        originalError: error,
      });
    }

    // Check constraint violation
    if (code === '23514') {
      return new ApiError({
        code: 'VALIDATION_ERROR',
        message: 'Data validation failed',
        hint,
        retryable: false,
        originalError: error,
      });
    }

    // Rate limiting
    if (code === '429' || message.includes('rate limit')) {
      return new ApiError({
        code: 'RATE_LIMITED',
        message,
        hint: 'Too many requests. Please wait before trying again.',
        retryable: true,
        originalError: error,
      });
    }

    // Server errors (5xx)
    if (code.startsWith('5') || code === 'PGRST500') {
      return new ApiError({
        code: 'SERVER_ERROR',
        message,
        hint,
        retryable: true,
        originalError: error,
      });
    }
  }

  // Default to unknown error
  return new ApiError({
    code: 'UNKNOWN',
    message,
    hint,
    retryable: true,
    originalError: error,
  });
}

/**
 * Wrapper for API calls that provides consistent error handling
 */
export async function withApiError<T>(
  operation: () => Promise<{ data: T | null; error: unknown }>
): Promise<T> {
  const { data, error } = await operation();

  if (error) {
    throw parseSupabaseError(error);
  }

  if (data === null) {
    throw new ApiError({
      code: 'NOT_FOUND',
      message: 'No data returned',
      retryable: false,
    });
  }

  return data;
}
