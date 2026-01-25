import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  FileText,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Template = Tables<'templates'>;

type CreateMode = 'template' | 'ai';

export default function NewSite() {
  const navigate = useNavigate();
  const { currentTenant } = useTenant();
  const [mode, setMode] = useState<CreateMode | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  // Form fields
  const [siteName, setSiteName] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [brief, setBrief] = useState('');

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setTemplatesLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setSiteName(value);
    setSiteSlug(generateSlug(value));
  };

  const handleCreateFromTemplate = async () => {
    if (!currentTenant || !selectedTemplate || !siteName.trim() || !siteSlug.trim()) return;

    setLoading(true);
    try {
      // Create site
      const { data: site, error: siteError } = await supabase
        .from('sites')
        .insert({
          tenant_id: currentTenant.id,
          template_id: selectedTemplate.id,
          name: siteName.trim(),
          slug: siteSlug.trim(),
          status: 'draft',
          settings: (selectedTemplate.blueprint_schema as any)?.settings || {},
        })
        .select()
        .single();

      if (siteError) throw siteError;

      // Create default pages based on template
      const blueprintSchema = selectedTemplate.blueprint_schema as any;
      if (blueprintSchema?.pages) {
        for (let i = 0; i < blueprintSchema.pages.length; i++) {
          const pageBlueprint = blueprintSchema.pages[i];
          
          const { data: page, error: pageError } = await supabase
            .from('pages')
            .insert({
              site_id: site.id,
              tenant_id: currentTenant.id,
              slug: pageBlueprint.slug,
              title: pageBlueprint.title,
              sort_order: i,
              is_homepage: pageBlueprint.slug === 'home',
              seo: {},
            })
            .select()
            .single();

          if (pageError) throw pageError;

          // Create sections for each page
          if (pageBlueprint.sections && page) {
            for (let j = 0; j < pageBlueprint.sections.length; j++) {
              const sectionType = pageBlueprint.sections[j];
              
              // Get default content from section registry
              const { data: sectionDef } = await supabase
                .from('section_registry')
                .select('default_content')
                .eq('type', sectionType)
                .single();

              await supabase
                .from('sections')
                .insert({
                  page_id: page.id,
                  tenant_id: currentTenant.id,
                  type: sectionType,
                  variant: 'default',
                  content: sectionDef?.default_content || {},
                  sort_order: j,
                });
            }
          }
        }
      }

      toast.success('האתר נוצר בהצלחה!');
      navigate(`/dashboard/sites/${site.id}`);
    } catch (error: any) {
      console.error('Error creating site:', error);
      if (error.message?.includes('duplicate')) {
        toast.error('שם האתר כבר קיים, נסה שם אחר');
      } else {
        toast.error('שגיאה ביצירת האתר');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => mode ? setMode(null) : navigate('/dashboard/sites')}
          className="gap-2"
        >
          <ArrowRight className="h-4 w-4" />
          חזרה
        </Button>

        {/* Mode Selection */}
        {!mode && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">יצירת אתר חדש</h1>
              <p className="text-muted-foreground">בחר איך תרצה ליצור את האתר שלך</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary group"
                onClick={() => setMode('template')}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>התחל מתבנית</CardTitle>
                  <CardDescription>
                    בחר תבנית מוכנה והתאם אותה לצרכים שלך
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all hover:border-accent group opacity-60"
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Sparkles className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle>יצירה עם AI</CardTitle>
                  <CardDescription>
                    תאר את העסק שלך וה-AI יבנה אתר מותאם אישית
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-2">(בקרוב)</p>
                </CardHeader>
              </Card>
            </div>
          </>
        )}

        {/* Template Selection */}
        {mode === 'template' && !selectedTemplate && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">בחר תבנית</h1>
              <p className="text-muted-foreground">בחר את התבנית שהכי מתאימה לעסק שלך</p>
            </div>

            {templatesLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <div className="h-48 bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">אין תבניות זמינות כרגע</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-primary overflow-hidden"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <FileText className="h-16 w-16 text-primary/30" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                          {template.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Site Details Form */}
        {mode === 'template' && selectedTemplate && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">פרטי האתר</h1>
              <p className="text-muted-foreground">
                תבנית נבחרת: {selectedTemplate.name}
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">שם האתר</Label>
                  <Input
                    id="siteName"
                    placeholder="לדוגמה: המסעדה שלי"
                    value={siteName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteSlug">כתובת האתר (URL)</Label>
                  <div className="flex items-center gap-2" dir="ltr">
                    <Input
                      id="siteSlug"
                      placeholder="my-restaurant"
                      value={siteSlug}
                      onChange={(e) => setSiteSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="text-left"
                    />
                    <span className="text-muted-foreground text-sm whitespace-nowrap">.amdir.app</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleCreateFromTemplate}
                    disabled={loading || !siteName.trim() || !siteSlug.trim()}
                    className="flex-1"
                  >
                    {loading ? (
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                    צור אתר
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedTemplate(null)}
                  >
                    חזרה
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
