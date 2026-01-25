import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoSave } from './useAutoSave';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock supabase
const mockUpdate = vi.fn();
const mockEq = vi.fn(() => Promise.resolve({ error: null }));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (table: string) => ({
      update: (data: unknown) => {
        mockUpdate(table, data);
        return {
          eq: mockEq,
        };
      },
    }),
  },
}));

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useAutoSave());

      expect(result.current.isSaving).toBe(false);
      expect(result.current.lastSaved).toBeNull();
    });

    it('should return saveSection function', () => {
      const { result } = renderHook(() => useAutoSave());
      expect(typeof result.current.saveSection).toBe('function');
    });

    it('should return savePage function', () => {
      const { result } = renderHook(() => useAutoSave());
      expect(typeof result.current.savePage).toBe('function');
    });

    it('should return saveSite function', () => {
      const { result } = renderHook(() => useAutoSave());
      expect(typeof result.current.saveSite).toBe('function');
    });

    it('should return flushSave function', () => {
      const { result } = renderHook(() => useAutoSave());
      expect(typeof result.current.flushSave).toBe('function');
    });
  });

  describe('saveSection', () => {
    it('should debounce section saves', async () => {
      const { result } = renderHook(() => useAutoSave({ debounceMs: 1000 }));

      act(() => {
        result.current.saveSection('section-1', { title: 'Test' });
      });

      // Should not have called update yet
      expect(mockUpdate).not.toHaveBeenCalled();

      // Advance timers
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Should have called update
      expect(mockUpdate).toHaveBeenCalledWith('sections', expect.anything());
    });

    it('should not call update if no pending operations', async () => {
      const { result } = renderHook(() => useAutoSave());

      await act(async () => {
        await result.current.flushSave();
      });

      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('savePage', () => {
    it('should queue page update', async () => {
      const { result } = renderHook(() => useAutoSave({ debounceMs: 100 }));

      act(() => {
        result.current.savePage('page-1', { title: 'Updated Page' });
      });

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(mockUpdate).toHaveBeenCalledWith('pages', expect.anything());
    });
  });

  describe('saveSite', () => {
    it('should queue site update', async () => {
      const { result } = renderHook(() => useAutoSave({ debounceMs: 100 }));

      act(() => {
        result.current.saveSite('site-1', { name: 'Updated Site' });
      });

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(mockUpdate).toHaveBeenCalledWith('sites', expect.anything());
    });
  });

  describe('flushSave', () => {
    it('should immediately save pending operations', async () => {
      const { result } = renderHook(() => useAutoSave({ debounceMs: 5000 }));

      act(() => {
        result.current.saveSection('section-1', { title: 'Test' });
      });

      expect(mockUpdate).not.toHaveBeenCalled();

      await act(async () => {
        await result.current.flushSave();
      });

      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('callbacks', () => {
    it('should call onSaveStart when saving begins', async () => {
      const onSaveStart = vi.fn();
      const { result } = renderHook(() => useAutoSave({ debounceMs: 100, onSaveStart }));

      act(() => {
        result.current.saveSection('section-1', { title: 'Test' });
      });

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(onSaveStart).toHaveBeenCalled();
    });
  });

  describe('batching', () => {
    it('should batch multiple table updates', async () => {
      const { result } = renderHook(() => useAutoSave({ debounceMs: 100 }));

      act(() => {
        result.current.saveSection('section-1', { title: 'Section' });
        result.current.savePage('page-1', { title: 'Page' });
        result.current.saveSite('site-1', { name: 'Site' });
      });

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      expect(mockUpdate).toHaveBeenCalledWith('sections', expect.anything());
      expect(mockUpdate).toHaveBeenCalledWith('pages', expect.anything());
      expect(mockUpdate).toHaveBeenCalledWith('sites', expect.anything());
    });
  });
});
