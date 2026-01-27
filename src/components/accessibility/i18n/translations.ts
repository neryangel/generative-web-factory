/**
 * Accessibility Widget Translations
 * תרגומים עצמאיים לווידג'ט הנגישות - לא תלויים במערכת התרגום של האתר
 */

export const accessibilityTranslations = {
  he: {
    title: 'הגדרות נגישות',
    openMenu: 'פתח תפריט נגישות',
    close: 'סגור',
    fontSize: 'גודל גופן',
    fontSizeNormal: 'רגיל (100%)',
    fontSizeLarge: 'גדול (125%)',
    fontSizeXLarge: 'גדול מאוד (150%)',
    fontSizeXXLarge: 'ענק (200%)',
    increaseFont: 'הגדל גופן',
    decreaseFont: 'הקטן גופן',
    highContrast: 'ניגודיות גבוהה',
    highlightLinks: 'הדגשת קישורים',
    pauseAnimations: 'עצור אנימציות',
    largeCursor: 'סמן גדול',
    readingMask: 'מסכת קריאה',
    grayscale: 'גווני אפור',
    textSpacing: 'ריווח טקסט',
    dyslexiaFont: 'גופן קריא (דיסלקסיה)',
    reset: 'אפס הגדרות',
    statement: 'הצהרת נגישות',
    allSettings: 'כל ההגדרות',
    hideWidget: 'הסתר כפתור',
    widgetHidden: 'הכפתור הוסתר. לחץ Alt+A להצגה מחדש',
    showWidget: 'הצג כפתור נגישות',
    enabled: 'מופעל',
    disabled: 'כבוי',
    keyboardShortcutPrefix: 'קיצור מקלדת:',
    menuOpened: 'תפריט נגישות נפתח',
    menuClosed: 'תפריט נגישות נסגר',
    // Hide options translations
    hideOptions: 'אפשרויות הסתרה',
    minimize: 'מזער כפתור',
    minimizeDesc: 'הכפתור יוקטן לנקודה קטנה',
    hideForSession: 'הסתר לסשן זה',
    hideForSessionDesc: 'עד סגירת הדפדפן',
    hideForDay: 'הסתר ליום',
    hideForDayDesc: 'יחזור מחר',
    hideForWeek: 'הסתר לשבוע',
    hideForWeekDesc: 'יחזור בעוד 7 ימים',
    hideForMonth: 'הסתר לחודש',
    hideForMonthDesc: 'יחזור בעוד 30 ימים',
    hideForever: 'הסתר לצמיתות',
    hideForeverDesc: 'לחץ Alt+A להצגה',
    cancel: 'ביטול',
    widgetMinimized: 'הכפתור מוזער. לחץ להרחבה',
    expandWidget: 'הרחב תפריט נגישות',
    hiddenToastTitle: 'כפתור הנגישות הוסתר',
    hiddenToastSession: 'יחזור בסגירת הדפדפן',
    hiddenToastDay: 'יחזור מחר',
    hiddenToastWeek: 'יחזור בעוד שבוע',
    hiddenToastMonth: 'יחזור בעוד חודש',
    hiddenToastForever: 'לחץ Alt+A להצגה מחדש',
    showNow: 'הצג עכשיו',
    // Profiles translations
    quickProfiles: 'פרופילים מוכנים',
    apply: 'החל',
    active: 'פעיל',
  },
  en: {
    title: 'Accessibility Settings',
    openMenu: 'Open accessibility menu',
    close: 'Close',
    fontSize: 'Font Size',
    fontSizeNormal: 'Normal (100%)',
    fontSizeLarge: 'Large (125%)',
    fontSizeXLarge: 'Extra Large (150%)',
    fontSizeXXLarge: 'Huge (200%)',
    increaseFont: 'Increase font size',
    decreaseFont: 'Decrease font size',
    highContrast: 'High Contrast',
    highlightLinks: 'Highlight Links',
    pauseAnimations: 'Pause Animations',
    largeCursor: 'Large Cursor',
    readingMask: 'Reading Mask',
    grayscale: 'Grayscale',
    textSpacing: 'Text Spacing',
    dyslexiaFont: 'Dyslexia Friendly Font',
    reset: 'Reset Settings',
    statement: 'Accessibility Statement',
    hideWidget: 'Hide Button',
    widgetHidden: 'Button hidden. Press Alt+A to show again',
    showWidget: 'Show Accessibility Button',
    enabled: 'Enabled',
    disabled: 'Disabled',
    keyboardShortcutPrefix: 'Keyboard shortcut:',
    menuOpened: 'Accessibility menu opened',
    menuClosed: 'Accessibility menu closed',
    // Hide options translations
    hideOptions: 'Hide Options',
    minimize: 'Minimize Button',
    minimizeDesc: 'Button will shrink to a small dot',
    hideForSession: 'Hide for this session',
    hideForSessionDesc: 'Until browser closes',
    hideForDay: 'Hide for a day',
    hideForDayDesc: 'Returns tomorrow',
    hideForWeek: 'Hide for a week',
    hideForWeekDesc: 'Returns in 7 days',
    hideForMonth: 'Hide for a month',
    hideForMonthDesc: 'Returns in 30 days',
    hideForever: 'Hide forever',
    hideForeverDesc: 'Press Alt+A to show',
    cancel: 'Cancel',
    widgetMinimized: 'Button minimized. Click to expand',
    expandWidget: 'Expand accessibility menu',
    hiddenToastTitle: 'Accessibility button hidden',
    hiddenToastSession: 'Returns when browser closes',
    hiddenToastDay: 'Returns tomorrow',
    hiddenToastWeek: 'Returns in a week',
    hiddenToastMonth: 'Returns in a month',
    hiddenToastForever: 'Press Alt+A to show again',
    showNow: 'Show Now',
    // Profiles translations
    quickProfiles: 'Quick Profiles',
    apply: 'Apply',
    active: 'Active',
  },
} as const;

export type AccessibilityLanguage = keyof typeof accessibilityTranslations;
export type AccessibilityTranslationKey = keyof typeof accessibilityTranslations.he;

/** Type for translations - using a generic type to allow both languages */
export interface AccessibilityTranslations {
  title: string;
  openMenu: string;
  close: string;
  fontSize: string;
  fontSizeNormal: string;
  fontSizeLarge: string;
  fontSizeXLarge: string;
  fontSizeXXLarge: string;
  increaseFont: string;
  decreaseFont: string;
  highContrast: string;
  highlightLinks: string;
  pauseAnimations: string;
  largeCursor: string;
  readingMask: string;
  grayscale: string;
  textSpacing: string;
  dyslexiaFont: string;
  reset: string;
  statement: string;
  hideWidget: string;
  widgetHidden: string;
  showWidget: string;
  enabled: string;
  disabled: string;
  keyboardShortcutPrefix: string;
  menuOpened: string;
  menuClosed: string;
  // Hide options
  hideOptions: string;
  minimize: string;
  minimizeDesc: string;
  hideForSession: string;
  hideForSessionDesc: string;
  hideForDay: string;
  hideForDayDesc: string;
  hideForWeek: string;
  hideForWeekDesc: string;
  hideForMonth: string;
  hideForMonthDesc: string;
  hideForever: string;
  hideForeverDesc: string;
  cancel: string;
  widgetMinimized: string;
  expandWidget: string;
  hiddenToastTitle: string;
  hiddenToastSession: string;
  hiddenToastDay: string;
  hiddenToastWeek: string;
  hiddenToastMonth: string;
  hiddenToastForever: string;
  showNow: string;
  // Profiles
  quickProfiles: string;
  apply: string;
  active: string;
}
