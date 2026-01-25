export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export type BorderRadiusStyle = 'sharp' | 'rounded' | 'pill';

export interface ThemeSettings {
  colors: ThemeColors;
  fonts: ThemeFonts;
  borderRadius: BorderRadiusStyle;
  darkMode: boolean;
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#5d00ff',
  secondary: '#000000',
  accent: '#6f6758',
};

export const DEFAULT_THEME_FONTS: ThemeFonts = {
  heading: 'Heebo',
  body: 'Heebo',
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  colors: DEFAULT_THEME_COLORS,
  fonts: DEFAULT_THEME_FONTS,
  borderRadius: 'rounded',
  darkMode: false,
};
