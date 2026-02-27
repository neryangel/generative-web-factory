import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from './auth-errors';

describe('getAuthErrorMessage', () => {
  it('should return Hebrew message for "Invalid login credentials"', () => {
    const error = new Error('Invalid login credentials');
    expect(getAuthErrorMessage(error, 'fallback')).toBe('אימייל או סיסמה שגויים');
  });

  it('should return Hebrew message for "Email not confirmed"', () => {
    const error = new Error('Email not confirmed');
    expect(getAuthErrorMessage(error, 'fallback')).toBe('יש לאשר את כתובת האימייל לפני ההתחברות');
  });

  it('should return Hebrew message for "User already registered"', () => {
    const error = new Error('User already registered');
    expect(getAuthErrorMessage(error, 'fallback')).toBe('כתובת האימייל כבר רשומה במערכת');
  });

  it('should return Hebrew message for "Password should be at least 6 characters"', () => {
    const error = new Error('Password should be at least 6 characters');
    expect(getAuthErrorMessage(error, 'fallback')).toBe('הסיסמה חייבת להכיל לפחות 6 תווים');
  });

  it('should return Hebrew message for "Signup requires a valid password"', () => {
    const error = new Error('Signup requires a valid password');
    expect(getAuthErrorMessage(error, 'fallback')).toBe('יש להזין סיסמה תקינה');
  });

  it('should return Hebrew message for invalid email format', () => {
    const error = new Error('Unable to validate email address: invalid format');
    expect(getAuthErrorMessage(error, 'fallback')).toBe('כתובת האימייל אינה תקינה');
  });

  it('should return Hebrew message for rate limit error', () => {
    const error = new Error('For security purposes, you can only request this once every 60 seconds');
    expect(getAuthErrorMessage(error, 'fallback')).toBe('מטעמי אבטחה, ניתן לנסות שוב בעוד 60 שניות');
  });

  it('should return fallback for unknown error messages', () => {
    const error = new Error('Some unknown error from Supabase');
    expect(getAuthErrorMessage(error, 'שגיאה כללית')).toBe('שגיאה כללית');
  });

  it('should return fallback when error is null', () => {
    expect(getAuthErrorMessage(null, 'שגיאה כללית')).toBe('שגיאה כללית');
  });

  it('should return fallback when error has no message', () => {
    const error = new Error();
    error.message = '';
    expect(getAuthErrorMessage(error, 'שגיאה כללית')).toBe('שגיאה כללית');
  });
});
