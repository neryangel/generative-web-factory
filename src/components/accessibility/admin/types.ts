/**
 * Accessibility Widget Admin Types
 * טיפוסים להגדרות אדמין של ווידג'ט הנגישות
 */

/** אייקונים זמינים לכפתור הנגישות */
export type TriggerIconType = 
  | 'accessibility' 
  | 'wheelchair' 
  | 'eye' 
  | 'hand' 
  | 'universal';

/** צורות כפתור */
export type TriggerShape = 'circle' | 'square' | 'rounded';

/** גדלי כפתור */
export type TriggerSize = 'small' | 'medium' | 'large';

/** מיקום אופקי */
export type HorizontalPosition = 'left' | 'right';

/** מיקום אנכי */
export type VerticalPosition = 'top' | 'center' | 'bottom';

/** הגדרות הכפתור (Trigger) */
export interface TriggerSettings {
  color: string;
  icon: TriggerIconType;
  shape: TriggerShape;
  size: TriggerSize;
  horizontalPosition: HorizontalPosition;
  verticalPosition: VerticalPosition;
  offsetX: number;
  offsetY: number;
  showOnDesktop: boolean;
  showOnMobile: boolean;
  allowDragging: boolean;
}

/** הגדרות ממשק (Interface) */
export interface InterfaceSettings {
  primaryColor: string;
  defaultLanguage: 'he' | 'en';
  footerText: string;
  showStatementLink: boolean;
  statementUrl: string;
}

/** הגדרות הצהרת נגישות */
export interface StatementSettings {
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
  lastUpdated: string;
}

/** תכונות נגישות שניתן להפעיל/לכבות */
export type AccessibilityFeatureKey = 
  | 'fontSize'
  | 'highContrast'
  | 'highlightLinks'
  | 'pauseAnimations'
  | 'largeCursor'
  | 'readingMask'
  | 'grayscale'
  | 'textSpacing'
  | 'dyslexiaFont';

/** הגדרות מתקדמות */
export interface AdvancedSettings {
  enabledFeatures: AccessibilityFeatureKey[];
  keyboardShortcut: string;
  collectStats: boolean;
}

/** כל הגדרות האדמין */
export interface WidgetAdminSettings {
  trigger: TriggerSettings;
  interface: InterfaceSettings;
  statement: StatementSettings;
  advanced: AdvancedSettings;
}

/** ברירות מחדל */
export const DEFAULT_ADMIN_SETTINGS: WidgetAdminSettings = {
  trigger: {
    color: '#0066CC',
    icon: 'accessibility',
    shape: 'circle',
    size: 'medium',
    horizontalPosition: 'left',
    verticalPosition: 'bottom',
    offsetX: 20,
    offsetY: 20,
    showOnDesktop: true,
    showOnMobile: true,
    allowDragging: true,
  },
  interface: {
    primaryColor: '#0066CC',
    defaultLanguage: 'he',
    footerText: '',
    showStatementLink: true,
    statementUrl: '/accessibility-statement',
  },
  statement: {
    coordinatorName: '',
    coordinatorPhone: '',
    coordinatorEmail: '',
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  advanced: {
    enabledFeatures: [
      'fontSize',
      'highContrast',
      'highlightLinks',
      'pauseAnimations',
      'largeCursor',
      'readingMask',
      'grayscale',
      'textSpacing',
      'dyslexiaFont',
    ],
    keyboardShortcut: 'Alt+A',
    collectStats: false,
  },
};

/** מפתח לשמירה ב-localStorage */
export const ADMIN_SETTINGS_STORAGE_KEY = 'accessibility-admin-settings';
