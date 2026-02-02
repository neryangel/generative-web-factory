import { describe, it, expect } from 'vitest';
import { isValidIsraeliPhone, normalizePhoneNumber } from './phone-validation';

describe('isValidIsraeliPhone', () => {
  describe('Valid mobile numbers', () => {
    it('should validate 050 prefix', () => {
      expect(isValidIsraeliPhone('0501234567')).toBe(true);
    });

    it('should validate 052 prefix', () => {
      expect(isValidIsraeliPhone('0521234567')).toBe(true);
    });

    it('should validate 053 prefix', () => {
      expect(isValidIsraeliPhone('0531234567')).toBe(true);
    });

    it('should validate 054 prefix', () => {
      expect(isValidIsraeliPhone('0541234567')).toBe(true);
    });

    it('should validate 055 prefix', () => {
      expect(isValidIsraeliPhone('0551234567')).toBe(true);
    });

    it('should validate 058 prefix', () => {
      expect(isValidIsraeliPhone('0581234567')).toBe(true);
    });
  });

  describe('Valid landline numbers', () => {
    it('should validate 02 prefix (Jerusalem)', () => {
      expect(isValidIsraeliPhone('021234567')).toBe(true);
    });

    it('should validate 03 prefix (Tel Aviv)', () => {
      expect(isValidIsraeliPhone('031234567')).toBe(true);
    });

    it('should validate 04 prefix (Haifa)', () => {
      expect(isValidIsraeliPhone('041234567')).toBe(true);
    });

    it('should validate 08 prefix (Beer Sheva)', () => {
      expect(isValidIsraeliPhone('081234567')).toBe(true);
    });

    it('should validate 09 prefix (Sharon)', () => {
      expect(isValidIsraeliPhone('091234567')).toBe(true);
    });
  });

  describe('International format', () => {
    it('should validate +972 mobile format', () => {
      expect(isValidIsraeliPhone('+972501234567')).toBe(true);
    });

    it('should validate +972 landline format', () => {
      expect(isValidIsraeliPhone('+97221234567')).toBe(true);
    });

    it('should validate +972 with different mobile prefixes', () => {
      expect(isValidIsraeliPhone('+972521234567')).toBe(true);
      expect(isValidIsraeliPhone('+972531234567')).toBe(true);
      expect(isValidIsraeliPhone('+972541234567')).toBe(true);
    });
  });

  describe('Numbers with formatting', () => {
    it('should validate numbers with dashes', () => {
      expect(isValidIsraeliPhone('050-123-4567')).toBe(true);
    });

    it('should validate numbers with spaces', () => {
      expect(isValidIsraeliPhone('050 123 4567')).toBe(true);
    });

    it('should validate international format with dashes', () => {
      expect(isValidIsraeliPhone('+972-50-1234567')).toBe(true);
    });

    it('should validate international format with spaces', () => {
      expect(isValidIsraeliPhone('+972 50 1234567')).toBe(true);
    });
  });

  describe('Invalid formats', () => {
    it('should reject numbers that are too short', () => {
      expect(isValidIsraeliPhone('050123456')).toBe(false);
    });

    it('should reject numbers that are too long', () => {
      expect(isValidIsraeliPhone('05012345678')).toBe(false);
    });

    it('should reject invalid prefixes', () => {
      expect(isValidIsraeliPhone('0601234567')).toBe(false);
      expect(isValidIsraeliPhone('0701234567')).toBe(false);
    });

    it('should reject numbers with letters', () => {
      expect(isValidIsraeliPhone('050-ABC-DEFG')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(isValidIsraeliPhone('')).toBe(false);
    });

    it('should reject null/undefined (type coercion)', () => {
      expect(isValidIsraeliPhone(null as any)).toBe(false);
      expect(isValidIsraeliPhone(undefined as any)).toBe(false);
    });

    it('should reject non-string values', () => {
      expect(isValidIsraeliPhone(123 as any)).toBe(false);
    });
  });
});

describe('normalizePhoneNumber', () => {
  describe('Local to international conversion', () => {
    it('should convert 050 to +97250', () => {
      expect(normalizePhoneNumber('0501234567')).toBe('+972501234567');
    });

    it('should convert 02 to +9722', () => {
      expect(normalizePhoneNumber('021234567')).toBe('+97221234567');
    });

    it('should convert numbers with dashes', () => {
      expect(normalizePhoneNumber('050-123-4567')).toBe('+972501234567');
    });

    it('should convert numbers with spaces', () => {
      expect(normalizePhoneNumber('050 123 4567')).toBe('+972501234567');
    });
  });

  describe('Already international format', () => {
    it('should keep +972 format unchanged', () => {
      expect(normalizePhoneNumber('+972501234567')).toBe('+972501234567');
    });

    it('should remove formatting from international numbers', () => {
      expect(normalizePhoneNumber('+972-50-1234567')).toBe('+972501234567');
    });
  });
});
