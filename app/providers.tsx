'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState } from 'react';

// Configure QueryClient with production-ready defaults
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
        // Cache data for 30 minutes
        gcTime: 1000 * 60 * 30,
        // Retry failed requests twice
        retry: 2,
        // Don't refetch on window focus in production-like behavior
        refetchOnWindowFocus: false,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
      },
    },
  });

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
}
