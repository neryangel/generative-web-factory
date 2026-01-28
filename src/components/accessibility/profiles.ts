/**
 * Accessibility Profiles - פרופילי נגישות מוכנים
 * פרופילים "חד-לחיצה" כמו בתעשייה (accessiBe, UserWay)
 * 
 * @module accessibility/profiles
 */

import type { AccessibilitySettings } from './types';

/**
 * פרופיל נגישות
 */
export interface AccessibilityProfile {
  /** מזהה ייחודי */
  id: string;
  /** שם בעברית */
  nameHe: string;
  /** שם באנגלית */
  nameEn: string;
  /** תיאור בעברית */
  descriptionHe: string;
  /** תיאור באנגלית */
  descriptionEn: string;
  /** אייקון (emoji) */
  icon: string;
  /** הגדרות הפרופיל */
  settings: Partial<AccessibilitySettings>;
}

/**
 * פרופילי נגישות מוכנים
 */
export const ACCESSIBILITY_PROFILES: AccessibilityProfile[] = [
  {
    id: 'vision-impaired',
    nameHe: 'ראייה לקויה',
    nameEn: 'Vision Impaired',
    descriptionHe: 'גופן גדול, ניגודיות גבוהה והדגשת קישורים',
    descriptionEn: 'Large font, high contrast and highlighted links',
    icon: '👁️',
    settings: {
      fontSize: 2, // 150%
      highContrast: true,
      highlightLinks: true,
      largeCursor: true,
    },
  },
  {
    id: 'adhd-friendly',
    nameHe: 'ידידותי ל-ADHD',
    nameEn: 'ADHD Friendly',
    descriptionHe: 'עצירת אנימציות, מסכת קריאה וריווח טקסט',
    descriptionEn: 'Pause animations, reading mask and text spacing',
    icon: '🧠',
    settings: {
      pauseAnimations: true,
      readingMask: true,
      textSpacing: true,
    },
  },
  {
    id: 'seizure-safe',
    nameHe: 'בטוח לאפילפטיים',
    nameEn: 'Seizure Safe',
    descriptionHe: 'עצירת כל האנימציות וההבהובים',
    descriptionEn: 'Stop all animations and flashing',
    icon: '⚡',
    settings: {
      pauseAnimations: true,
    },
  },
  {
    id: 'dyslexia',
    nameHe: 'דיסלקסיה',
    nameEn: 'Dyslexia Friendly',
    descriptionHe: 'גופן קריא, ריווח טקסט וגודל גדול יותר',
    descriptionEn: 'Readable font, text spacing and larger size',
    icon: '📖',
    settings: {
      dyslexiaFont: true,
      textSpacing: true,
      fontSize: 1, // 125%
    },
  },
  {
    id: 'cognitive',
    nameHe: 'קוגניטיבי',
    nameEn: 'Cognitive',
    descriptionHe: 'סביבה רגועה עם פחות הסחות דעת',
    descriptionEn: 'Calm environment with fewer distractions',
    icon: '🧩',
    settings: {
      fontSize: 1,
      textSpacing: true,
      highlightLinks: true,
      pauseAnimations: true,
    },
  },
];

// DEFAULT_SETTINGS re-exported from './types' (single source of truth)
export { DEFAULT_SETTINGS } from './types';

/**
 * מחיל פרופיל על הגדרות קיימות
 * @param currentSettings - הגדרות נוכחיות
 * @param profile - פרופיל להחלה
 * @returns הגדרות מעודכנות
 */
export function applyProfile(
  currentSettings: AccessibilitySettings,
  profile: AccessibilityProfile
): AccessibilitySettings {
  return {
    ...currentSettings,
    ...profile.settings,
  };
}

/**
 * בודק אם פרופיל מסוים פעיל
 * @param currentSettings - הגדרות נוכחיות
 * @param profile - פרופיל לבדיקה
 * @returns האם כל הגדרות הפרופיל פעילות
 */
export function isProfileActive(
  currentSettings: AccessibilitySettings,
  profile: AccessibilityProfile
): boolean {
  return Object.entries(profile.settings).every(
    ([key, value]) => currentSettings[key as keyof AccessibilitySettings] === value
  );
}
