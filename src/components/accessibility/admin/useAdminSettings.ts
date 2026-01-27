/**
 * useAdminSettings Hook
 */

import { useCallback, useEffect, useState } from 'react';
import type { AdvancedSettings, InterfaceSettings, StatementSettings, TriggerSettings, WidgetAdminSettings } from './types';
import { ADMIN_SETTINGS_STORAGE_KEY, DEFAULT_ADMIN_SETTINGS } from './types';

export interface UseAdminSettingsReturn {
  settings: WidgetAdminSettings;
  updateTrigger: (updates: Partial<TriggerSettings>) => void;
  updateInterface: (updates: Partial<InterfaceSettings>) => void;
  updateStatement: (updates: Partial<StatementSettings>) => void;
  updateAdvanced: (updates: Partial<AdvancedSettings>) => void;
  save: () => void;
  reset: () => void;
  hasUnsavedChanges: boolean;
  isSaved: boolean;
}

function validateSettings(data: unknown): WidgetAdminSettings | null {
  if (typeof data !== 'object' || data === null) return null;
  const obj = data as Record<string, unknown>;
  if (!obj.trigger || !obj.interface || !obj.statement || !obj.advanced) return null;
  return {
    trigger: { ...DEFAULT_ADMIN_SETTINGS.trigger, ...(obj.trigger as object) },
    interface: { ...DEFAULT_ADMIN_SETTINGS.interface, ...(obj.interface as object) },
    statement: { ...DEFAULT_ADMIN_SETTINGS.statement, ...(obj.statement as object) },
    advanced: { ...DEFAULT_ADMIN_SETTINGS.advanced, ...(obj.advanced as object) },
  } as WidgetAdminSettings;
}

function loadSettings(): WidgetAdminSettings {
  try {
    const stored = localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
    if (!stored) return DEFAULT_ADMIN_SETTINGS;
    const parsed = JSON.parse(stored);
    return validateSettings(parsed) ?? DEFAULT_ADMIN_SETTINGS;
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function useAdminSettings(): UseAdminSettingsReturn {
  const [settings, setSettings] = useState<WidgetAdminSettings>(loadSettings);
  const [savedSettings, setSavedSettings] = useState<WidgetAdminSettings>(loadSettings);
  const [isSaved, setIsSaved] = useState(false);
  
  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);
  
  useEffect(() => {
    if (isSaved) {
      const timer = setTimeout(() => setIsSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);
  
  const updateTrigger = useCallback((updates: Partial<TriggerSettings>) => {
    setSettings(prev => ({ ...prev, trigger: { ...prev.trigger, ...updates } }));
  }, []);
  
  const updateInterface = useCallback((updates: Partial<InterfaceSettings>) => {
    setSettings(prev => ({ ...prev, interface: { ...prev.interface, ...updates } }));
  }, []);
  
  const updateStatement = useCallback((updates: Partial<StatementSettings>) => {
    setSettings(prev => ({ ...prev, statement: { ...prev.statement, ...updates } }));
  }, []);
  
  const updateAdvanced = useCallback((updates: Partial<AdvancedSettings>) => {
    setSettings(prev => ({ ...prev, advanced: { ...prev.advanced, ...updates } }));
  }, []);
  
  const save = useCallback(() => {
    try {
      localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setSavedSettings(settings);
      setIsSaved(true);
      window.dispatchEvent(new CustomEvent('accessibility-admin-settings-changed', { detail: settings }));
    } catch { /* ignore */ }
  }, [settings]);
  
  const reset = useCallback(() => {
    setSettings(DEFAULT_ADMIN_SETTINGS);
  }, []);
  
  return { settings, updateTrigger, updateInterface, updateStatement, updateAdvanced, save, reset, hasUnsavedChanges, isSaved };
}
