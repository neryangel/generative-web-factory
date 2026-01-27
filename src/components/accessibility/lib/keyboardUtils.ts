/**
 * Keyboard utilities for cross-platform support
 * Internal copy — replaces @/shared/lib for module independence.
 *
 * @module accessibility/lib/keyboardUtils
 */

/**
 * Detects if the current platform is macOS
 */
export const isMac = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return navigator.platform?.toLowerCase().includes('mac') ||
         navigator.userAgent?.toLowerCase().includes('mac');
};

/**
 * Returns the appropriate keyboard shortcut display for the accessibility widget
 * @returns '⌥A' for Mac, 'Alt+A' for other platforms
 */
export const getShortcutDisplay = (): string => {
  return isMac() ? '⌥A' : 'Alt+A';
};
