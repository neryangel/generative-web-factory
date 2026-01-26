'use client';

import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { TenantProvider } from '@/hooks/useTenant';
import { AuthForm } from '@/components/auth/AuthForm';
import { Loader2 } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

function DashboardContent({ children }: { children: ReactNode }) {
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

// Client-only wrapper to avoid hydration issues with BrowserRouter
function ClientOnlyRouter({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <BrowserRouter>{children}</BrowserRouter>;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ClientOnlyRouter>
      <AuthProvider>
        <DashboardContent>{children}</DashboardContent>
      </AuthProvider>
    </ClientOnlyRouter>
  );
}
