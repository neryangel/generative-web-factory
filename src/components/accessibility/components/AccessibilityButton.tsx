/**
 * AccessibilityButton - כפתור פנימי לווידג'ט הנגישות
 * רכיב עצמאי שלא תלוי ב-shadcn/ui Button
 * משתמש בצבעים עצמאיים (--a11y-*) במקום tokens של האתר
 */

import React from 'react';
import { cn } from '../lib/utils';

export interface AccessibilityButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** וריאנט הכפתור */
  variant?: 'default' | 'outline' | 'ghost';
  /** גודל הכפתור */
  size?: 'default' | 'sm' | 'icon';
  /** תוכן הכפתור */
  children: React.ReactNode;
}

/**
 * כפתור פנימי לשימוש בווידג'ט הנגישות
 * משתמש בצבעים עצמאיים לעצמאות מלאה מהאתר
 */
export const AccessibilityButton = React.forwardRef<
  HTMLButtonElement,
  AccessibilityButtonProps
>(({
  className,
  variant = 'default',
  size = 'default',
  disabled,
  children,
  ...props
}, ref) => {
  // Inline styles עם CSS variables עצמאיים
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'background-color 0.2s, border-color 0.2s, color 0.2s',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'hsl(var(--a11y-primary))',
      color: 'hsl(var(--a11y-primary-foreground))',
    },
    outline: {
      backgroundColor: 'hsl(var(--a11y-background))',
      color: 'hsl(var(--a11y-foreground))',
      border: '1px solid hsl(var(--a11y-border))',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'hsl(var(--a11y-foreground))',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    default: {
      height: '2.5rem',
      padding: '0.5rem 1rem',
    },
    sm: {
      height: '2.25rem',
      padding: '0.5rem 0.75rem',
    },
    icon: {
      height: '2.5rem',
      width: '2.5rem',
      padding: 0,
    },
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'focus-visible:outline-none focus-visible:ring-2',
        className
      )}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        // Focus ring color
        ['--tw-ring-color' as string]: 'hsl(var(--a11y-primary))',
        ['--tw-ring-offset-color' as string]: 'hsl(var(--a11y-background))',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'default') {
            e.currentTarget.style.backgroundColor = 'hsl(var(--a11y-primary) / 0.9)';
          } else if (variant === 'outline' || variant === 'ghost') {
            e.currentTarget.style.backgroundColor = 'hsl(var(--a11y-muted))';
          }
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          if (variant === 'default') {
            e.currentTarget.style.backgroundColor = 'hsl(var(--a11y-primary))';
          } else if (variant === 'outline') {
            e.currentTarget.style.backgroundColor = 'hsl(var(--a11y-background))';
          } else if (variant === 'ghost') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }
        props.onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});

AccessibilityButton.displayName = 'AccessibilityButton';

export default AccessibilityButton;
