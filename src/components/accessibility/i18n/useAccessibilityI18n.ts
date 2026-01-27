/**
 * useAccessibilityI18n - Hook עצמאי לתרגום הווידג'ט
 * 
 * @description קורא את השפה מ-localStorage או מ-document.documentElement.lang
 * ולא תלוי ב-LanguageContext של האתר.
 */

import { useCallback, useEffect, useState } from 'react';
import { 
  type AccessibilityLanguage, 
  type AccessibilityTranslations, 
  accessibilityTranslations 
} from './translations';

const LANGUAGE_STORAGE_KEY = 'app-language';

/**
 * מזהה את השפה הנוכחית
 */
function detectLanguage(): AccessibilityLanguage {
  // 1. בדוק localStorage
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'he' || stored === 'en') {
      return stored;
    }
  } catch {
    // התעלם משגיאות storage
  }

  // 2. בדוק את תכונת lang של ה-HTML
  const htmlLang = document.documentElement.lang;
  if (htmlLang === 'he' || htmlLang === 'en') {
    return htmlLang;
  }

  // 3. ברירת מחדל - עברית
  return 'he';
}

export interface UseAccessibilityI18nOptions {
  /** שפת ברירת מחדל אם לא נמצאה שפה */
  defaultLanguage?: AccessibilityLanguage;
  /** תרגומים מותאמים אישית (לדריסה חלקית) */
  customTranslations?: Partial<Record<AccessibilityLanguage, Partial<AccessibilityTranslations>>>;
}

export interface UseAccessibilityI18nReturn {
  /** השפה הנוכחית */
  language: AccessibilityLanguage;
  /** האם כיוון הטקסט מימין לשמאל */
  isRTL: boolean;
  /** אובייקט התרגומים לשפה הנוכחית */
  t: AccessibilityTranslations;
}

/**
 * Hook לתרגום הווידג'ט - עצמאי לחלוטין
 */
export function useAccessibilityI18n(
  options: UseAccessibilityI18nOptions = {}
): UseAccessibilityI18nReturn {
  const { defaultLanguage = 'he', customTranslations } = options;

  const [language, setLanguage] = useState<AccessibilityLanguage>(() => {
    const detected = detectLanguage();
    return detected || defaultLanguage;
  });

  // האזן לשינויים בשפה (מ-localStorage או מתכונת lang)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY) {
        const newLang = e.newValue;
        if (newLang === 'he' || newLang === 'en') {
          setLanguage(newLang);
        }
      }
    };

    // האזן גם לשינויים ב-DOM (למקרה שהשפה משתנה דרך ה-context)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'lang') {
          const newLang = document.documentElement.lang;
          if (newLang === 'he' || newLang === 'en') {
            setLanguage(newLang);
          }
        }
      }
    });

    window.addEventListener('storage', handleStorageChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  // מיזוג תרגומים מותאמים עם ברירת המחדל
  const getTranslations = useCallback((): AccessibilityTranslations => {
    const base = accessibilityTranslations[language];
    const custom = customTranslations?.[language];
    
    if (custom) {
      return { ...base, ...custom };
    }
    
    return base;
  }, [language, customTranslations]);

  return {
    language,
    isRTL: language === 'he',
    t: getTranslations(),
  };
}

export default useAccessibilityI18n;
