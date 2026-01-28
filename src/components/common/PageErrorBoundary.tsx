'use client';

import type { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PageErrorBoundaryProps {
  children: ReactNode;
  pageName?: string;
}

/**
 * Error boundary wrapper for page-level components
 * Provides a full-page error UI with navigation options
 */
export function PageErrorBoundary({ children, pageName }: PageErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
          <div className="text-center p-8 max-w-md">
            <div className="rounded-full bg-destructive/10 p-6 mb-6 inline-block">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-3">שגיאה בטעינת הדף</h1>
            <p className="text-muted-foreground mb-6">
              {pageName
                ? `אירעה שגיאה בטעינת ${pageName}. `
                : 'אירעה שגיאה בלתי צפויה. '}
              נסה לרענן את הדף או לחזור לדף הבית.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                רענן דף
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2">
                  <Home className="h-4 w-4" />
                  דף הבית
                </Button>
              </Link>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        // Log to monitoring service in production
        console.error(`[PageError${pageName ? ` - ${pageName}` : ''}]:`, error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
