/**
 * useFocusTrap Hook - לכידת פוקוס בתוך מודל/דיאלוג
 *
 * @description מספק לכידת פוקוס מלאה בהתאם לתקני WCAG 2.1 AA ו-ת"י 5568.
 * כולל תמיכה ב-ESC, החזרת פוקוס, וניווט מקלדת.
 *
 * @module accessibility/hooks/useFocusTrap
 */

import { useCallback, useEffect, useRef } from 'react';

/** Focusable elements selector - all interactive elements */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'audio[controls]',
  'video[controls]',
  'details > summary',
].join(', ');

export interface UseFocusTrapOptions {
  /** האם הלכידה פעילה */
  isActive: boolean;
  /** פונקציה שתופעל בלחיצה על ESC */
  onEscape?: () => void;
  /** האם להחזיר פוקוס לאלמנט המקורי בעת סגירה */
  returnFocusOnDeactivate?: boolean;
  /** האם לתת פוקוס לאלמנט הראשון אוטומטית */
  autoFocus?: boolean;
  /** דיליי לפני מתן פוקוס (לאנימציות) */
  focusDelay?: number;
}

export interface UseFocusTrapReturn {
  /** Ref לקונטיינר שבו יש ללכוד את הפוקוס */
  containerRef: React.RefObject<HTMLElement>;
  /** Ref לאלמנט שממנו נפתח הדיאלוג (לחזרה) */
  returnFocusRef: React.RefObject<HTMLElement>;
}

/**
 * Hook ללכידת פוקוס בתוך קונטיינר
 */
export function useFocusTrap(options: UseFocusTrapOptions): UseFocusTrapReturn {
  const {
    isActive,
    onEscape,
    returnFocusOnDeactivate = true,
    autoFocus = true,
    focusDelay = 0,
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  /**
   * מחזיר את כל האלמנטים שניתן לתת להם פוקוס בתוך הקונטיינר
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const elements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    // סינון אלמנטים מוסתרים
    return Array.from(elements).filter(el => {
      return el.offsetParent !== null &&
             !el.hasAttribute('inert') &&
             getComputedStyle(el).visibility !== 'hidden';
    });
  }, []);

  /**
   * מטפל בלחיצות מקלדת - Tab ו-ESC
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;

    // ESC - סגירת הדיאלוג
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onEscape?.();
      return;
    }

    // Tab - לכידת פוקוס
    if (event.key === 'Tab') {
      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // Shift+Tab מהאלמנט הראשון -> עבור לאחרון
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Tab מהאלמנט האחרון -> עבור לראשון
      else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [isActive, onEscape, getFocusableElements]);

  /**
   * מונע פוקוס מחוץ לקונטיינר
   */
  const handleFocusIn = useCallback((event: FocusEvent) => {
    if (!isActive || !containerRef.current) return;

    const target = event.target as HTMLElement;

    // אם הפוקוס יצא מהקונטיינר, החזר אותו פנימה
    if (!containerRef.current.contains(target)) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        event.preventDefault();
        focusableElements[0].focus();
      }
    }
  }, [isActive, getFocusableElements]);

  // Effect להפעלה/כיבוי של לכידת הפוקוס
  useEffect(() => {
    if (!isActive) {
      // כשמכבים - החזר פוקוס לאלמנט המקורי
      if (returnFocusOnDeactivate && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
      return;
    }

    // שמור את האלמנט הנוכחי לפני הפתיחה
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // הוסף מאזינים
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('focusin', handleFocusIn, true);

    // תן פוקוס לאלמנט הראשון (עם אפשרות לדיליי)
    if (autoFocus) {
      const setInitialFocus = () => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else if (containerRef.current) {
          // אם אין אלמנטים, תן פוקוס לקונטיינר עצמו
          containerRef.current.setAttribute('tabindex', '-1');
          containerRef.current.focus();
        }
      };

      if (focusDelay > 0) {
        const timer = setTimeout(setInitialFocus, focusDelay);
        return () => {
          clearTimeout(timer);
          document.removeEventListener('keydown', handleKeyDown, true);
          document.removeEventListener('focusin', handleFocusIn, true);
        };
      } else {
        setInitialFocus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('focusin', handleFocusIn, true);
    };
  }, [isActive, autoFocus, focusDelay, returnFocusOnDeactivate, handleKeyDown, handleFocusIn, getFocusableElements]);

  return {
    containerRef: containerRef,
    returnFocusRef: returnFocusRef,
  };
}
