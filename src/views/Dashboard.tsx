'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTenant } from '@/hooks/useTenant';
import { useSites } from '@/hooks/queries/useSites';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CreateTenantDialog } from '@/components/tenant/CreateTenantDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Building2,
  Eye,
  FileText,
  Globe,
  Plus,
} from 'lucide-react';

export default function Dashboard() {
  const { currentTenant, tenants, loading: tenantLoading } = useTenant();

  // Use React Query hook with proper API layer (includes Zod validation)
  const { data: allSites = [], isLoading: loading } = useSites(currentTenant?.id);

  // Get only the 5 most recent sites for dashboard display
  const sites = allSites.slice(0, 5);

  // No tenant - show onboarding
  if (!tenantLoading && tenants.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 glow"
               style={{ background: 'var(--gradient-primary)' }}>
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-3">ברוכים הבאים ל-AMDIR!</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            צור את הארגון הראשון שלך כדי להתחיל לבנות אתרים מדהימים
          </p>
          <CreateTenantDialog>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              צור ארגון ראשון
            </Button>
          </CreateTenantDialog>
        </div>
      </DashboardLayout>
    );
  }

  // Stats use allSites for accurate counts
  const stats = useMemo(() => [
    {
      label: 'סה"כ אתרים',
      value: allSites.length,
      icon: Globe,
      color: 'text-primary'
    },
    {
      label: 'אתרים פעילים',
      value: allSites.filter(s => s.status === 'published').length,
      icon: Eye,
      color: 'text-success'
    },
    {
      label: 'טיוטות',
      value: allSites.filter(s => s.status === 'draft').length,
      icon: FileText,
      color: 'text-warning'
    },
  ], [allSites]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              שלום, {currentTenant?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              הנה מה שקורה בארגון שלך
            </p>
          </div>
          <Link href="/dashboard/sites/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              אתר חדש
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Sites */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>אתרים אחרונים</CardTitle>
              <CardDescription>האתרים שעודכנו לאחרונה</CardDescription>
            </div>
            <Link href="/dashboard/sites">
              <Button variant="ghost" size="sm" className="gap-1">
                הצג הכל
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : sites.length === 0 ? (
              <div className="text-center py-12">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">אין אתרים עדיין</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  צור את האתר הראשון שלך עכשיו
                </p>
                <Link href="/dashboard/sites/new">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    צור אתר
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {sites.map((site) => (
                  <Link
                    key={site.id}
                    href={`/dashboard/sites/${site.id}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{site.name}</h4>
                        <p className="text-sm text-muted-foreground">{site.slug}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      site.status === 'published' ? 'status-published' :
                      site.status === 'draft' ? 'status-draft' : 'status-archived'
                    }`}>
                      {site.status === 'published' ? 'פורסם' :
                       site.status === 'draft' ? 'טיוטה' : 'בארכיון'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
