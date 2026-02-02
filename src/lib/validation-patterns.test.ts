import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  PASSWORD_MIN_LENGTH,
  PASSWORD_HAS_UPPERCASE,
  PASSWORD_HAS_LOWERCASE,
  PASSWORD_HAS_NUMBER,
  PASSWORD_STRONG,
  PASSWORD_REQUIREMENTS,
  PASSWORD_STRENGTH_LABELS,
  PASSWORD_CONFIRMATION_MESSAGES
} from './validation-patterns';

describe('Password Validation Constants', () => {
  it('should export PASSWORD_MIN_LENGTH constant', () => {
    expect(PASSWORD_MIN_LENGTH).toBe(8);
  });

  it('should export PASSWORD_HAS_UPPERCASE regex', () => {
    expect(PASSWORD_HAS_UPPERCASE.test('A')).toBe(true);
    expect(PASSWORD_HAS_UPPERCASE.test('a')).toBe(false);
  });

  it('should export PASSWORD_HAS_LOWERCASE regex', () => {
    expect(PASSWORD_HAS_LOWERCASE.test('a')).toBe(true);
    expect(PASSWORD_HAS_LOWERCASE.test('A')).toBe(false);
  });

  it('should export PASSWORD_HAS_NUMBER regex', () => {
    expect(PASSWORD_HAS_NUMBER.test('1')).toBe(true);
    expect(PASSWORD_HAS_NUMBER.test('a')).toBe(false);
  });

  it('should export PASSWORD_STRONG regex', () => {
    expect(PASSWORD_STRONG.test('Abcdefg1')).toBe(true);
    expect(PASSWORD_STRONG.test('abcdefg1')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should return all false for empty string', () => {
    const result = validatePassword('');
    expect(result.hasMinLength).toBe(false);
    expect(result.hasUppercase).toBe(false);
    expect(result.hasLowercase).toBe(false);
    expect(result.hasNumber).toBe(false);
    expect(result.score).toBe(0);
    expect(result.strength).toBe('weak');
    expect(result.isValid).toBe(false);
  });

  it('should return hasLowercase true only for "abc"', () => {
    const result = validatePassword('abc');
    expect(result.hasMinLength).toBe(false);
    expect(result.hasUppercase).toBe(false);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumber).toBe(false);
    expect(result.score).toBe(1);
    expect(result.strength).toBe('weak');
    expect(result.isValid).toBe(false);
  });

  it('should return hasMinLength + hasLowercase for "abcdefgh"', () => {
    const result = validatePassword('abcdefgh');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(false);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumber).toBe(false);
    expect(result.score).toBe(2);
    expect(result.strength).toBe('weak');
    expect(result.isValid).toBe(false);
  });

  it('should return hasMinLength + hasUppercase + hasLowercase for "Abcdefgh"', () => {
    const result = validatePassword('Abcdefgh');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumber).toBe(false);
    expect(result.score).toBe(3);
    expect(result.strength).toBe('medium');
    expect(result.isValid).toBe(false);
  });

  it('should return all true for "Abcdefg1"', () => {
    const result = validatePassword('Abcdefg1');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.score).toBe(4);
    expect(result.strength).toBe('strong');
    expect(result.isValid).toBe(true);
  });

  it('should return hasUppercase + hasNumber for "AB12" (too short)', () => {
    const result = validatePassword('AB12');
    expect(result.hasMinLength).toBe(false);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(false);
    expect(result.hasNumber).toBe(true);
    expect(result.score).toBe(2);
    expect(result.strength).toBe('weak');
    expect(result.isValid).toBe(false);
  });

  it('should return hasMinLength + hasLowercase + hasNumber for "abcdefg1"', () => {
    const result = validatePassword('abcdefg1');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(false);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.score).toBe(3);
    expect(result.strength).toBe('medium');
    expect(result.isValid).toBe(false);
  });

  it('should return hasMinLength + hasUppercase + hasNumber for "ABCDEFG1"', () => {
    const result = validatePassword('ABCDEFG1');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(false);
    expect(result.hasNumber).toBe(true);
    expect(result.score).toBe(3);
    expect(result.strength).toBe('medium');
    expect(result.isValid).toBe(false);
  });

  it('should return all true for "Abcdefgh1"', () => {
    const result = validatePassword('Abcdefgh1');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(true);
    expect(result.hasLowercase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.score).toBe(4);
    expect(result.strength).toBe('strong');
    expect(result.isValid).toBe(true);
  });

  it('should return hasMinLength + hasNumber for "12345678"', () => {
    const result = validatePassword('12345678');
    expect(result.hasMinLength).toBe(true);
    expect(result.hasUppercase).toBe(false);
    expect(result.hasLowercase).toBe(false);
    expect(result.hasNumber).toBe(true);
    expect(result.score).toBe(2);
    expect(result.strength).toBe('weak');
    expect(result.isValid).toBe(false);
  });
});

describe('Password Hebrew Labels', () => {
  it('should export PASSWORD_REQUIREMENTS with Hebrew labels', () => {
    expect(PASSWORD_REQUIREMENTS).toBeDefined();
    expect(PASSWORD_REQUIREMENTS).toHaveProperty('minLength');
    expect(PASSWORD_REQUIREMENTS).toHaveProperty('uppercase');
    expect(PASSWORD_REQUIREMENTS).toHaveProperty('lowercase');
    expect(PASSWORD_REQUIREMENTS).toHaveProperty('number');
    expect(typeof PASSWORD_REQUIREMENTS.minLength).toBe('string');
  });

  it('should export PASSWORD_STRENGTH_LABELS with Hebrew labels', () => {
    expect(PASSWORD_STRENGTH_LABELS).toBeDefined();
    expect(PASSWORD_STRENGTH_LABELS).toHaveProperty('weak');
    expect(PASSWORD_STRENGTH_LABELS).toHaveProperty('medium');
    expect(PASSWORD_STRENGTH_LABELS).toHaveProperty('strong');
    expect(typeof PASSWORD_STRENGTH_LABELS.weak).toBe('string');
  });

  it('should export PASSWORD_CONFIRMATION_MESSAGES with Hebrew strings', () => {
    expect(PASSWORD_CONFIRMATION_MESSAGES).toBeDefined();
    expect(PASSWORD_CONFIRMATION_MESSAGES).toHaveProperty('match');
    expect(PASSWORD_CONFIRMATION_MESSAGES).toHaveProperty('noMatch');
    expect(typeof PASSWORD_CONFIRMATION_MESSAGES.match).toBe('string');
  });
});
