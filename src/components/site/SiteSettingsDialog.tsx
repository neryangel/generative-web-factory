import { useState } from 'react';
import { DomainManager } from '@/components/domain/DomainManager';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Settings2, Globe, Palette, Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Site = Tables<'sites'>;

interface SiteSettingsDialogProps {
  site: Site;
  onUpdate: (site: Site) => void;
  children?: React.ReactNode;
}

export function SiteSettingsDialog({ site, onUpdate, children }: SiteSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(site.name);
  const [settings, setSettings] = useState<Record<string, unknown>>(
    (site.settings as Record<string, unknown>) || {}
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('sites')
        .update({ 
          name, 
          settings: JSON.parse(JSON.stringify(settings))
        })
        .eq('id', site.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      toast.success('ההגדרות נשמרו');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('שגיאה בשמירת ההגדרות');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>הגדרות אתר</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" dir="rtl" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="gap-2">
              <Settings2 className="h-4 w-4" />
              כללי
            </TabsTrigger>
            <TabsTrigger value="domains" className="gap-2">
              <Globe className="h-4 w-4" />
              דומיינים
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="h-4 w-4" />
              מיתוג
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">שם האתר</Label>
              <Input
                id="siteName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="שם האתר"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">כתובת</Label>
              <div className="flex items-center gap-2" dir="ltr">
                <Input
                  id="slug"
                  value={site.slug}
                  disabled
                  className="bg-muted text-left"
                />
                <span className="text-muted-foreground text-sm">.amdir.app</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור</Label>
              <Textarea
                id="description"
                value={(settings.description as string) || ''}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder="תיאור קצר של האתר"
                rows={3}
              />
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              שמור שינויים
            </Button>
          </TabsContent>

          <TabsContent value="domains" className="mt-4">
            <DomainManager siteId={site.id} siteSlug={site.slug} />
          </TabsContent>

          <TabsContent value="branding" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">צבע ראשי</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={(settings.primaryColor as string) || '#6366f1'}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={(settings.primaryColor as string) || '#6366f1'}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                  placeholder="#6366f1"
                  dir="ltr"
                  className="flex-1 text-left"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">פונט</Label>
              <select
                id="fontFamily"
                value={(settings.fontFamily as string) || 'heebo'}
                onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="heebo">Heebo</option>
                <option value="assistant">Assistant</option>
                <option value="rubik">Rubik</option>
                <option value="open-sans">Open Sans</option>
              </select>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              שמור שינויים
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
