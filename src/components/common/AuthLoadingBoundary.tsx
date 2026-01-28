'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthLoadingBoundaryProps {
  children: ReactNode;
  /**
   * Optional custom loading component
   */
  loadingFallback?: ReactNode;
}

/**
 * Prevents content flash during initial authentication check
 * Shows a loading spinner until auth state is determined
 */
export function AuthLoadingBoundary({
  children,
  loadingFallback
}: AuthLoadingBoundaryProps) {
  const { loading } = useAuth();

  if (loading) {
    return loadingFallback ?? (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
