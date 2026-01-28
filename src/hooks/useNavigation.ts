'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { routes } from '@/lib/navigation';

/**
 * Navigation hook that provides Next.js App Router navigation
 * Drop-in replacement for react-router-dom navigation hooks
 */
export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router]
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    navigate,
    goBack,
    pathname,
    params,
    searchParams,
    routes,
  };
}

/**
 * Hook to get current route params
 * Compatible API with react-router-dom useParams
 */
export function useRouteParams<T extends Record<string, string> = Record<string, string>>(): T {
  const params = useParams();
  return params as T;
}

/**
 * Hook to get current pathname
 * Compatible API with react-router-dom useLocation
 */
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return {
    pathname,
    search: searchParams.toString() ? `?${searchParams.toString()}` : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
  };
}
