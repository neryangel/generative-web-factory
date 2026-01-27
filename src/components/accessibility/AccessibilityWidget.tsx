/**
 * AccessibilityWidget - רכיב נגישות מקיף לפי תקן ת"י 5568
 * 
 * @description רכיב עצמאי לחלוטין - לא תלוי בקוד חיצוני.
 * מספק 7 אפשרויות נגישות: גודל גופן, ניגודיות, הדגשת קישורים,
 * עצירת אנימציות, סמן גדול, מסכת קריאה וגווני אפור.
 * ההגדרות נשמרות ב-localStorage ומיושמות באופן גלובלי.
 * 
 * @example
 * ```tsx
 * import { AccessibilityWidget } from '@/shared/components/accessibility';
 * 
 * function App() {
 *   return <AccessibilityWidget />;
 * }
 * ```
 * 
 * @see https://www.gov.il/he/Departments/policies/web_accessibility - תקנות נגישות אתרי אינטרנט
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Independent Icons - no lucide-react dependency
import { AccessibilityIcon } from './icons';

// Local imports - fully independent
import { useFocusTrap } from './hooks/useFocusTrap';
import { useDraggablePosition } from './hooks/useDraggablePosition';
import { useAccessibilitySettings } from './hooks/useAccessibilitySettings';
import { useHideWidget } from './hooks/useHideWidget';
import { useAccessibilityEffects } from './hooks/useAccessibilityEffects';
import { useAdminSettingsSync } from './hooks/useAdminSettingsSync';
import { useAccessibilityI18n } from './i18n/useAccessibilityI18n';
import type { AccessibilityLanguage, AccessibilityTranslations } from './i18n/translations';
import { ReadingMask } from './components/ReadingMask';
import { HideOptionsDialog } from './components/HideOptionsDialog';
import { MinimizedButton } from './components/MinimizedButton';
import { AccessibilityDialog } from './components/AccessibilityDialog';
import { WidgetErrorBoundary } from './components/WidgetErrorBoundary';
import { Z_INDEX_TRIGGER } from './constants';
import type { AccessibilitySettings } from './types';

// Re-export so existing consumers don't break
export type { AccessibilitySettings } from './types';

/**
 * Props לווידג'ט הנגישות
 */
export interface AccessibilityWidgetProps {
  /** שפת ברירת מחדל */
  defaultLanguage?: AccessibilityLanguage;
  /** מיקום הכפתור */
  position?: 'left' | 'right' | 'auto';
  /** תרגומים מותאמים אישית */
  customTranslations?: Partial<Record<AccessibilityLanguage, Partial<AccessibilityTranslations>>>;
  /** כתובת להצהרת נגישות */
  statementUrl?: string;
  /** האם להשתמש בצבעי האתר במקום צבעים עצמאיים */
  useSystemColors?: boolean;
  /** callback להצגת הודעות toast — injectable dependency */
  onToast?: (title: string, description?: string) => void;
}

/**
 * רכיב Widget לנגישות
 * מספק תפריט צף עם אפשרויות נגישות מותאמות
 */
const AccessibilityWidgetInner: React.FC<AccessibilityWidgetProps> = ({
  defaultLanguage = 'he',
  position = 'auto',
  customTranslations,
  statementUrl = '/accessibility-statement',
  useSystemColors = false,
  onToast,
}) => {
  // Use local i18n hook
  const { t, isRTL, language } = useAccessibilityI18n({ 
    defaultLanguage, 
    customTranslations 
  });
  
  const [isOpen, setIsOpen] = useState(false);

  // Use refactored hooks
  const {
    settings,
    setSettings,
    updateSetting,
    resetSettings,
    increaseFontSize,
    decreaseFontSize,
  } = useAccessibilitySettings();

  const {
    isHidden,
    isMinimized,
    showHideDialog,
    setShowHideDialog,
    openHideDialog,
    handleHideOption,
    expandFromMinimized,
    showWidget,
  } = useHideWidget({ onToast });

  const { announce } = useAccessibilityEffects({ settings });
  
  const { isFeatureEnabled, shouldShowOnDevice } = useAdminSettingsSync();
  
  // Focus Trap לדיאלוג
  const { containerRef } = useFocusTrap({
    isActive: isOpen,
    onEscape: () => setIsOpen(false),
    returnFocusOnDeactivate: true,
    autoFocus: true,
    focusDelay: 50,
  });

  // Calculate position based on RTL or explicit position prop
  const buttonPosition = position === 'auto' 
    ? (isRTL ? 'left' : 'right')
    : position;

  // Draggable position hook
  const { 
    position: dragPosition, 
    isDragging, 
    handleDragStart,
    resetPosition,
    dragRef: triggerButtonRef,
  } = useDraggablePosition({
    defaultSide: buttonPosition,
    bottomOffset: 80,
    snapToEdges: true,
  });

  // קיצור מקלדת Alt+A לפתיחה/סגירה
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyA') {
        const target = e.target as HTMLElement;
        const isEditable = 
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.tagName === 'SELECT' ||
          target.isContentEditable;
        
        if (isEditable) return;
        
        e.preventDefault();
        
        if (isHidden || isMinimized) {
          showWidget();
          announce(t.showWidget);
          return;
        }
        
        setIsOpen(prev => {
          const newState = !prev;
          announce(newState ? t.menuOpened : t.menuClosed);
          return newState;
        });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [announce, t.menuOpened, t.menuClosed, t.showWidget, isHidden, isMinimized, showWidget]);

  // Portal container
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let container = document.getElementById('accessibility-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'accessibility-portal';
      container.setAttribute('data-accessibility-portal', 'true');
      if (useSystemColors) {
        container.classList.add('use-site-colors');
      }
      document.body.appendChild(container);
    }
    setPortalContainer(container);
  }, [useSystemColors]);

  // Trigger button style
  const triggerButtonStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: Z_INDEX_TRIGGER,
    isolation: 'isolate',
    padding: '0.75rem',
    borderRadius: '9999px',
    backgroundColor: 'hsl(var(--a11y-primary))',
    color: 'hsl(var(--a11y-primary-foreground))',
    boxShadow: isDragging 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'box-shadow 0.2s, background-color 0.2s',
    [buttonPosition === 'left' ? 'left' : 'right']: '1rem',
    bottom: '5rem',
    transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)${isDragging ? ' scale(1.1)' : ''}`,
    touchAction: 'none',
  };

  // Track drag start position
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleButtonMouseDown = useCallback((e: React.MouseEvent) => {
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    handleDragStart(e);
  }, [handleDragStart]);

  const handleButtonTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    handleDragStart(e);
  }, [handleDragStart]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    if (dragStartPosRef.current) {
      const dx = Math.abs(e.clientX - dragStartPosRef.current.x);
      const dy = Math.abs(e.clientY - dragStartPosRef.current.y);
      if (dx > 5 || dy > 5) {
        e.preventDefault();
        return;
      }
    }
    setIsOpen(true);
  }, []);

  // Wrapper for updateSetting with announce
  const handleUpdateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    updateSetting(key, value, announce, language, t);
  }, [updateSetting, announce, language, t]);

  // Wrapper for resetSettings with announce
  const handleReset = useCallback(() => {
    resetSettings(announce, t.reset);
  }, [resetSettings, announce, t.reset]);

  // Wrapper for hide option
  const handleHide = useCallback((option: Parameters<typeof handleHideOption>[0]) => {
    handleHideOption(option, t, announce, () => setIsOpen(false));
  }, [handleHideOption, t, announce]);

  // Handler for applying profile
  const handleApplyProfile = useCallback((newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
    announce(language === 'he' ? 'פרופיל הוחל' : 'Profile applied');
  }, [setSettings, announce, language]);

  // Check if should show on current device
  if (!shouldShowOnDevice()) {
    return null;
  }

  const widgetContent = (
    <div data-accessibility-widget="root" className={useSystemColors ? 'use-site-colors' : ''}>
      {/* כפתור ממוזער */}
      {isMinimized && !isHidden && (
        <MinimizedButton
          onExpand={expandFromMinimized}
          translations={t}
          position={buttonPosition}
        />
      )}

      {/* כפתור פתיחה - ניתן לגרירה */}
      {!isHidden && !isMinimized && (
        <button
          ref={triggerButtonRef}
          onClick={handleButtonClick}
          onMouseDown={handleButtonMouseDown}
          onTouchStart={handleButtonTouchStart}
          onDoubleClick={resetPosition}
          data-accessibility-widget="trigger"
          style={triggerButtonStyle}
          aria-label={t.openMenu}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          title={language === 'he' ? 'גרור למיקום חדש, לחיצה כפולה לאיפוס' : 'Drag to reposition, double-click to reset'}
        >
          <AccessibilityIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      {/* דיאלוג אפשרויות הסתרה */}
      <HideOptionsDialog
        isOpen={showHideDialog}
        onClose={() => setShowHideDialog(false)}
        onSelect={handleHide}
        translations={t}
        isRtl={isRTL}
      />

      {/* דיאלוג נגישות ראשי */}
      <AccessibilityDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        settings={settings}
        onUpdateSetting={handleUpdateSetting}
        onReset={handleReset}
        onHide={openHideDialog}
        onApplyProfile={handleApplyProfile}
        translations={t}
        isRTL={isRTL}
        position={buttonPosition}
        statementUrl={statementUrl}
        language={language}
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
        isFeatureEnabled={isFeatureEnabled}
      />

      {/* Reading Mask Overlay */}
      {settings.readingMask && <ReadingMask />}

      {/* Live region for screen reader announcements */}
      <div 
        id="a11y-announcement" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="a11y-sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      />
    </div>
  );

  // Render in portal if available
  if (portalContainer) {
    return createPortal(widgetContent, portalContainer);
  }

  return widgetContent;
};

/**
 * רכיב Widget לנגישות — עטוף ב-Error Boundary
 * אם הווידג'ט קורס, האפליקציה ממשיכה לעבוד
 */
export const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = (props) => (
  <WidgetErrorBoundary>
    <AccessibilityWidgetInner {...props} />
  </WidgetErrorBoundary>
);
