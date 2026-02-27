'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useTenant } from '@/hooks/useTenant';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ExternalLink,
  Eye,
  Globe,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Site = Tables<'sites'>;

export default function Sites() {
  const { currentTenant } = useTenant();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchSites() {
      if (!currentTenant) {
        setSites([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('sites')
          .select('*')
          .eq('tenant_id', currentTenant.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setSites(data || []);
      } catch (error) {
        console.error('Error fetching sites:', error);
        toast.error('שגיאה בטעינת האתרים');
      } finally {
        setLoading(false);
      }
    }

    void fetchSites();
  }, [currentTenant]);

  const filteredSites = useMemo(() => sites.filter(site =>
    site.name.toLowerCase().includes(search.toLowerCase()) ||
    site.slug.toLowerCase().includes(search.toLowerCase())
  ), [sites, search]);

  const handleDelete = async (siteId: string) => {
    if (!currentTenant) return;
    if (!confirm('האם אתה בטוח שברצונך למחוק את האתר?')) return;

    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId)
        .eq('tenant_id', currentTenant.id);

      if (error) throw error;

      setSites(sites.filter(s => s.id !== siteId));
      toast.success('האתר נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting site:', error);
      toast.error('שגיאה במחיקת האתר');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">האתרים שלי</h1>
            <p className="text-muted-foreground mt-1">
              נהל את כל האתרים שלך במקום אחד
            </p>
          </div>
          <Link href="/dashboard/sites/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              אתר חדש
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חפש אתרים..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
            aria-label="חיפוש אתרים"
          />
        </div>

        {/* Sites Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-40 bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {search ? 'לא נמצאו תוצאות' : 'אין אתרים עדיין'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {search
                ? 'נסה לחפש עם מילות מפתח אחרות'
                : 'צור את האתר הראשון שלך עכשיו ותתחיל לבנות נוכחות דיגיטלית'}
            </p>
            {!search && (
              <Link href="/dashboard/sites/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  צור אתר ראשון
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSites.map((site) => (
              <Card key={site.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                {/* Preview Image */}
                <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="h-12 w-12 text-primary/30" />
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link href={`/dashboard/sites/${site.id}`}>
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Pencil className="h-3 w-3" />
                        עריכה
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="h-3 w-3" />
                      תצוגה מקדימה
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{site.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {site.slug}.amdir.app
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${
                        site.status === 'published' ? 'status-published' :
                        site.status === 'draft' ? 'status-draft' : 'status-archived'
                      }`}>
                        {site.status === 'published' ? 'פורסם' :
                         site.status === 'draft' ? 'טיוטה' : 'בארכיון'}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="אפשרויות נוספות">
                            <MoreVertical aria-hidden="true" className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/sites/${site.id}`} className="gap-2">
                              <Pencil className="h-4 w-4" />
                              ערוך
                            </Link>
                          </DropdownMenuItem>
                          {site.status === 'published' && (
                            <DropdownMenuItem className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              פתח באתר
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="gap-2 text-destructive"
                            onClick={() => handleDelete(site.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            מחק
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
