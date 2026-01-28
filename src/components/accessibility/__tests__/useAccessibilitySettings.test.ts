import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccessibilitySettings } from '../hooks/useAccessibilitySettings';
import { DEFAULT_SETTINGS } from '../types';
import { STORAGE_KEY, MAX_FONT_SIZE_LEVEL, MIN_FONT_SIZE_LEVEL } from '../constants';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useAccessibilitySettings', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should return default settings on first load', () => {
    const { result } = renderHook(() => useAccessibilitySettings());
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('should restore settings from localStorage', () => {
    const stored = { ...DEFAULT_SETTINGS, highContrast: true, grayscale: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

    const { result } = renderHook(() => useAccessibilitySettings());
    expect(result.current.settings.highContrast).toBe(true);
    expect(result.current.settings.grayscale).toBe(true);
  });

  it('should fall back to defaults if localStorage contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');

    const { result } = renderHook(() => useAccessibilitySettings());
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('should toggle a boolean setting via updateSetting', () => {
    const { result } = renderHook(() => useAccessibilitySettings());

    act(() => {
      result.current.updateSetting('highContrast', true);
    });

    expect(result.current.settings.highContrast).toBe(true);
  });

  it('should persist settings to localStorage on change', () => {
    const { result } = renderHook(() => useAccessibilitySettings());

    act(() => {
      result.current.updateSetting('largeCursor', true);
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    expect(stored.largeCursor).toBe(true);
  });

  it('should increase font size up to MAX_FONT_SIZE_LEVEL', () => {
    const { result } = renderHook(() => useAccessibilitySettings());

    for (let i = 0; i <= MAX_FONT_SIZE_LEVEL + 1; i++) {
      act(() => { result.current.increaseFontSize(); });
    }

    expect(result.current.settings.fontSize).toBe(MAX_FONT_SIZE_LEVEL);
  });

  it('should decrease font size down to MIN_FONT_SIZE_LEVEL', () => {
    const { result } = renderHook(() => useAccessibilitySettings());

    // First increase
    act(() => { result.current.increaseFontSize(); });
    expect(result.current.settings.fontSize).toBe(1);

    // Decrease back
    act(() => { result.current.decreaseFontSize(); });
    expect(result.current.settings.fontSize).toBe(MIN_FONT_SIZE_LEVEL);

    // Should not go below min
    act(() => { result.current.decreaseFontSize(); });
    expect(result.current.settings.fontSize).toBe(MIN_FONT_SIZE_LEVEL);
  });

  it('should reset all settings to defaults', () => {
    const { result } = renderHook(() => useAccessibilitySettings());

    act(() => {
      result.current.updateSetting('highContrast', true);
      result.current.updateSetting('grayscale', true);
      result.current.updateSetting('textSpacing', true);
    });

    act(() => {
      result.current.resetSettings();
    });

    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('should call announce callback on reset', () => {
    const { result } = renderHook(() => useAccessibilitySettings());
    const announce = vi.fn();

    act(() => {
      result.current.updateSetting('highContrast', true);
    });

    act(() => {
      result.current.resetSettings(announce, 'Settings reset');
    });

    expect(announce).toHaveBeenCalledWith('Settings reset');
  });
});
