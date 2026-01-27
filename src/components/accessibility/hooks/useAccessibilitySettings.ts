/**
 * useAccessibilitySettings - Hook לניהול הגדרות נגישות
 * @module accessibility/hooks/useAccessibilitySettings
 */

import { useCallback, useEffect, useState } from 'react';
import {
  MAX_FONT_SIZE_LEVEL,
  MIN_FONT_SIZE_LEVEL,
  STORAGE_KEY,
} from '../constants';
import { DEFAULT_SETTINGS } from '../types';
import type { AccessibilitySettings } from '../types';

/** תרגומי שמות הגדרות לקוראי מסך */
export const SETTING_LABELS: Record<keyof AccessibilitySettings, { he: string; en: string }> = {
  fontSize: { he: 'גודל גופן', en: 'Font Size' },
  highContrast: { he: 'ניגודיות גבוהה', en: 'High Contrast' },
  highlightLinks: { he: 'הדגשת קישורים', en: 'Highlight Links' },
  pauseAnimations: { he: 'עצירת אנימציות', en: 'Pause Animations' },
  largeCursor: { he: 'סמן גדול', en: 'Large Cursor' },
  readingMask: { he: 'מסכת קריאה', en: 'Reading Mask' },
  grayscale: { he: 'גווני אפור', en: 'Grayscale' },
  textSpacing: { he: 'ריווח טקסט', en: 'Text Spacing' },
  dyslexiaFont: { he: 'גופן דיסלקסיה', en: 'Dyslexia Font' },
};

/** @deprecated Use DEFAULT_SETTINGS from '../types' instead */
export const defaultSettings = DEFAULT_SETTINGS;

/**
 * מאמת הגדרות נגישות מ-localStorage
 * @param data - נתונים לוולידציה
 * @returns הגדרות תקינות או null אם פגום
 */
export function validateSettings(data: unknown): AccessibilitySettings | null {
  if (typeof data !== 'object' || data === null) {
    return null;
  }
  
  const obj = data as Record<string, unknown>;
  
  // בדיקת fontSize - חייב להיות מספר בין MIN ל-MAX
  if (
    typeof obj.fontSize !== 'number' ||
    obj.fontSize < MIN_FONT_SIZE_LEVEL ||
    obj.fontSize > MAX_FONT_SIZE_LEVEL ||
    !Number.isInteger(obj.fontSize)
  ) {
    return null;
  }
  
  // בדיקת כל השדות הבוליאניים
  const booleanKeys: (keyof AccessibilitySettings)[] = [
    'highContrast',
    'highlightLinks', 
    'pauseAnimations',
    'largeCursor',
    'readingMask',
    'grayscale',
    'textSpacing',
    'dyslexiaFont',
  ];
  
  for (const key of booleanKeys) {
    // אם השדה לא קיים, תן לו ערך ברירת מחדל (תאימות לאחור)
    if (obj[key] === undefined) {
      obj[key] = false;
    } else if (typeof obj[key] !== 'boolean') {
      return null;
    }
  }
  
  return {
    fontSize: obj.fontSize as number,
    highContrast: obj.highContrast as boolean,
    highlightLinks: obj.highlightLinks as boolean,
    pauseAnimations: obj.pauseAnimations as boolean,
    largeCursor: obj.largeCursor as boolean,
    readingMask: obj.readingMask as boolean,
    grayscale: obj.grayscale as boolean,
    textSpacing: (obj.textSpacing as boolean) ?? false,
    dyslexiaFont: (obj.dyslexiaFont as boolean) ?? false,
  };
}

export interface UseAccessibilitySettingsReturn {
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K],
    announce?: (message: string) => void,
    language?: string,
    t?: { enabled: string; disabled: string }
  ) => void;
  resetSettings: (announce?: (message: string) => void, resetMessage?: string) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

/**
 * Hook לניהול הגדרות נגישות
 */
export function useAccessibilitySettings(): UseAccessibilitySettingsReturn {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return defaultSettings;
      }
      const parsed = JSON.parse(stored);
      const validated = validateSettings(parsed);
      return validated ?? defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // שמירת הגדרות ב-localStorage ושידור אירוע לכל הרכיבים
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      // שדר אירוע מותאם - זה מה שגורם ל-useReducedMotion לעבוד!
      window.dispatchEvent(new CustomEvent('accessibility-settings-changed', {
        detail: settings
      }));
    } catch {
      // התעלם משגיאות storage
    }
  }, [settings]);

  /**
   * מעדכן הגדרה ספציפית
   */
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K],
    announce?: (message: string) => void,
    language?: string,
    t?: { enabled: string; disabled: string }
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // הודע על השינוי בשפה הנכונה
    if (announce && t) {
      const settingLabel = SETTING_LABELS[key][language === 'he' ? 'he' : 'en'];
      const status = typeof value === 'boolean' 
        ? (value ? t.enabled : t.disabled)
        : String(value);
      announce(`${settingLabel}: ${status}`);
    }
  }, []);

  /** מאפס את כל ההגדרות לברירת מחדל */
  const resetSettings = useCallback((announce?: (message: string) => void, resetMessage?: string) => {
    setSettings(defaultSettings);
    if (announce && resetMessage) {
      announce(resetMessage);
    }
  }, []);

  /** מגדיל גודל גופן */
  const increaseFontSize = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 1, MAX_FONT_SIZE_LEVEL)
    }));
  }, []);

  /** מקטין גודל גופן */
  const decreaseFontSize = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 1, MIN_FONT_SIZE_LEVEL)
    }));
  }, []);

  return {
    settings,
    setSettings,
    updateSetting,
    resetSettings,
    increaseFontSize,
    decreaseFontSize,
  };
}
