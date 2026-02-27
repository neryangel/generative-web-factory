'use client';

import { useAuth } from '@/hooks/useAuth';
import { TenantProvider } from '@/hooks/useTenant';
import { AuthForm } from '@/components/auth/AuthForm';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

export function DashboardContent({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <TenantProvider>{children}</TenantProvider>;
}
