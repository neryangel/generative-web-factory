import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';
import { useAutoSave } from '@/hooks/useAutoSave';
import { supabase } from '@/integrations/supabase/client';
import { SectionRenderer, SectionContent } from '@/components/editor/SectionRenderer';
import { SiteSettingsDialog } from '@/components/site/SiteSettingsDialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  ArrowRight, 
  Eye, 
  EyeOff,
  Save,
  Loader2,
  Check,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Undo2,
  Redo2,
  Settings2,
  GripVertical,
  Plus,
  Trash2,
  Upload,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Site = Tables<'sites'>;
type Page = Tables<'pages'>;
type Section = Tables<'sections'>;

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export default function SiteEditor() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { currentTenant } = useTenant();
  
  const [site, setSite] = useState<Site | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [loading, setLoading] = useState(true);
  
  const { isSaving, lastSaved, saveSection, flushSave } = useAutoSave({
    debounceMs: 1500,
  });

  // Fetch site data
  useEffect(() => {
    async function fetchData() {
      if (!siteId || !currentTenant) return;

      try {
        // Fetch site
        const { data: siteData, error: siteError } = await supabase
          .from('sites')
          .select('*')
          .eq('id', siteId)
          .eq('tenant_id', currentTenant.id)
          .maybeSingle();

        if (siteError) throw siteError;
        if (!siteData) {
          toast.error('האתר לא נמצא');
          navigate('/dashboard/sites');
          return;
        }
        setSite(siteData);

        // Fetch pages
        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*')
          .eq('site_id', siteId)
          .order('sort_order');

        if (pagesError) throw pagesError;
        setPages(pagesData || []);
        
        // Set first page as current
        if (pagesData && pagesData.length > 0) {
          const homepage = pagesData.find(p => p.is_homepage) || pagesData[0];
          setCurrentPage(homepage);
        }
      } catch (error) {
        console.error('Error fetching site:', error);
        toast.error('שגיאה בטעינת האתר');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [siteId, currentTenant, navigate]);

  // Fetch sections when page changes
  useEffect(() => {
    async function fetchSections() {
      if (!currentPage) {
        setSections([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('sections')
          .select('*')
          .eq('page_id', currentPage.id)
          .order('sort_order');

        if (error) throw error;
        setSections(data || []);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    }

    fetchSections();
  }, [currentPage]);

  const handleContentChange = useCallback((sectionId: string, content: SectionContent) => {
    // Update local state immediately
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, content: content as Section['content'] } : s
    ));
    
    // Queue auto-save
    saveSection(sectionId, content);
  }, [saveSection]);

  const handlePublish = async () => {
    if (!site || !currentTenant) return;

    try {
      // Get current max version
      const { data: lastPublish } = await supabase
        .from('publishes')
        .select('version')
        .eq('site_id', site.id)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newVersion = (lastPublish?.version || 0) + 1;

      // Get all pages and sections for snapshot
      const { data: allPages } = await supabase
        .from('pages')
        .select('*')
        .eq('site_id', site.id);

      const { data: allSections } = await supabase
        .from('sections')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .in('page_id', (allPages || []).map(p => p.id));

      // Build snapshot with proper structure for public runtime
      const pagesWithSections = (allPages || []).map(page => ({
        ...page,
        sections: (allSections || []).filter(s => s.page_id === page.id)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
      }));

      const snapshot = {
        pages: pagesWithSections,
        settings: site.settings,
        published_at: new Date().toISOString(),
      };

      // Reset is_current on previous publishes
      await supabase
        .from('publishes')
        .update({ is_current: false })
        .eq('site_id', site.id);

      // Create new publish
      const { error: publishError } = await supabase
        .from('publishes')
        .insert({
          site_id: site.id,
          tenant_id: currentTenant.id,
          version: newVersion,
          snapshot,
          is_current: true,
        });

      if (publishError) throw publishError;

      // Update site status
      await supabase
        .from('sites')
        .update({ status: 'published' })
        .eq('id', site.id);

      setSite(prev => prev ? { ...prev, status: 'published' } : null);
      
      // Show success with link to public site
      toast.success(
        <div className="flex flex-col gap-1">
          <span>האתר פורסם בהצלחה! (גרסה {newVersion})</span>
          <a 
            href={`/s/${site.slug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary underline text-sm"
          >
            צפה באתר →
          </a>
        </div>
      );
    } catch (error) {
      console.error('Error publishing:', error);
      toast.error('שגיאה בפרסום האתר');
    }
  };

  const handleViewPublished = () => {
    if (site?.slug) {
      window.open(`/s/${site.slug}`, '_blank');
    }
  };

  const viewModeWidths: Record<ViewMode, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!site) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/50 flex flex-col" dir="rtl">
      {/* Editor Header */}
      <header className="h-14 bg-card border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/sites">
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{site.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${
              site.status === 'published' ? 'status-published' : 'status-draft'
            }`}>
              {site.status === 'published' ? 'פורסם' : 'טיוטה'}
            </span>
            <SiteSettingsDialog site={site} onUpdate={setSite}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
              </Button>
            </SiteSettingsDialog>
          </div>
        </div>

        {/* Page Selector */}
        <div className="flex items-center gap-2">
          <Select 
            value={currentPage?.id || ''} 
            onValueChange={(value) => {
              const page = pages.find(p => p.id === value);
              setCurrentPage(page || null);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="בחר עמוד" />
            </SelectTrigger>
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          {/* Device Switcher */}
          <div className="flex items-center border rounded-lg p-1 bg-muted/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={viewMode === 'desktop' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>מחשב</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={viewMode === 'tablet' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setViewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>טאבלט</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={viewMode === 'mobile' ? 'secondary' : 'ghost'} 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>נייד</TooltipContent>
            </Tooltip>
          </div>

          {/* Edit/Preview Toggle */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Eye className="h-4 w-4" />
                תצוגה מקדימה
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                חזרה לעריכה
              </>
            )}
          </Button>

          {/* Save Status */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-3">
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>שומר...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="h-3 w-3 text-success" />
                <span>נשמר</span>
              </>
            ) : null}
          </div>

          {/* View Published Site */}
          {site.status === 'published' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleViewPublished}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  צפה באתר
                </Button>
              </TooltipTrigger>
              <TooltipContent>פתח את האתר המפורסם בטאב חדש</TooltipContent>
            </Tooltip>
          )}

          {/* Publish Button */}
          <Button onClick={handlePublish} className="gap-2">
            <Upload className="h-4 w-4" />
            פרסם
          </Button>
        </div>
      </header>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Preview Area */}
        <div className="flex-1 overflow-auto p-4 flex justify-center">
          <div 
            className="bg-card shadow-xl rounded-lg overflow-hidden transition-all duration-300"
            style={{ 
              width: viewModeWidths[viewMode],
              maxWidth: '100%',
            }}
          >
            {/* Preview Frame */}
            <div className="min-h-[calc(100vh-8rem)] overflow-auto">
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                  <Plus className="h-12 w-12 mb-4 opacity-30" />
                  <p>אין סקשנים בעמוד זה</p>
                  <p className="text-sm">הוסף סקשנים מהתפריט הימני</p>
                </div>
              ) : (
                sections.map((section) => (
                  <div 
                    key={section.id}
                    className={`relative group ${
                      isEditing && selectedSectionId === section.id 
                        ? 'outline outline-2 outline-primary outline-offset-2' 
                        : ''
                    }`}
                  >
                    {/* Section Controls */}
                    {isEditing && (
                      <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <GripVertical className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <Settings2 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <SectionRenderer
                      id={section.id}
                      type={section.type}
                      variant={section.variant || 'default'}
                      content={section.content as Record<string, unknown>}
                      settings={(section.settings as Record<string, unknown>) || {}}
                      isEditing={isEditing}
                      isSelected={selectedSectionId === section.id}
                      onSelect={() => setSelectedSectionId(section.id)}
                      onContentChange={(content) => handleContentChange(section.id, content)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Section List */}
        {isEditing && (
          <aside className="w-64 bg-card border-r shrink-0 overflow-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">סקשנים</h3>
              
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSectionId === section.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-muted-foreground/30 hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium capitalize">{section.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground mr-6">
                      {section.variant}
                    </span>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 gap-2">
                <Plus className="h-4 w-4" />
                הוסף סקשן
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
