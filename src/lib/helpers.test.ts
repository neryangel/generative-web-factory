import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateSlug,
  getContrastColor,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  isValidHexColor,
  hexToHsl,
  hexToHslString,
  truncate,
  generateId,
  deepClone,
  isEmpty,
  debounce,
  getFileExtension,
  formatFileSize,
} from './helpers';

describe('helpers', () => {
  describe('generateSlug', () => {
    it('should convert string to lowercase', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should replace spaces with hyphens', () => {
      expect(generateSlug('hello world test')).toBe('hello-world-test');
    });

    it('should remove special characters', () => {
      expect(generateSlug('Hello! @World#')).toBe('hello-world');
    });

    it('should collapse multiple hyphens', () => {
      expect(generateSlug('hello   world')).toBe('hello-world');
    });

    it('should handle Hebrew characters', () => {
      expect(generateSlug('שלום עולם')).toBe('-');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });

    it('should handle numbers', () => {
      expect(generateSlug('test 123')).toBe('test-123');
    });

    it('should handle mixed content', () => {
      expect(generateSlug('Hello World 2024!')).toBe('hello-world-2024');
    });
  });

  describe('getContrastColor', () => {
    it('should return black for light colors', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000');
      expect(getContrastColor('#f0f0f0')).toBe('#000000');
      expect(getContrastColor('#ffff00')).toBe('#000000');
    });

    it('should return white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('#ffffff');
      expect(getContrastColor('#333333')).toBe('#ffffff');
      expect(getContrastColor('#0000ff')).toBe('#ffffff');
    });

    it('should handle colors with # prefix', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000');
    });

    it('should handle colors without # prefix', () => {
      expect(getContrastColor('ffffff')).toBe('#000000');
    });

    it('should handle mid-tone colors', () => {
      expect(getContrastColor('#808080')).toBe('#000000');
    });
  });

  describe('formatDate', () => {
    it('should format a date string', () => {
      const result = formatDate('2024-01-15');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });

    it('should format a Date object', () => {
      const result = formatDate(new Date('2024-01-15'));
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const result = formatDateTime('2024-01-15T10:30:00');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return "עכשיו" for recent times', () => {
      const result = formatRelativeTime('2024-01-15T11:59:30');
      expect(result).toBe('עכשיו');
    });

    it('should return minutes ago', () => {
      const result = formatRelativeTime('2024-01-15T11:55:00');
      expect(result).toBe('לפני 5 דקות');
    });

    it('should return hours ago', () => {
      const result = formatRelativeTime('2024-01-15T09:00:00');
      expect(result).toBe('לפני 3 שעות');
    });

    it('should return days ago', () => {
      const result = formatRelativeTime('2024-01-13T12:00:00');
      expect(result).toBe('לפני 2 ימים');
    });

    it('should return formatted date for old dates', () => {
      const result = formatRelativeTime('2024-01-01T12:00:00');
      expect(result).toContain('2024');
    });
  });

  describe('isValidHexColor', () => {
    it('should validate 6-digit hex colors', () => {
      expect(isValidHexColor('#ffffff')).toBe(true);
      expect(isValidHexColor('#000000')).toBe(true);
      expect(isValidHexColor('#AbCdEf')).toBe(true);
    });

    it('should validate 3-digit hex colors', () => {
      expect(isValidHexColor('#fff')).toBe(true);
      expect(isValidHexColor('#000')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('ffffff')).toBe(false);
      expect(isValidHexColor('#gggggg')).toBe(false);
      expect(isValidHexColor('#ff')).toBe(false);
      expect(isValidHexColor('#fffffff')).toBe(false);
      expect(isValidHexColor('red')).toBe(false);
    });
  });

  describe('hexToHsl', () => {
    it('should convert white to HSL', () => {
      const result = hexToHsl('#ffffff');
      expect(result).toEqual({ h: 0, s: 0, l: 100 });
    });

    it('should convert black to HSL', () => {
      const result = hexToHsl('#000000');
      expect(result).toEqual({ h: 0, s: 0, l: 0 });
    });

    it('should convert red to HSL', () => {
      const result = hexToHsl('#ff0000');
      expect(result).toEqual({ h: 0, s: 100, l: 50 });
    });

    it('should convert green to HSL', () => {
      const result = hexToHsl('#00ff00');
      expect(result).toEqual({ h: 120, s: 100, l: 50 });
    });

    it('should convert blue to HSL', () => {
      const result = hexToHsl('#0000ff');
      expect(result).toEqual({ h: 240, s: 100, l: 50 });
    });

    it('should handle invalid hex', () => {
      const result = hexToHsl('invalid');
      expect(result).toEqual({ h: 0, s: 0, l: 0 });
    });

    it('should handle hex without # prefix', () => {
      const result = hexToHsl('ff0000');
      expect(result).toEqual({ h: 0, s: 100, l: 50 });
    });
  });

  describe('hexToHslString', () => {
    it('should convert hex to HSL string format', () => {
      expect(hexToHslString('#ff0000')).toBe('0 100% 50%');
    });

    it('should convert white to HSL string format', () => {
      expect(hexToHslString('#ffffff')).toBe('0 0% 100%');
    });
  });

  describe('truncate', () => {
    it('should not truncate short text', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('should truncate long text with ellipsis', () => {
      expect(truncate('hello world test', 10)).toBe('hello w...');
    });

    it('should handle exact length', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });
  });

  describe('generateId', () => {
    it('should generate a string id', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should generate unique ids', () => {
      const ids = new Set([generateId(), generateId(), generateId(), generateId()]);
      expect(ids.size).toBe(4);
    });

    it('should generate ids of expected length', () => {
      const id = generateId();
      expect(id.length).toBe(9);
    });
  });

  describe('deepClone', () => {
    it('should clone primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('hello')).toBe('hello');
      expect(deepClone(true)).toBe(true);
    });

    it('should clone arrays', () => {
      const original = [1, 2, 3];
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it('should clone nested objects', () => {
      const original = { a: { b: { c: 1 } } };
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.a).not.toBe(original.a);
    });

    it('should clone objects with arrays', () => {
      const original = { items: [1, 2, { x: 3 }] };
      const cloned = deepClone(original);
      expect(cloned).toEqual(original);
      expect(cloned.items).not.toBe(original.items);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty object', () => {
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty object', () => {
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should handle object with undefined values', () => {
      expect(isEmpty({ a: undefined })).toBe(false);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should debounce function calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to the debounced function', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should reset timer on subsequent calls', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(50);

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFileExtension', () => {
    it('should return file extension', () => {
      expect(getFileExtension('file.txt')).toBe('txt');
      expect(getFileExtension('image.png')).toBe('png');
      expect(getFileExtension('document.pdf')).toBe('pdf');
    });

    it('should handle files with multiple dots', () => {
      expect(getFileExtension('file.name.txt')).toBe('txt');
    });

    it('should handle files without extension', () => {
      expect(getFileExtension('filename')).toBe('');
    });

    it('should handle hidden files', () => {
      // Hidden files without extension after the dot return empty string
      expect(getFileExtension('.gitignore')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(100)).toBe('100 B');
      expect(formatFileSize(1023)).toBe('1023 B');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });
});
