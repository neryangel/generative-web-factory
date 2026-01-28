'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTenant } from '@/hooks/useTenant';
import { useAutoSave } from '@/hooks/useAutoSave';
import { supabase } from '@/integrations/supabase/client';
import type { SectionContent } from '@/components/editor/SectionRenderer';
import { SortableSectionList } from '@/components/editor/SortableSectionList';
import { SortablePreviewSection } from '@/components/editor/SortablePreviewSection';
import { AddSectionButton } from '@/components/editor/AddSectionButton';
import { DeleteSectionDialog } from '@/components/editor/DeleteSectionDialog';
import { SiteSettingsDialog } from '@/components/site/SiteSettingsDialog';
import { ThemeCustomizer } from '@/components/editor/ThemeCustomizer';
import { ThemeProvider } from '@/contexts/ThemeContext';
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
  Check, 
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Loader2,
  Monitor,
  Palette,
  Plus,
  Settings2,
  Smartphone,
  Tablet,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import type {
  DragEndEvent,
  DragStartEvent} from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Tables } from '@/integrations/supabase/types';

type Site = Tables<'sites'>;
type Page = Tables<'pages'>;
type Section = Tables<'sections'>;

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export default function SiteEditor() {
  const params = useParams<{ siteId: string }>();
  const siteId = params.siteId;
  const router = useRouter();
  const { currentTenant } = useTenant();
  
  const [site, setSite] = useState<Site | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [loading, setLoading] = useState(true);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  
  const { isSaving, lastSaved, saveSection, flushSave: _flushSave } = useAutoSave({
    debounceMs: 1500,
  });

  // DnD sensors for preview area
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
          router.push('/dashboard/sites');
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

    void fetchData();
  }, [siteId, currentTenant, router]);

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

    void fetchSections();
  }, [currentPage]);

  const handleContentChange = useCallback((sectionId: string, content: SectionContent) => {
    // Update local state immediately
    setSections(prev => prev.map(s => 
      s.id === sectionId ? { ...s, content: content as Section['content'] } : s
    ));
    
    // Queue auto-save
    saveSection(sectionId, content);
  }, [saveSection]);

  // Handle new section added
  const handleSectionAdded = useCallback((section: Section) => {
    setSections(prev => [...prev, section]);
  }, []);

  // Handle section deleted
  const handleSectionDeleted = useCallback((sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
    }
  }, [selectedSectionId]);

  // Get section to delete for dialog
  const sectionToDelete = deletingSectionId 
    ? sections.find(s => s.id === deletingSectionId) 
    : null;

  // Handle drag start for preview
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  // Handle drag end - reorder sections
  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDragId(null);
    
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistic update
    const reorderedSections = arrayMove(sections, oldIndex, newIndex);
    setSections(reorderedSections);

    // Persist to database atomically using RPC
    try {
      if (!currentPage) return;

      const sectionOrders = reorderedSections.map((section, index) => ({
        id: section.id,
        sort_order: index,
      }));

      const { error } = await supabase.rpc('reorder_sections', {
        p_page_id: currentPage.id,
        p_section_orders: sectionOrders,
      });

      if (error) throw error;
      toast.success('סדר הסקשנים עודכן');
    } catch (error) {
      console.error('Error updating sort order:', error);
      // Rollback on error
      setSections(sections);
      toast.error('שגיאה בעדכון סדר הסקשנים');
    }
  };

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

      // Fetch pages with their sections in a single joined query
      const { data: allPages, error: pagesError } = await supabase
        .from('pages')
        .select('*, sections(*)')
        .eq('site_id', site.id)
        .order('sort_order');

      if (pagesError) throw pagesError;

      if (!allPages || allPages.length === 0) {
        toast.error('אין דפים לפרסום. הוסף לפחות דף אחד.');
        return;
      }

      // Sort sections within each page
      const pagesWithSections = allPages.map(page => ({
        ...page,
        sections: (page.sections || [])
          .sort((a: Section, b: Section) => (a.sort_order || 0) - (b.sort_order || 0)),
      }));

      const snapshot = {
        pages: pagesWithSections,
        settings: site.settings,
        published_at: new Date().toISOString(),
      };

      // Reset is_current and create new publish atomically
      // First reset, then insert - if insert fails, we still have version history
      const { error: resetError } = await supabase
        .from('publishes')
        .update({ is_current: false })
        .eq('site_id', site.id)
        .eq('is_current', true);

      if (resetError) throw resetError;

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

  const activeDragSection = activeDragId 
    ? sections.find(s => s.id === activeDragId) 
    : null;

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
          <Link href="/dashboard/sites">
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
        <div className="flex-1 overflow-hidden p-4 flex justify-center">
          <div 
            className="bg-card shadow-xl rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col"
            style={{ 
              width: viewModeWidths[viewMode],
              maxWidth: '100%',
            }}
          >
            {/* Preview Frame - only this scrolls, wrapped with ThemeProvider */}
            <ThemeProvider settings={site?.settings as Record<string, unknown>}>
              <div className="flex-1 overflow-y-auto">
                {sections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                    <Plus className="h-12 w-12 mb-4 opacity-30" />
                    <p>אין סקשנים בעמוד זה</p>
                    <p className="text-sm mb-4">הוסף סקשנים מהתפריט הימני</p>
                    {currentPage && currentTenant && (
                      <AddSectionButton
                        pageId={currentPage.id}
                        tenantId={currentTenant.id}
                        currentSectionsCount={0}
                        onSectionAdded={handleSectionAdded}
                      />
                    )}
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sections.map(s => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {sections.map((section) => (
                        <SortablePreviewSection
                          key={section.id}
                          section={section}
                          isSelected={selectedSectionId === section.id}
                          isEditing={isEditing}
                          onSelect={() => setSelectedSectionId(section.id)}
                          onContentChange={(content) => handleContentChange(section.id, content)}
                          onDeleteClick={() => setDeletingSectionId(section.id)}
                        />
                      ))}
                    </SortableContext>

                    <DragOverlay>
                      {activeDragSection ? (
                        <div className="bg-card/80 backdrop-blur-sm border-2 border-primary rounded-lg p-4 shadow-2xl">
                          <span className="font-medium capitalize">{activeDragSection.type}</span>
                          <span className="text-sm text-muted-foreground mr-2">
                            ({activeDragSection.variant})
                          </span>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )}
              </div>
            </ThemeProvider>
          </div>
        </div>

        {/* Right Sidebar - Section List & Theme */}
        {isEditing && (
          <aside className="w-72 bg-card border-r shrink-0 flex flex-col overflow-hidden">
            {/* Tabs - fixed at top */}
            <div className="flex border-b shrink-0">
              <button
                onClick={() => setSelectedSectionId(null)}
                className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  !selectedSectionId ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Layers className="w-4 h-4" />
                סקשנים
              </button>
              <button
                onClick={() => setSelectedSectionId('theme')}
                className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  selectedSectionId === 'theme' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Palette className="w-4 h-4" />
                עיצוב
              </button>
            </div>

            {/* Sidebar content - scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedSectionId === 'theme' ? (
                <ThemeCustomizer site={site} onUpdate={setSite} />
              ) : (
                <>
                  <h3 className="font-semibold mb-4">סקשנים</h3>
                  
                  <SortableSectionList
                    sections={sections}
                    selectedSectionId={selectedSectionId}
                    onSelect={setSelectedSectionId}
                    onReorder={handleDragEnd}
                  />

                  {currentPage && currentTenant && (
                    <AddSectionButton
                      pageId={currentPage.id}
                      tenantId={currentTenant.id}
                      currentSectionsCount={sections.length}
                      onSectionAdded={handleSectionAdded}
                    />
                  )}
                </>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Delete Section Dialog */}
      <DeleteSectionDialog
        open={!!deletingSectionId}
        onOpenChange={(open) => !open && setDeletingSectionId(null)}
        sectionId={deletingSectionId || ''}
        sectionType={sectionToDelete?.type || ''}
        onDeleted={handleSectionDeleted}
      />
    </div>
  );
}
