/**
 * Minimized Accessibility Button
 * כפתור נגישות ממוזער - נקודה קטנה בפינה
 *
 * @module accessibility/components/MinimizedButton
 */

import React from 'react';
import { MINIMIZED_BUTTON_SIZE, Z_INDEX_TRIGGER } from '../constants';
import type { AccessibilityTranslations } from '../i18n/translations';

export interface MinimizedButtonProps {
  /** callback להרחבה */
  onExpand: () => void;
  /** תרגומים */
  translations: AccessibilityTranslations;
  /** מיקום אופקי */
  position?: 'left' | 'right';
  /** offset מהקצה בפיקסלים */
  offset?: number;
}

export const MinimizedButton: React.FC<MinimizedButtonProps> = ({
  onExpand,
  translations,
  position = 'left',
  offset = 20,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const positionStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: offset,
    [position]: offset,
    zIndex: Z_INDEX_TRIGGER,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <button
        onClick={onExpand}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="group transition-all duration-300 ease-out"
        style={positionStyles}
        aria-label={translations.expandWidget}
        aria-expanded="false"
        title={translations.widgetMinimized}
      >
      {/* Pulse animation ring */}
      <span
        className="absolute inset-0 rounded-full animate-ping opacity-30"
        style={{
          width: MINIMIZED_BUTTON_SIZE,
          height: MINIMIZED_BUTTON_SIZE,
          backgroundColor: 'hsl(var(--a11y-primary))',
        }}
      />

      {/* Main dot */}
      <span
        className="relative block rounded-full border-2 shadow-lg transition-all duration-300"
        style={{
          width: isHovered ? MINIMIZED_BUTTON_SIZE * 1.5 : MINIMIZED_BUTTON_SIZE,
          height: isHovered ? MINIMIZED_BUTTON_SIZE * 1.5 : MINIMIZED_BUTTON_SIZE,
          backgroundColor: 'hsl(var(--a11y-primary))',
          borderColor: 'hsl(var(--a11y-primary-foreground))',
        }}
      >
        {/* Accessibility icon when hovered */}
        {isHovered && (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute inset-0 m-auto"
            style={{
              width: '60%',
              height: '60%',
              color: 'hsl(var(--a11y-primary-foreground))',
            }}
          >
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9H15V22H13V16H11V22H9V9H3V7H21V9Z" />
          </svg>
        )}
      </span>

      {/* Tooltip */}
      <span
        className={`
          absolute bottom-full mb-2 px-3 py-1.5 text-sm rounded-lg
          whitespace-nowrap pointer-events-none transition-all duration-200
          ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        `}
        style={{
          [position]: 0,
          backgroundColor: 'hsl(var(--a11y-foreground))',
          color: 'hsl(var(--a11y-background))',
        }}
      >
        {translations.expandWidget}
        </span>
      </button>
    </div>
  );
};
