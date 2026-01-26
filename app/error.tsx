'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            משהו השתבש
          </h1>
          <p className="text-muted-foreground">
            אירעה שגיאה בלתי צפויה. אנא נסה שוב או צור קשר עם התמיכה אם הבעיה נמשכת.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-muted rounded-lg p-4 text-start">
            <p className="text-sm font-mono text-destructive break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            <RefreshCw className="h-4 w-4 ml-2" />
            נסה שוב
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            חזור לדף הבית
          </Button>
        </div>
      </div>
    </div>
  );
}
