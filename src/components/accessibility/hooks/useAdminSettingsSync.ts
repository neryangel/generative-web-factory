/**
 * useAdminSettingsSync - Hook לסינכרון הגדרות Admin עם הווידג'ט
 * @module accessibility/hooks/useAdminSettingsSync
 */

import { useEffect, useState } from 'react';
import type { AccessibilityFeatureKey, WidgetAdminSettings } from '../admin/types';
import { ADMIN_SETTINGS_STORAGE_KEY, DEFAULT_ADMIN_SETTINGS } from '../admin/types';

export interface UseAdminSettingsSyncReturn {
  adminSettings: WidgetAdminSettings;
  isFeatureEnabled: (feature: AccessibilityFeatureKey) => boolean;
  shouldShowOnDevice: () => boolean;
}

/**
 * מאמת הגדרות Admin מ-localStorage
 */
function validateAdminSettings(data: unknown): WidgetAdminSettings | null {
  if (typeof data !== 'object' || data === null) {
    return null;
  }
  
  const obj = data as Record<string, unknown>;
  
  // בדיקה בסיסית שכל הסקשנים קיימים
  if (!obj.trigger || !obj.interface || !obj.statement || !obj.advanced) {
    return null;
  }
  
  // החזר כמו שהוא עם fallback לברירות מחדל
  return {
    trigger: { ...DEFAULT_ADMIN_SETTINGS.trigger, ...(obj.trigger as object) },
    interface: { ...DEFAULT_ADMIN_SETTINGS.interface, ...(obj.interface as object) },
    statement: { ...DEFAULT_ADMIN_SETTINGS.statement, ...(obj.statement as object) },
    advanced: { ...DEFAULT_ADMIN_SETTINGS.advanced, ...(obj.advanced as object) },
  } as WidgetAdminSettings;
}

/**
 * Hook לסינכרון הגדרות Admin עם הווידג'ט
 */
export function useAdminSettingsSync(): UseAdminSettingsSyncReturn {
  const [adminSettings, setAdminSettings] = useState<WidgetAdminSettings>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
      if (!stored) {
        return DEFAULT_ADMIN_SETTINGS;
      }
      const parsed = JSON.parse(stored);
      const validated = validateAdminSettings(parsed);
      return validated ?? DEFAULT_ADMIN_SETTINGS;
    } catch {
      return DEFAULT_ADMIN_SETTINGS;
    }
  });

  // האזנה לשינויים בהגדרות Admin
  useEffect(() => {
    const handleSettingsChange = (event: Event) => {
      const customEvent = event as CustomEvent<WidgetAdminSettings>;
      if (customEvent.detail) {
        setAdminSettings(customEvent.detail);
      } else {
        // טען מחדש מ-localStorage
        try {
          const stored = localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            const validated = validateAdminSettings(parsed);
            if (validated) {
              setAdminSettings(validated);
            }
          }
        } catch { /* ignore */ }
      }
    };

    window.addEventListener('accessibility-admin-settings-changed', handleSettingsChange);
    
    return () => {
      window.removeEventListener('accessibility-admin-settings-changed', handleSettingsChange);
    };
  }, []);

  // בודק אם תכונה מופעלת
  const isFeatureEnabled = (feature: AccessibilityFeatureKey): boolean => {
    return adminSettings.advanced.enabledFeatures.includes(feature);
  };

  // בודק אם להציג על המכשיר הנוכחי
  const shouldShowOnDevice = (): boolean => {
    const { showOnDesktop, showOnMobile } = adminSettings.trigger;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
      return showOnMobile;
    }
    return showOnDesktop;
  };

  return {
    adminSettings,
    isFeatureEnabled,
    shouldShowOnDevice,
  };
}
