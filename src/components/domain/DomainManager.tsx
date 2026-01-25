import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTenant } from '@/hooks/useTenant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Globe, 
  Plus, 
  Loader2, 
  Check, 
  AlertCircle,
  RefreshCw,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Domain = Tables<'domains'>;

interface DomainManagerProps {
  siteId: string;
  siteSlug: string;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'ממתין לאימות', variant: 'secondary' },
  verifying: { label: 'מאמת...', variant: 'outline' },
  active: { label: 'פעיל', variant: 'default' },
  failed: { label: 'נכשל', variant: 'destructive' },
};

export function DomainManager({ siteId, siteSlug }: DomainManagerProps) {
  const { currentTenant } = useTenant();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);

  const fetchDomains = async () => {
    if (!currentTenant) return;
    
    try {
      const { data, error } = await supabase
        .from('domains')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDomains(data || []);
    } catch (error) {
      console.error('Error fetching domains:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, [siteId, currentTenant]);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim() || !currentTenant) return;

    // Validate domain format
    const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain.trim())) {
      toast.error('פורמט דומיין לא תקין');
      return;
    }

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('domains')
        .insert({
          site_id: siteId,
          tenant_id: currentTenant.id,
          domain: newDomain.trim().toLowerCase(),
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        if (error.message?.includes('duplicate')) {
          toast.error('הדומיין כבר קיים במערכת');
        } else {
          throw error;
        }
        return;
      }

      toast.success('הדומיין נוסף בהצלחה');
      setAddDialogOpen(false);
      setNewDomain('');
      await fetchDomains();
    } catch (error: any) {
      console.error('Error adding domain:', error);
      toast.error('שגיאה בהוספת הדומיין');
    } finally {
      setAdding(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    setVerifying(domainId);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        toast.error('יש להתחבר מחדש');
        return;
      }

      const response = await supabase.functions.invoke('verify-domain', {
        body: { domainId },
      });

      if (response.error) throw response.error;

      const result = response.data;
      
      if (result.verified) {
        toast.success('הדומיין אומת בהצלחה!');
      } else {
        toast.info('ה-DNS עדיין לא מוגדר כראוי. נסה שוב בעוד מספר דקות.');
      }

      await fetchDomains();
    } catch (error: any) {
      console.error('Error verifying domain:', error);
      toast.error('שגיאה באימות הדומיין');
    } finally {
      setVerifying(null);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('האם למחוק את הדומיין?')) return;

    try {
      const { error } = await supabase
        .from('domains')
        .delete()
        .eq('id', domainId);

      if (error) throw error;

      toast.success('הדומיין נמחק');
      await fetchDomains();
    } catch (error) {
      console.error('Error deleting domain:', error);
      toast.error('שגיאה במחיקת הדומיין');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('הועתק ללוח');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Default Domain */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            דומיין ברירת מחדל
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {siteSlug}.amdir.app
              </code>
              <Badge variant="default">פעיל</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`https://${siteSlug}.amdir.app`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Domains */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">דומיינים מותאמים אישית</CardTitle>
              <CardDescription>
                חבר דומיין משלך לאתר
              </CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  הוסף דומיין
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle>הוספת דומיין מותאם אישית</DialogTitle>
                  <DialogDescription>
                    הזן את הדומיין שברצונך לחבר לאתר
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddDomain} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">דומיין</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      dir="ltr"
                      className="text-left"
                    />
                    <p className="text-xs text-muted-foreground">
                      הזן את הדומיין ללא www או https://
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={adding} className="flex-1">
                      {adding && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      הוסף
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAddDialogOpen(false)}
                    >
                      ביטול
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {domains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>אין דומיינים מותאמים אישית</p>
              <p className="text-sm">הוסף דומיין כדי להתחיל</p>
            </div>
          ) : (
            <div className="space-y-4">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {domain.domain}
                      </code>
                      <Badge variant={statusLabels[domain.status || 'pending'].variant}>
                        {statusLabels[domain.status || 'pending'].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {domain.status !== 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerifyDomain(domain.id)}
                          disabled={verifying === domain.id}
                        >
                          {verifying === domain.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          <span className="mr-2">אמת</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDomain(domain.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  {/* DNS Instructions */}
                  {domain.status !== 'active' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>הגדרות DNS נדרשות</AlertTitle>
                      <AlertDescription className="mt-3">
                        <p className="mb-3">
                          הוסף את הרשומות הבאות בהגדרות ה-DNS של הדומיין שלך:
                        </p>
                        <div className="space-y-2 font-mono text-xs bg-muted p-3 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span>
                              <strong>Type:</strong> A | <strong>Name:</strong> @ | <strong>Value:</strong> 185.158.133.1
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard('185.158.133.1')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>
                              <strong>Type:</strong> A | <strong>Name:</strong> www | <strong>Value:</strong> 185.158.133.1
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard('185.158.133.1')}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          שינויי DNS עשויים לקחת עד 48 שעות להתפשט
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {domain.status === 'active' && (
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Check className="h-4 w-4" />
                      הדומיין מחובר ופעיל
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
