/**
 * useAccessibilityEffects - Hook לניהול effects שמחילים שינויים על DOM
 * @module accessibility/hooks/useAccessibilityEffects
 */

import { useCallback, useEffect } from 'react';
import { ANNOUNCE_DELAY_MS, FONT_SIZES, MIN_FONT_SIZE_LEVEL } from '../constants';
import type { AccessibilitySettings } from '../types';

export interface UseAccessibilityEffectsOptions {
  settings: AccessibilitySettings;
}

export interface UseAccessibilityEffectsReturn {
  announce: (message: string) => void;
}

/**
 * Hook לניהול effects שמחילים הגדרות נגישות על DOM
 */
export function useAccessibilityEffects({
  settings,
}: UseAccessibilityEffectsOptions): UseAccessibilityEffectsReturn {
  
  // שליטה על אנימציות JavaScript באמצעות Web Animations API
  useEffect(() => {
    if (settings.pauseAnimations) {
      // עצור את כל האנימציות הקיימות
      const pauseAllAnimations = () => {
        try {
          document.getAnimations().forEach(animation => {
            if (animation.playState === 'running') {
              animation.pause();
            }
          });
        } catch {
          // דפדפנים ישנים עלולים לא לתמוך ב-getAnimations
        }
      };
      
      pauseAllAnimations();
      
      // צפה באנימציות חדשות ועצור אותן גם
      const observer = new MutationObserver(() => {
        pauseAllAnimations();
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      
      return () => {
        observer.disconnect();
      };
    } else {
      // החזר את כל האנימציות לפעולה
      try {
        document.getAnimations().forEach(animation => {
          if (animation.playState === 'paused') {
            animation.play();
          }
        });
      } catch {
        // דפדפנים ישנים
      }
    }
  }, [settings.pauseAnimations]);

  // החלת הגדרות על ה-DOM
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // גודל גופן
    root.style.fontSize = settings.fontSize === MIN_FONT_SIZE_LEVEL 
      ? '' 
      : FONT_SIZES[settings.fontSize];
    
    // ניגודיות גבוהה
    body.classList.toggle('high-contrast', settings.highContrast);
    
    // הדגשת קישורים
    body.classList.toggle('highlight-links', settings.highlightLinks);
    
    // עצירת אנימציות
    body.classList.toggle('pause-animations', settings.pauseAnimations);
    
    // סמן גדול
    body.classList.toggle('large-cursor', settings.largeCursor);
    
    // מסכת קריאה
    body.classList.toggle('reading-mask', settings.readingMask);
    
    // גווני אפור
    body.classList.toggle('grayscale-mode', settings.grayscale);
    
    // ריווח טקסט (WCAG 1.4.12)
    body.classList.toggle('text-spacing', settings.textSpacing);
    
    // גופן דיסלקסיה
    body.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    
    return () => {
      root.style.fontSize = '';
      body.classList.remove(
        'high-contrast', 
        'highlight-links', 
        'pause-animations', 
        'large-cursor', 
        'reading-mask',
        'grayscale-mode',
        'text-spacing',
        'dyslexia-font'
      );
    };
  }, [settings]);

  /**
   * מודיע לקוראי מסך על שינוי
   * @param message - הודעה להקראה
   */
  const announce = useCallback((message: string) => {
    const announcement = document.getElementById('a11y-announcement');
    if (announcement) {
      announcement.textContent = '';
      // Force reannounce by clearing then setting
      setTimeout(() => {
        announcement.textContent = message;
      }, ANNOUNCE_DELAY_MS);
    }
  }, []);

  return { announce };
}
