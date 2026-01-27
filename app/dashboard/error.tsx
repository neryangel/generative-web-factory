'use client';

import { useEffect } from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[DashboardError]:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
      <div className="text-center p-8 max-w-md">
        <div className="rounded-full bg-destructive/10 p-6 mb-6 inline-block">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-3">שגיאה בלוח הבקרה</h1>
        <p className="text-muted-foreground mb-6">
          אירעה שגיאה בטעינת לוח הבקרה. נסה לרענן את הדף או לחזור לדף הבית.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            נסה שוב
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              דף הבית
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
