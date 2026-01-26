'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Toaster as ToasterUI } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/hooks/useAuth';
import { useState } from 'react';

/**
 * Create QueryClient with optimized defaults for SaaS application
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data remains fresh for 1 minute before refetching
        staleTime: 60 * 1000,
        // Cache data for 5 minutes after becoming unused
        gcTime: 5 * 60 * 1000,
        // Retry logic with backoff
        retry: (failureCount, error) => {
          // Don't retry on authentication errors
          if (error && typeof error === 'object' && 'code' in error) {
            const code = (error as { code: string }).code;
            // Supabase auth errors
            if (code === 'PGRST301' || code === '401' || code === 'unauthorized') {
              return false;
            }
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus in production (can be noisy)
        refetchOnWindowFocus: process.env.NODE_ENV === 'development',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
      },
    },
  });
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient once per session (useState ensures stability across re-renders)
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <ToasterUI />
          {children}
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
