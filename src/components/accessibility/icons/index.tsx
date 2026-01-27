/**
 * Accessibility Widget Icons
 * אייקונים עצמאיים לווידג'ט הנגישות - לא תלויים ב-lucide-react
 * מבוססים על Lucide SVG paths
 * @version 2.0.0
 */

import React from 'react';

/** Props לכל האייקונים */
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** גודל האייקון */
  size?: number | string;
  /** צבע האייקון */
  color?: string;
  /** רוחב הקו */
  strokeWidth?: number;
}

/** Base Icon Component */
const Icon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  children,
  className,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

/** Accessibility Icon - אייקון נגישות */
export const AccessibilityIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="16" cy="4" r="1" />
    <path d="m18 19 1-7-6 1" />
    <path d="m5 8 3-3 5.5 3-2.36 3.5" />
    <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
    <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
  </Icon>
);

/** ZoomIn Icon - הגדלה */
export const ZoomInIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
    <line x1="11" x2="11" y1="8" y2="14" />
    <line x1="8" x2="14" y1="11" y2="11" />
  </Icon>
);

/** ZoomOut Icon - הקטנה */
export const ZoomOutIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
    <line x1="8" x2="14" y1="11" y2="11" />
  </Icon>
);

/** Contrast Icon - ניגודיות */
export const ContrastIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 18a6 6 0 0 0 0-12v12z" />
  </Icon>
);

/** Link2 Icon - קישור */
export const LinkIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M9 17H7A5 5 0 0 1 7 7h2" />
    <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
    <line x1="8" x2="16" y1="12" y2="12" />
  </Icon>
);

/** MousePointer2 Icon - סמן */
export const MousePointerIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="m4 4 7.07 17 2.51-7.39L21 11.07z" />
  </Icon>
);

/** Pause Icon - עצירה */
export const PauseIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect width="4" height="16" x="6" y="4" />
    <rect width="4" height="16" x="14" y="4" />
  </Icon>
);

/** RotateCcw Icon - איפוס */
export const RotateCcwIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);

/** X Icon - סגירה */
export const XIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);

/** Minus Icon - מסכת קריאה */
export const MinusIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M5 12h14" />
  </Icon>
);

/** Circle Icon - גווני אפור */
export const CircleIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
  </Icon>
);

/** AlignJustify Icon - ריווח טקסט */
export const AlignJustifyIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="3" x2="21" y1="6" y2="6" />
    <line x1="3" x2="21" y1="12" y2="12" />
    <line x1="3" x2="21" y1="18" y2="18" />
  </Icon>
);

/** Type Icon - גופן דיסלקסיה */
export const TypeIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" x2="15" y1="20" y2="20" />
    <line x1="12" x2="12" y1="4" y2="20" />
  </Icon>
);

/** Settings Icon - הגדרות */
export const SettingsIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

/** EyeOff Icon - הסתרה */
export const EyeOffIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </Icon>
);

/** Minimize2 Icon - מזעור */
export const Minimize2Icon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" x2="21" y1="10" y2="3" />
    <line x1="3" x2="10" y1="21" y2="14" />
  </Icon>
);

/** Clock Icon - שעון */
export const ClockIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Icon>
);

/** Calendar Icon - לוח שנה */
export const CalendarIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </Icon>
);

/** CalendarDays Icon - לוח שנה עם ימים */
export const CalendarDaysIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </Icon>
);

/** Export all icons */
export const Icons = {
  Accessibility: AccessibilityIcon,
  ZoomIn: ZoomInIcon,
  ZoomOut: ZoomOutIcon,
  Contrast: ContrastIcon,
  Link: LinkIcon,
  MousePointer: MousePointerIcon,
  Pause: PauseIcon,
  RotateCcw: RotateCcwIcon,
  X: XIcon,
  Minus: MinusIcon,
  Circle: CircleIcon,
  AlignJustify: AlignJustifyIcon,
  Type: TypeIcon,
  Settings: SettingsIcon,
  EyeOff: EyeOffIcon,
  Minimize2: Minimize2Icon,
  Clock: ClockIcon,
  Calendar: CalendarIcon,
  CalendarDays: CalendarDaysIcon,
} as const;
