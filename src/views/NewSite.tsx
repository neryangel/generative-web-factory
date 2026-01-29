'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/hooks/useTenant';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplatePreviewDialog } from '@/components/templates/TemplatePreviewDialog';
import { type TemplateCategory, TemplateCategoryFilter } from '@/components/templates/TemplateCategoryFilter';
import { 
  AlertCircle, 
  ArrowRight, 
  Check, 
  FileText,
  Loader2,
  Sparkles,
  Wand2
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isReservedSlug } from '@/lib/validation-patterns';
import type { Tables } from '@/integrations/supabase/types';
import type { BlueprintPage, BlueprintSchema } from '@/types/site.types';

type Template = Tables<'templates'>;

type CreateMode = 'template' | 'ai';

interface AIBlueprint {
  siteName: string;
  settings?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    direction?: string;
  };
  pages: {
    slug: string;
    title: string;
    isHomepage?: boolean;
    sections: {
      type: string;
      content: Record<string, unknown>;
    }[];
  }[];
}

export default function NewSite() {
  const router = useRouter();
  const { currentTenant, loading: tenantLoading } = useTenant();
  const [mode, setMode] = useState<CreateMode | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatedBlueprint, setGeneratedBlueprint] = useState<AIBlueprint | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');

  // Form fields
  const [siteName, setSiteName] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [brief, setBrief] = useState('');
  const aiAbortRef = useRef<AbortController | null>(null);

  // Cleanup AI fetch on unmount
  useEffect(() => {
    return () => {
      aiAbortRef.current?.abort();
    };
  }, []);

  // IMPORTANT: All hooks must be called before any conditional returns
  // This is a React rule - hooks cannot be called conditionally
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

    void fetchTemplates();
  }, []);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    return templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [templates]);

  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'all') return templates;
    return templates.filter(t => t.category === selectedCategory);
  }, [templates, selectedCategory]);

  // Show loading while tenant is being fetched
  if (tenantLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if no tenant exists
  if (!currentTenant) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">לא נמצא ארגון</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            כדי ליצור אתר, יש צורך בארגון פעיל. נסה לרענן את הדף או צור קשר עם התמיכה.
          </p>
          <Button onClick={() => window.location.reload()}>
            רענן את הדף
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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

  const handleGenerateWithAI = async () => {
    if (!brief.trim() || brief.trim().length < 10) {
      toast.error('נא לספק תיאור מפורט יותר (לפחות 10 תווים)');
      return;
    }

    setAiGenerating(true);
    setAiError(null);
    setGeneratedBlueprint(null);

    // Cancel any previous in-flight request
    aiAbortRef.current?.abort();
    const abortController = new AbortController();
    aiAbortRef.current = abortController;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration is missing');
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/generate-site`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ brief: brief.trim() }),
          signal: abortController.signal,
        }
      );

      const data: unknown = await response.json();

      if (!response.ok) {
        const errorData = data as { error?: string };
        throw new Error(errorData.error || 'שגיאה ביצירת האתר');
      }

      const responseData = data as { blueprint?: AIBlueprint };
      if (!responseData.blueprint) {
        throw new Error('לא התקבל מבנה אתר תקין');
      }

      setGeneratedBlueprint(responseData.blueprint);

      // Auto-fill site name from blueprint
      if (responseData.blueprint.siteName) {
        setSiteName(responseData.blueprint.siteName);
        setSiteSlug(generateSlug(responseData.blueprint.siteName));
      }

      toast.success('מבנה האתר נוצר בהצלחה!');
    } catch (error) {
      // Ignore abort errors (user navigated away or re-triggered)
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('AI generation error:', error);
      const message = error instanceof Error ? error.message : 'שגיאה ביצירת האתר';
      setAiError(message);
      toast.error(message);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreateFromAI = async () => {
    if (!currentTenant || !generatedBlueprint || !siteName.trim() || !siteSlug.trim()) return;

    if (isReservedSlug(siteSlug)) {
      toast.error('שם הכתובת שמור למערכת. נא לבחור שם אחר.');
      return;
    }

    setLoading(true);
    try {
      // Create site
      const { data: site, error: siteError } = await supabase
        .from('sites')
        .insert({
          tenant_id: currentTenant.id,
          name: siteName.trim(),
          slug: siteSlug.trim(),
          status: 'draft',
          settings: generatedBlueprint.settings || {},
        })
        .select()
        .single();

      if (siteError) throw siteError;

      // Create pages and sections from blueprint
      for (let i = 0; i < generatedBlueprint.pages.length; i++) {
        const pageBlueprint = generatedBlueprint.pages[i];
        
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .insert({
            site_id: site.id,
            tenant_id: currentTenant.id,
            slug: pageBlueprint.slug,
            title: pageBlueprint.title,
            sort_order: i,
            is_homepage: pageBlueprint.isHomepage || pageBlueprint.slug === 'home',
            seo: {},
          })
          .select()
          .single();

        if (pageError) throw pageError;

        // Create sections
        if (pageBlueprint.sections && page) {
          const sectionsToInsert = pageBlueprint.sections.map((sectionBlueprint, j) => ({
            page_id: page.id,
            tenant_id: currentTenant.id,
            type: sectionBlueprint.type,
            variant: 'default',
            content: JSON.parse(JSON.stringify(sectionBlueprint.content || {})) as Record<string, unknown>,
            sort_order: j,
          }));

          const { error: sectionsError } = await supabase
            .from('sections')
            .insert(sectionsToInsert);

          if (sectionsError) {
            console.error('Error creating sections:', sectionsError);
          }
        }
      }

      toast.success('האתר נוצר בהצלחה!');
      router.push(`/dashboard/sites/${site.id}`);
    } catch (error) {
      console.error('Error creating site:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('duplicate')) {
        toast.error('שם האתר כבר קיים, נסה שם אחר');
      } else {
        toast.error('שגיאה ביצירת האתר');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = async () => {
    if (!currentTenant || !selectedTemplate || !siteName.trim() || !siteSlug.trim()) return;

    if (isReservedSlug(siteSlug)) {
      toast.error('שם הכתובת שמור למערכת. נא לבחור שם אחר.');
      return;
    }

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
          settings: (selectedTemplate.blueprint_schema as BlueprintSchema)?.settings || {},
        })
        .select()
        .single();

      if (siteError) throw siteError;

      // Create default pages based on template
      const blueprintSchema = selectedTemplate.blueprint_schema as BlueprintSchema;
      if (blueprintSchema?.pages) {
        for (let i = 0; i < blueprintSchema.pages.length; i++) {
          const pageBlueprint: BlueprintPage = blueprintSchema.pages[i];
          
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
              const sectionBlueprint = pageBlueprint.sections[j];

              // Support both old format (string) and new format (object with type, variant, and content)
              const isNewFormat = typeof sectionBlueprint === 'object' && 'type' in sectionBlueprint;
              const sectionType = isNewFormat ? sectionBlueprint.type : sectionBlueprint;
              const sectionVariant = isNewFormat ? (sectionBlueprint.variant || 'default') : 'default';
              const blueprintContent = isNewFormat ? sectionBlueprint.content : null;

              // If blueprint has content, use it; otherwise get default from registry
              let sectionContent: Record<string, unknown> = blueprintContent || {};
              if (!blueprintContent) {
                const { data: sectionDef } = await supabase
                  .from('section_registry')
                  .select('default_content')
                  .eq('type', sectionType)
                  .maybeSingle();
                sectionContent = (sectionDef?.default_content as Record<string, unknown>) || {};
              }

              await supabase
                .from('sections')
                .insert({
                  page_id: page.id,
                  tenant_id: currentTenant.id,
                  type: String(sectionType),
                  variant: sectionVariant,
                  content: sectionContent,
                  sort_order: j,
                });
            }
          }
        }
      }

      toast.success('האתר נוצר בהצלחה!');
      router.push(`/dashboard/sites/${site.id}`);
    } catch (error) {
      console.error('Error creating site:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('duplicate')) {
        toast.error('שם האתר כבר קיים, נסה שם אחר');
      } else {
        toast.error('שגיאה ביצירת האתר');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetAIMode = () => {
    setGeneratedBlueprint(null);
    setAiError(null);
    setSiteName('');
    setSiteSlug('');
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewTemplate(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => {
            if (mode === 'ai' && generatedBlueprint) {
              resetAIMode();
            } else if (mode === 'template' && selectedTemplate) {
              setSelectedTemplate(null);
            } else if (mode) {
              setMode(null);
              resetAIMode();
              setSelectedTemplate(null);
            } else {
              router.push('/dashboard/sites');
            }
          }}
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
                className="cursor-pointer hover:shadow-lg transition-all hover:border-accent group"
                onClick={() => setMode('ai')}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Sparkles className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle>יצירה עם AI</CardTitle>
                  <CardDescription>
                    תאר את העסק שלך וה-AI יבנה אתר מותאם אישית
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </>
        )}

        {/* AI Mode - Brief Input */}
        {mode === 'ai' && !generatedBlueprint && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">תאר את העסק שלך</h1>
              <p className="text-muted-foreground">ה-AI יבנה אתר מותאם אישית על בסיס התיאור שלך</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brief">תיאור העסק</Label>
                  <Textarea
                    id="brief"
                    placeholder="לדוגמה: מסעדה איטלקית משפחתית בתל אביב, מתמחה בפסטה טרייה ופיצות מעץ. אווירה חמימה ואינטימית, מתאימה לזוגות ומשפחות..."
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    className="min-h-[150px] text-right"
                    dir="rtl"
                  />
                  <p className="text-xs text-muted-foreground">
                    ככל שתספק יותר פרטים, האתר יהיה מותאם יותר לעסק שלך
                  </p>
                </div>

                {aiError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{aiError}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleGenerateWithAI}
                  disabled={aiGenerating || brief.trim().length < 10}
                  className="w-full"
                  size="lg"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      יוצר את האתר...
                    </>
                  ) : (
                    <>
                      <Wand2 className="ml-2 h-5 w-5" />
                      צור אתר עם AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* AI Mode - Blueprint Generated */}
        {mode === 'ai' && generatedBlueprint && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">האתר מוכן! 🎉</h1>
              <p className="text-muted-foreground">
                נוצרו {generatedBlueprint.pages.length} עמודים עם{' '}
                {generatedBlueprint.pages.reduce((acc, p) => acc + (p.sections?.length || 0), 0)} סקשנים
              </p>
            </div>

            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">סיכום האתר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generatedBlueprint.pages.map((page, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{page.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {page.sections?.length || 0} סקשנים: {page.sections?.map(s => s.type).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

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
                    onClick={handleCreateFromAI}
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
                    onClick={resetAIMode}
                  >
                    התחל מחדש
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Template Selection */}
        {mode === 'template' && !selectedTemplate && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">בחר תבנית</h1>
              <p className="text-muted-foreground">בחר את התבנית שהכי מתאימה לעסק שלך</p>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <TemplateCategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                categoryCounts={categoryCounts}
              />
            </div>

            {templatesLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {selectedCategory === 'all' 
                    ? 'אין תבניות זמינות כרגע' 
                    : 'אין תבניות בקטגוריה זו'}
                </p>
                {selectedCategory !== 'all' && (
                  <Button 
                    variant="link" 
                    onClick={() => setSelectedCategory('all')}
                    className="mt-2"
                  >
                    הצג את כל התבניות
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelectTemplate}
                    onPreview={setPreviewTemplate}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Site Details Form - Template */}
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

      {/* Template Preview Dialog */}
      <TemplatePreviewDialog
        template={previewTemplate}
        open={!!previewTemplate}
        onOpenChange={(open) => !open && setPreviewTemplate(null)}
        onSelect={handleSelectTemplate}
      />
    </DashboardLayout>
  );
}
