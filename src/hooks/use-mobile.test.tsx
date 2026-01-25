import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;
  let matchMediaListeners: Array<() => void> = [];

  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (event: string, cb: () => void) => {
          if (event === 'change') {
            matchMediaListeners.push(cb);
          }
        },
        removeEventListener: (event: string, cb: () => void) => {
          matchMediaListeners = matchMediaListeners.filter(l => l !== cb);
        },
        dispatchEvent: vi.fn(),
      })),
    });
  };

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  beforeEach(() => {
    matchMediaListeners = [];
    setWindowWidth(1024); // Default to desktop
    mockMatchMedia(false);
  });

  afterEach(() => {
    setWindowWidth(originalInnerWidth);
    vi.clearAllMocks();
  });

  it('should return false for desktop width', async () => {
    setWindowWidth(1024);
    mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should return true for mobile width', async () => {
    setWindowWidth(500);
    mockMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should return false for exactly 768px width', async () => {
    setWindowWidth(768);
    mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });
  });

  it('should return true for 767px width', async () => {
    setWindowWidth(767);
    mockMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should update when window is resized', async () => {
    setWindowWidth(1024);
    mockMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    await waitFor(() => {
      expect(result.current).toBe(false);
    });

    // Simulate resize to mobile
    act(() => {
      setWindowWidth(500);
      matchMediaListeners.forEach(listener => listener());
    });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should clean up event listener on unmount', () => {
    setWindowWidth(1024);
    mockMatchMedia(false);

    const { unmount } = renderHook(() => useIsMobile());

    expect(matchMediaListeners.length).toBe(1);

    unmount();

    expect(matchMediaListeners.length).toBe(0);
  });
});
