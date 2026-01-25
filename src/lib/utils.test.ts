import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes', () => {
      expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar');
    });

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('should handle objects', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
    });

    it('should merge Tailwind classes correctly', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });

    it('should handle empty string', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('should handle complex Tailwind merges', () => {
      expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500');
    });

    it('should handle responsive classes', () => {
      expect(cn('sm:p-2', 'sm:p-4')).toBe('sm:p-4');
      expect(cn('md:text-lg', 'lg:text-xl')).toBe('md:text-lg lg:text-xl');
    });

    it('should return empty string for no arguments', () => {
      expect(cn()).toBe('');
    });
  });
});
