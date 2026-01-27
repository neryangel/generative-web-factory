/**
 * Accessibility Widget - Fully Independent Component
 * וידג'ט נגישות עצמאי לחלוטין - ניתן להעתקה לכל פרויקט React
 */

// Main widget
export { AccessibilityWidget } from './AccessibilityWidget';
export type { AccessibilitySettings, AccessibilityWidgetProps } from './AccessibilityWidget';

// Sub-components (for advanced usage)
export { AccessibilityButton } from './components/AccessibilityButton';
export { ToggleButton } from './components/ToggleButton';
export { ReadingMask } from './components/ReadingMask';
export type { AccessibilityButtonProps } from './components/AccessibilityButton';
export type { ToggleButtonProps } from './components/ToggleButton';
export type { ReadingMaskProps } from './components/ReadingMask';

// Hooks - useFocusTrap (internal copy)
export { useFocusTrap } from './hooks/useFocusTrap';
export type { UseFocusTrapOptions, UseFocusTrapReturn } from './hooks/useFocusTrap';

// i18n
export { useAccessibilityI18n, accessibilityTranslations } from './i18n';
export type { 
  AccessibilityLanguage, 
  AccessibilityTranslationKey, 
  AccessibilityTranslations,
  UseAccessibilityI18nOptions,
  UseAccessibilityI18nReturn,
} from './i18n';

// Constants
export * from './constants';

// Profiles
export { 
  ACCESSIBILITY_PROFILES, 
  DEFAULT_SETTINGS,
  applyProfile,
  isProfileActive,
} from './profiles';
export type { AccessibilityProfile } from './profiles';

// Utilities - keyboard utilities (internal copy)
export { getShortcutDisplay, isMac } from './lib/keyboardUtils';

// Admin Panel (for site owners)
export { AccessibilityAdmin, useAdminSettings } from './admin';
export type { 
  AccessibilityAdminProps,
  WidgetAdminSettings,
  TriggerSettings,
  InterfaceSettings,
  StatementSettings,
  AdvancedSettings,
} from './admin';
