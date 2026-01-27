/**
 * Application logger that only outputs in development.
 * In production, all log/warn/debug calls are silenced.
 * Errors are always logged (they indicate real problems).
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  /** Debug info - only in development */
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },

  /** Warnings - only in development */
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },

  /** Debug level - only in development */
  debug: (...args: unknown[]) => {
    if (isDev) console.debug(...args);
  },

  /** Errors - always logged (these indicate real problems) */
  error: (...args: unknown[]) => {
    console.error(...args);
  },
};
