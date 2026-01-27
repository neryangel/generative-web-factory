/**
 * Hide Options Dialog
 * דיאלוג אפשרויות הסתרה לווידג'ט הנגישות
 *
 * @module accessibility/components/HideOptionsDialog
 */

import React from 'react';
import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  EyeOffIcon,
  Minimize2Icon,
  XIcon
} from '../icons';
import { Z_INDEX_DIALOG } from '../constants';
import type { HideDuration } from '../constants';
import type { AccessibilityTranslations } from '../i18n/translations';

export interface HideOptionsDialogProps {
  /** האם הדיאלוג פתוח */
  isOpen: boolean;
  /** callback לסגירת הדיאלוג */
  onClose: () => void;
  /** callback לבחירת אפשרות */
  onSelect: (option: 'minimize' | HideDuration) => void;
  /** תרגומים */
  translations: AccessibilityTranslations;
  /** האם RTL */
  isRtl: boolean;
}

interface HideOption {
  id: 'minimize' | HideDuration;
  icon: React.ReactNode;
  labelKey: keyof AccessibilityTranslations;
  descKey: keyof AccessibilityTranslations;
}

const hideOptions: HideOption[] = [
  { id: 'minimize', icon: <Minimize2Icon size={20} />, labelKey: 'minimize', descKey: 'minimizeDesc' },
  { id: 'session', icon: <ClockIcon size={20} />, labelKey: 'hideForSession', descKey: 'hideForSessionDesc' },
  { id: 'day', icon: <CalendarIcon size={20} />, labelKey: 'hideForDay', descKey: 'hideForDayDesc' },
  { id: 'week', icon: <CalendarDaysIcon size={20} />, labelKey: 'hideForWeek', descKey: 'hideForWeekDesc' },
  { id: 'month', icon: <CalendarDaysIcon size={20} />, labelKey: 'hideForMonth', descKey: 'hideForMonthDesc' },
  { id: 'forever', icon: <EyeOffIcon size={20} />, labelKey: 'hideForever', descKey: 'hideForeverDesc' },
];

export const HideOptionsDialog: React.FC<HideOptionsDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  translations,
  isRtl,
}) => {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  // Focus trap
  React.useEffect(() => {
    if (isOpen && dialogRef.current) {
      const firstButton = dialogRef.current.querySelector('button');
      firstButton?.focus();
    }
  }, [isOpen]);

  // ESC to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center relative"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: Z_INDEX_DIALOG + 1 }}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hide-options-title"
    >
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-pointer"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
      />

      <div
        ref={dialogRef}
        className="rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden relative"
        style={{
          direction: isRtl ? 'rtl' : 'ltr',
          backgroundColor: 'hsl(var(--a11y-background))',
          color: 'hsl(var(--a11y-foreground))',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'hsl(var(--a11y-border))' }}
        >
          <h2
            id="hide-options-title"
            className="text-lg font-semibold"
            style={{ color: 'hsl(var(--a11y-foreground))' }}
          >
            {translations.hideOptions}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ color: 'hsl(var(--a11y-muted-foreground))' }}
            data-a11y-hover="muted"
            aria-label={translations.close}
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Options list */}
        <div className="p-2">
          {hideOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-start group"
              data-a11y-hover="primary"
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: 'hsl(var(--a11y-primary) / 0.12)',
                  color: 'hsl(var(--a11y-primary))',
                }}
              >
                {option.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium" style={{ color: 'hsl(var(--a11y-foreground))' }}>
                  {translations[option.labelKey]}
                </div>
                <div className="text-sm" style={{ color: 'hsl(var(--a11y-muted-foreground))' }}>
                  {translations[option.descKey]}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Cancel button */}
        <div className="p-4 border-t" style={{ borderColor: 'hsl(var(--a11y-border))' }}>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-lg border transition-colors font-medium"
            style={{
              borderColor: 'hsl(var(--a11y-border))',
              color: 'hsl(var(--a11y-foreground))',
              backgroundColor: 'hsl(var(--a11y-background))',
            }}
            data-a11y-hover="muted"
          >
            {translations.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
