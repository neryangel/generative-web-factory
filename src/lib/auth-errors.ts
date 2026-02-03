/**
 * Map Supabase auth error messages to user-friendly Hebrew messages.
 * Only handles auth-specific errors; for API errors use api-error.ts.
 */
const AUTH_ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'אימייל או סיסמה שגויים',
  'Email not confirmed': 'יש לאשר את כתובת האימייל לפני ההתחברות',
  'User already registered': 'כתובת האימייל כבר רשומה במערכת',
  'Password should be at least 6 characters': 'הסיסמה חייבת להכיל לפחות 6 תווים',
  'Signup requires a valid password': 'יש להזין סיסמה תקינה',
  'Unable to validate email address: invalid format': 'כתובת האימייל אינה תקינה',
  'For security purposes, you can only request this once every 60 seconds': 'מטעמי אבטחה, ניתן לנסות שוב בעוד 60 שניות',
  'For security purposes, you can only request this after 60 seconds': 'מטעמי אבטחה, ניתן לנסות שוב בעוד 60 שניות',
  'User not found': 'לא נמצא משתמש עם כתובת אימייל זו',
};

export function getAuthErrorMessage(error: Error | null, fallback: string): string {
  if (!error?.message) return fallback;
  return AUTH_ERROR_MAP[error.message] ?? fallback;
}
