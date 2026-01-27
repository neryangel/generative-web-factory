/**
 * Accessibility Widget Types
 * טיפוסים מרכזיים לווידג'ט הנגישות
 *
 * @module accessibility/types
 */

import { MIN_FONT_SIZE_LEVEL } from './constants';

/**
 * ממשק להגדרות נגישות
 */
export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  highlightLinks: boolean;
  pauseAnimations: boolean;
  largeCursor: boolean;
  readingMask: boolean;
  grayscale: boolean;
  textSpacing: boolean;
  dyslexiaFont: boolean;
}

/**
 * הגדרות ברירת מחדל (מקור יחיד — single source of truth)
 */
export const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: MIN_FONT_SIZE_LEVEL,
  highContrast: false,
  highlightLinks: false,
  pauseAnimations: false,
  largeCursor: false,
  readingMask: false,
  grayscale: false,
  textSpacing: false,
  dyslexiaFont: false,
};
