import React, { createContext, useContext, useEffect, useMemo } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export interface ThemeSettings {
  colors: ThemeColors;
  fonts: ThemeFonts;
  borderRadius: 'sharp' | 'rounded' | 'pill';
  darkMode: boolean;
}

interface ThemeContextValue extends ThemeSettings {
  getCssRadius: () => string;
  getButtonRadius: () => string;
  getCardRadius: () => string;
}

const defaultTheme: ThemeSettings = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#1E293B',
    accent: '#F59E0B',
  },
  fonts: {
    heading: 'Heebo',
    body: 'Heebo',
  },
  borderRadius: 'rounded',
  darkMode: true,
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  settings?: Record<string, unknown>;
  children: React.ReactNode;
}

export function ThemeProvider({ settings, children }: ThemeProviderProps) {
  // Parse settings from site.settings
  const theme: ThemeSettings = useMemo(() => {
    if (!settings) return defaultTheme;
    
    return {
      colors: {
        primary: (settings.colors as Record<string, string>)?.primary || defaultTheme.colors.primary,
        secondary: (settings.colors as Record<string, string>)?.secondary || defaultTheme.colors.secondary,
        accent: (settings.colors as Record<string, string>)?.accent || defaultTheme.colors.accent,
      },
      fonts: {
        heading: (settings.fonts as Record<string, string>)?.heading || defaultTheme.fonts.heading,
        body: (settings.fonts as Record<string, string>)?.body || defaultTheme.fonts.body,
      },
      borderRadius: (settings.borderRadius as ThemeSettings['borderRadius']) || defaultTheme.borderRadius,
      darkMode: settings.darkMode !== undefined ? Boolean(settings.darkMode) : defaultTheme.darkMode,
    };
  }, [settings]);

  // Load Google Fonts dynamically
  useEffect(() => {
    const fontMap: Record<string, string> = {
      'Heebo': 'Heebo:wght@300;400;500;600;700;800',
      'Assistant': 'Assistant:wght@300;400;500;600;700;800',
      'Rubik': 'Rubik:wght@300;400;500;600;700;800',
      'Open Sans': 'Open+Sans:wght@300;400;500;600;700;800',
      'Alef': 'Alef:wght@400;700',
      'Varela Round': 'Varela+Round',
    };

    const headingFont = fontMap[theme.fonts.heading] || fontMap['Heebo'];
    const bodyFont = fontMap[theme.fonts.body] || fontMap['Heebo'];
    
    const fonts = new Set([headingFont, bodyFont]);
    const fontQuery = Array.from(fonts).join('&family=');
    
    const linkId = 'theme-google-fonts';
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    
    link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}&display=swap`;
  }, [theme.fonts.heading, theme.fonts.body]);

  // Helper functions for border radius
  const getCssRadius = () => {
    switch (theme.borderRadius) {
      case 'sharp': return '0px';
      case 'rounded': return '8px';
      case 'pill': return '9999px';
      default: return '8px';
    }
  };

  const getButtonRadius = () => {
    switch (theme.borderRadius) {
      case 'sharp': return '0px';
      case 'rounded': return '8px';
      case 'pill': return '9999px';
      default: return '8px';
    }
  };

  const getCardRadius = () => {
    switch (theme.borderRadius) {
      case 'sharp': return '0px';
      case 'rounded': return '12px';
      case 'pill': return '24px';
      default: return '12px';
    }
  };

  const contextValue: ThemeContextValue = {
    ...theme,
    getCssRadius,
    getButtonRadius,
    getCardRadius,
  };

  // CSS custom properties for the theme
  const cssVariables = {
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-accent': theme.colors.accent,
    '--theme-radius': getCssRadius(),
    '--theme-radius-button': getButtonRadius(),
    '--theme-radius-card': getCardRadius(),
    '--theme-font-heading': theme.fonts.heading,
    '--theme-font-body': theme.fonts.body,
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider value={contextValue}>
      <div 
        style={cssVariables} 
        className={`${theme.darkMode ? 'dark' : ''}`}
        data-theme-mode={theme.darkMode ? 'dark' : 'light'}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default values if not within provider (for backward compatibility)
    return {
      colors: defaultTheme.colors,
      fonts: defaultTheme.fonts,
      borderRadius: defaultTheme.borderRadius,
      darkMode: defaultTheme.darkMode,
      getCssRadius: () => '8px',
      getButtonRadius: () => '8px',
      getCardRadius: () => '12px',
    };
  }
  return context;
}
