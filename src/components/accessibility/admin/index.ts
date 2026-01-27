/**
 * Accessibility Admin - Entry Point
 * ייצוא רכיבי הניהול של ווידג'ט הנגישות
 */

// Main component
export { AccessibilityAdmin } from './AccessibilityAdmin';
export type { AccessibilityAdminProps } from './AccessibilityAdmin';

// Hook
export { useAdminSettings } from './useAdminSettings';
export type { UseAdminSettingsReturn } from './useAdminSettings';

// Types
export * from './types';

// Translations
export { adminTranslations } from './translations';
export type { AdminLanguage, AdminTranslationKey } from './translations';
