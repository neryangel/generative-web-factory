import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { TenantProvider } from "@/hooks/useTenant";
import { AuthForm } from "@/components/auth/AuthForm";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { createQueryClient } from "@/lib/query-client";
import { useState } from "react";
import Index from "./views/Index";
import Dashboard from "./views/Dashboard";
import Sites from "./views/Sites";
import NewSite from "./views/NewSite";
import SiteEditor from "./views/SiteEditor";
import PublicSite from "./views/PublicSite";
import Settings from "./views/Settings";
import NotFound from "./views/NotFound";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

const App = () => {
  // Create QueryClient once per session (useState ensures stability across re-renders)
  const [queryClient] = useState(createQueryClient);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public site routes */}
                <Route path="/s/:slug" element={<PublicSite />} />
                <Route path="/s/:slug/:pageSlug" element={<PublicSite />} />

                {/* Dashboard routes */}
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/sites" element={<ProtectedRoute><Sites /></ProtectedRoute>} />
                <Route path="/dashboard/sites/new" element={<ProtectedRoute><NewSite /></ProtectedRoute>} />
                <Route path="/dashboard/sites/:siteId" element={<ProtectedRoute><SiteEditor /></ProtectedRoute>} />
                <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
