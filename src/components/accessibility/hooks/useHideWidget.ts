/**
 * useHideWidget - Hook לניהול מצב הסתרה/מזעור של הווידג'ט
 * @module accessibility/hooks/useHideWidget
 */

import { useCallback, useRef, useState } from 'react';
import {
  HIDDEN_STORAGE_KEY,
  HIDDEN_UNTIL_STORAGE_KEY,
  HIDE_DURATIONS,
  MINIMIZED_STORAGE_KEY,
} from '../constants';
import type { HideDuration } from '../constants';
import type { AccessibilityTranslations } from '../i18n/translations';

/** Callback להצגת הודעות toast (מאפשר שימוש בכל ספריית toast) */
export type ToastCallback = (title: string, description?: string) => void;

export interface UseHideWidgetOptions {
  /** callback להצגת הודעות toast — injectable dependency */
  onToast?: ToastCallback;
}

export interface UseHideWidgetReturn {
  isHidden: boolean;
  isMinimized: boolean;
  showHideDialog: boolean;
  setShowHideDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
  openHideDialog: () => void;
  handleHideOption: (option: 'minimize' | HideDuration, t: AccessibilityTranslations, announce: (message: string) => void, onClose?: () => void) => void;
  expandFromMinimized: () => void;
  showWidget: () => void;
}

/**
 * Hook לניהול מצב הסתרה/מזעור של הווידג'ט
 */
export function useHideWidget(options: UseHideWidgetOptions = {}): UseHideWidgetReturn {
  const onToastRef = useRef(options.onToast);
  onToastRef.current = options.onToast;

  const [showHideDialog, setShowHideDialog] = useState(false);

  // Minimized state - האם הכפתור ממוזער
  const [isMinimized, setIsMinimized] = useState(() => {
    try {
      return localStorage.getItem(MINIMIZED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Hidden state - האם הכפתור מוסתר (עם בדיקת זמן)
  const [isHidden, setIsHidden] = useState(() => {
    try {
      // בדוק אם מוסתר לסשן
      if (sessionStorage.getItem(HIDDEN_STORAGE_KEY) === 'true') {
        return true;
      }

      // בדוק אם מוסתר לצמיתות
      if (localStorage.getItem(HIDDEN_STORAGE_KEY) === 'true') {
        const hiddenUntil = localStorage.getItem(HIDDEN_UNTIL_STORAGE_KEY);
        if (!hiddenUntil) {
          // הסתרה לצמיתות
          return true;
        }

        // בדוק אם הזמן עבר
        const untilDate = parseInt(hiddenUntil, 10);
        if (Date.now() >= untilDate) {
          // הזמן עבר - הצג שוב
          localStorage.removeItem(HIDDEN_STORAGE_KEY);
          localStorage.removeItem(HIDDEN_UNTIL_STORAGE_KEY);
          return false;
        }
        return true;
      }

      return false;
    } catch {
      return false;
    }
  });

  /** שולח הודעת toast אם callback קיים */
  const showToast = useCallback((title: string, description?: string) => {
    onToastRef.current?.(title, description);
  }, []);

  /** פותח דיאלוג אפשרויות הסתרה */
  const openHideDialog = useCallback(() => {
    setShowHideDialog(true);
  }, []);

  /** מטפל בבחירת אפשרות הסתרה */
  const handleHideOption = useCallback((
    option: 'minimize' | HideDuration,
    t: AccessibilityTranslations,
    announce: (message: string) => void,
    onClose?: () => void
  ) => {
    onClose?.();

    if (option === 'minimize') {
      setIsMinimized(true);
      try {
        localStorage.setItem(MINIMIZED_STORAGE_KEY, 'true');
      } catch { /* ignore */ }
      showToast(t.widgetMinimized);
      return;
    }

    // Hide options
    setIsHidden(true);

    try {
      if (option === 'session') {
        sessionStorage.setItem(HIDDEN_STORAGE_KEY, 'true');
        showToast(t.hiddenToastTitle, t.hiddenToastSession);
      } else if (option === 'forever') {
        localStorage.setItem(HIDDEN_STORAGE_KEY, 'true');
        localStorage.removeItem(HIDDEN_UNTIL_STORAGE_KEY);
        showToast(t.hiddenToastTitle, t.hiddenToastForever);
      } else {
        const duration = HIDE_DURATIONS[option];
        const untilDate = Date.now() + duration;
        localStorage.setItem(HIDDEN_STORAGE_KEY, 'true');
        localStorage.setItem(HIDDEN_UNTIL_STORAGE_KEY, String(untilDate));

        const toastDescMap: Record<string, keyof AccessibilityTranslations> = {
          day: 'hiddenToastDay',
          week: 'hiddenToastWeek',
          month: 'hiddenToastMonth',
        };
        const descKey = toastDescMap[option];
        showToast(t.hiddenToastTitle, descKey ? t[descKey] : undefined);
      }
    } catch { /* ignore */ }

    announce(t.widgetHidden);
  }, [showToast]);

  /** מרחיב מכפתור ממוזער */
  const expandFromMinimized = useCallback(() => {
    setIsMinimized(false);
    try {
      localStorage.removeItem(MINIMIZED_STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  /** מציג את הווידג'ט (מנקה כל מצבי הסתרה) */
  const showWidget = useCallback(() => {
    setIsHidden(false);
    setIsMinimized(false);
    try {
      sessionStorage.removeItem(HIDDEN_STORAGE_KEY);
      localStorage.removeItem(HIDDEN_STORAGE_KEY);
      localStorage.removeItem(HIDDEN_UNTIL_STORAGE_KEY);
      localStorage.removeItem(MINIMIZED_STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  return {
    isHidden,
    isMinimized,
    showHideDialog,
    setShowHideDialog,
    setIsHidden,
    setIsMinimized,
    openHideDialog,
    handleHideOption,
    expandFromMinimized,
    showWidget,
  };
}
