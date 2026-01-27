/**
 * Accessibility i18n (Internationalization)
 * תרגומים ותמיכה בשפות לוידג'ט הנגישות
 * 
 * @module accessibility/i18n
 * @description
 * מכיל את כל התרגומים והפונקציות לתמיכה בריבוי שפות.
 * תומך בעברית (RTL) ואנגלית (LTR).
 * 
 * @example
 * ```tsx
 * import { useAccessibilityI18n, accessibilityTranslations } from './i18n';
 * 
 * const { t, language, isRTL } = useAccessibilityI18n({ defaultLanguage: 'he' });
 * console.log(t('title')); // "הגדרות נגישות"
 * ```
 */

export { accessibilityTranslations } from './translations';
export type { 
  AccessibilityLanguage, 
  AccessibilityTranslationKey, 
  AccessibilityTranslations 
} from './translations';

export { useAccessibilityI18n } from './useAccessibilityI18n';
export type { 
  UseAccessibilityI18nOptions, 
  UseAccessibilityI18nReturn 
} from './useAccessibilityI18n';
