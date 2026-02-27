import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Building2, Loader2, Eye, EyeOff } from 'lucide-react';
import { getAuthErrorMessage } from '@/lib/auth-errors';
import { supabase } from '@/integrations/supabase/client';

type Mode = 'signin' | 'signup';

export function AuthForm() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(getAuthErrorMessage(error, 'שגיאה בהתחברות'));
        } else {
          toast.success('התחברת בהצלחה!');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(getAuthErrorMessage(error, 'שגיאה בהרשמה'));
        } else {
          toast.success('נרשמת בהצלחה!');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error('יש להזין כתובת אימייל תחילה');
      return;
    }

    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/reset-password`,
      });

      if (error) {
        toast.error(getAuthErrorMessage(error, 'שגיאה בשליחת קישור לאיפוס'));
      } else {
        toast.success('נשלח קישור לאיפוס סיסמה לכתובת האימייל');
      }
    } catch {
      toast.error('שגיאה בשליחת קישור לאיפוס');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30" 
             style={{ background: 'var(--gradient-glow)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-20" 
             style={{ background: 'var(--gradient-glow)' }} />
      </div>
      
      <Card className="w-full max-w-md glass animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center glow"
               style={{ background: 'var(--gradient-primary)' }}>
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              {mode === 'signin' ? 'התחברות' : 'הרשמה'}
            </CardTitle>
            <CardDescription className="mt-2">
              {mode === 'signin' 
                ? 'התחבר לחשבון שלך כדי להמשיך' 
                : 'צור חשבון חדש כדי להתחיל'}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">שם מלא</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="ישראל ישראלי"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  className="text-right"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                dir="ltr"
                className="text-left"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">סיסמה</Label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline"
                  >
                    שכחתי סיסמה
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signup' ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  dir="ltr"
                  className="text-left pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
              {mode === 'signin' ? 'התחבר' : 'הירשם'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {mode === 'signin' ? 'אין לך חשבון?' : 'כבר יש לך חשבון?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-primary hover:underline font-medium"
            >
              {mode === 'signin' ? 'הירשם עכשיו' : 'התחבר'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
