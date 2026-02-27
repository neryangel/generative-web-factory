import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import type { ReactNode } from 'react';

describe('ThemeProvider', () => {
  it('should render children', () => {
    render(
      <ThemeProvider>
        <div>Child content</div>
      </ThemeProvider>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('should provide default theme values when no settings are passed', () => {
    function TestConsumer() {
      const theme = useTheme();
      return (
        <div>
          <span data-testid="primary">{theme.colors.primary}</span>
          <span data-testid="heading-font">{theme.fonts.heading}</span>
          <span data-testid="border-radius">{theme.borderRadius}</span>
          <span data-testid="dark-mode">{String(theme.darkMode)}</span>
        </div>
      );
    }

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('primary')).toHaveTextContent('#8B5CF6');
    expect(screen.getByTestId('heading-font')).toHaveTextContent('Heebo');
    expect(screen.getByTestId('border-radius')).toHaveTextContent('rounded');
    expect(screen.getByTestId('dark-mode')).toHaveTextContent('true');
  });

  it('should apply custom settings when provided', () => {
    const customSettings = {
      colors: { primary: '#FF0000', secondary: '#00FF00', accent: '#0000FF' },
      fonts: { heading: 'Rubik', body: 'Assistant' },
      borderRadius: 'pill' as const,
      darkMode: false,
    };

    function TestConsumer() {
      const theme = useTheme();
      return (
        <div>
          <span data-testid="primary">{theme.colors.primary}</span>
          <span data-testid="secondary">{theme.colors.secondary}</span>
          <span data-testid="heading-font">{theme.fonts.heading}</span>
          <span data-testid="body-font">{theme.fonts.body}</span>
          <span data-testid="border-radius">{theme.borderRadius}</span>
          <span data-testid="dark-mode">{String(theme.darkMode)}</span>
        </div>
      );
    }

    render(
      <ThemeProvider settings={customSettings}>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('primary')).toHaveTextContent('#FF0000');
    expect(screen.getByTestId('secondary')).toHaveTextContent('#00FF00');
    expect(screen.getByTestId('heading-font')).toHaveTextContent('Rubik');
    expect(screen.getByTestId('body-font')).toHaveTextContent('Assistant');
    expect(screen.getByTestId('border-radius')).toHaveTextContent('pill');
    expect(screen.getByTestId('dark-mode')).toHaveTextContent('false');
  });

  it('should fall back to defaults for missing settings fields', () => {
    const partialSettings = {
      colors: { primary: '#FF0000' },
      // No fonts, borderRadius, or darkMode
    };

    function TestConsumer() {
      const theme = useTheme();
      return (
        <div>
          <span data-testid="primary">{theme.colors.primary}</span>
          <span data-testid="secondary">{theme.colors.secondary}</span>
          <span data-testid="heading-font">{theme.fonts.heading}</span>
          <span data-testid="border-radius">{theme.borderRadius}</span>
        </div>
      );
    }

    render(
      <ThemeProvider settings={partialSettings}>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('primary')).toHaveTextContent('#FF0000');
    // Secondary should fall back to default
    expect(screen.getByTestId('secondary')).toHaveTextContent('#1E293B');
    expect(screen.getByTestId('heading-font')).toHaveTextContent('Heebo');
    expect(screen.getByTestId('border-radius')).toHaveTextContent('rounded');
  });

  it('should apply "dark" class when darkMode is true', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    // The wrapper div should have 'dark' class (default darkMode is true)
    const themeDiv = container.querySelector('[data-theme-mode]');
    expect(themeDiv).toHaveAttribute('data-theme-mode', 'dark');
    expect(themeDiv).toHaveClass('dark');
  });

  it('should not apply "dark" class when darkMode is false', () => {
    const { container } = render(
      <ThemeProvider settings={{ darkMode: false }}>
        <div>Test</div>
      </ThemeProvider>
    );

    const themeDiv = container.querySelector('[data-theme-mode]');
    expect(themeDiv).toHaveAttribute('data-theme-mode', 'light');
    expect(themeDiv).not.toHaveClass('dark');
  });

  it('should set CSS custom properties on wrapper div', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Test</div>
      </ThemeProvider>
    );

    const themeDiv = container.querySelector('[data-theme-mode]') as HTMLElement;
    expect(themeDiv.style.getPropertyValue('--theme-primary')).toBe('#8B5CF6');
    expect(themeDiv.style.getPropertyValue('--theme-secondary')).toBe('#1E293B');
    expect(themeDiv.style.getPropertyValue('--theme-accent')).toBe('#F59E0B');
  });
});

describe('useTheme', () => {
  it('should return default values when used outside provider', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.colors.primary).toBe('#8B5CF6');
    expect(result.current.fonts.heading).toBe('Heebo');
    expect(result.current.borderRadius).toBe('rounded');
    expect(result.current.darkMode).toBe(true);
  });

  it('should return correct values when used inside provider', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ThemeProvider settings={{ colors: { primary: '#123456' } }}>
        {children}
      </ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.colors.primary).toBe('#123456');
  });

  describe('getCssRadius', () => {
    it('should return "0px" for sharp', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'sharp' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getCssRadius()).toBe('0px');
    });

    it('should return "8px" for rounded', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'rounded' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getCssRadius()).toBe('8px');
    });

    it('should return "9999px" for pill', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'pill' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getCssRadius()).toBe('9999px');
    });

    it('should return "8px" as default outside provider', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.getCssRadius()).toBe('8px');
    });
  });

  describe('getButtonRadius', () => {
    it('should return "0px" for sharp', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'sharp' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getButtonRadius()).toBe('0px');
    });

    it('should return "8px" for rounded', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'rounded' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getButtonRadius()).toBe('8px');
    });

    it('should return "9999px" for pill', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'pill' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getButtonRadius()).toBe('9999px');
    });
  });

  describe('getCardRadius', () => {
    it('should return "0px" for sharp', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'sharp' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getCardRadius()).toBe('0px');
    });

    it('should return "12px" for rounded', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'rounded' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getCardRadius()).toBe('12px');
    });

    it('should return "24px" for pill', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <ThemeProvider settings={{ borderRadius: 'pill' }}>
          {children}
        </ThemeProvider>
      );
      const { result } = renderHook(() => useTheme(), { wrapper });
      expect(result.current.getCardRadius()).toBe('24px');
    });

    it('should return "12px" as default outside provider', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.getCardRadius()).toBe('12px');
    });
  });
});
