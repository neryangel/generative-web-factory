/**
 * Accessibility Widget Constants
 * קבועים לרכיב הנגישות - מונע שימוש ב-Magic Numbers
 * @module accessibility/constants
 */

/** גרסת הוידג'ט */
export const VERSION = '2.0.0';

/** מפתח לשמירת הגדרות נגישות ב-localStorage */
export const STORAGE_KEY = 'accessibility-settings';

/** מפתח לשמירת מצב הסתרה ב-localStorage */
export const HIDDEN_STORAGE_KEY = 'accessibility-widget-hidden';

/** מפתח לשמירת תאריך סיום הסתרה ב-localStorage */
export const HIDDEN_UNTIL_STORAGE_KEY = 'accessibility-widget-hidden-until';

/** מפתח לשמירת מצב מינימיזציה ב-localStorage */
export const MINIMIZED_STORAGE_KEY = 'accessibility-widget-minimized';

/** משכי הסתרה אפשריים (במילישניות) */
export const HIDE_DURATIONS = {
  /** סשן בלבד - sessionStorage */
  session: 0,
  /** יום אחד */
  day: 24 * 60 * 60 * 1000,
  /** שבוע */
  week: 7 * 24 * 60 * 60 * 1000,
  /** חודש */
  month: 30 * 24 * 60 * 60 * 1000,
  /** לצמיתות */
  forever: -1,
} as const;

/** סוגי הסתרה */
export type HideDuration = keyof typeof HIDE_DURATIONS;

/** גדלי גופן אפשריים לפי דרישות ת"י 5568 (100% עד 200%) */
export const FONT_SIZES = ['100%', '125%', '150%', '200%'] as const;

/** מספר רמות גודל גופן מינימלי */
export const MIN_FONT_SIZE_LEVEL = 0;

/** מספר רמות גודל גופן מקסימלי (200% לפי חוק הנגישות) */
export const MAX_FONT_SIZE_LEVEL = 3;

/** גובה מסכת הקריאה בפיקסלים */
export const READING_MASK_HEIGHT = 120;

/** זמן השהייה להודעות קוראי מסך (מילישניות) */
export const ANNOUNCE_DELAY_MS = 100;

/** אטימות שכבת מסכת הקריאה */
export const READING_MASK_OPACITY = 0.6;

// ============================================
// Z-INDEX Constants - לשמירה על עקביות שכבות
// ============================================

/** z-index למסכת הקריאה (מתחת לדיאלוג) */
export const Z_INDEX_READING_MASK = 9990;

/** z-index לכפתור ההפעלה */
export const Z_INDEX_TRIGGER = 9999;

/** z-index לדיאלוג הנגישות */
export const Z_INDEX_DIALOG = 10000;

/** גודל כפתור ממוזער בפיקסלים */
export const MINIMIZED_BUTTON_SIZE = 20;

