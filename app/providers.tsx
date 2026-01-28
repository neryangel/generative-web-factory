'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { toast, Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AccessibilityWidget } from '@/components/accessibility';
import { AuthProvider } from '@/hooks/useAuth';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AuthLoadingBoundary } from '@/components/common/AuthLoadingBoundary';
import { useState } from 'react';
import { createQueryClient } from '@/lib/query-client';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient once per session (useState ensures stability across re-renders)
  const [queryClient] = useState(createQueryClient);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthLoadingBoundary>
              <TooltipProvider>
                <Toaster />
                {children}
                <AccessibilityWidget onToast={(title, desc) => toast(title, { description: desc })} />
              </TooltipProvider>
            </AuthLoadingBoundary>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
