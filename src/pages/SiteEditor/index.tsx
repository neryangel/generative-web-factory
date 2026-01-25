import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTenant } from '@/hooks/useTenant';
import { useAutoSave } from '@/hooks/useAutoSave';
import { supabase } from '@/integrations/supabase/client';
import { SectionContent } from '@/components/editor/SectionRenderer';
import { DeleteSectionDialog } from '@/components/editor/DeleteSectionDialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EditorHeader } from './EditorHeader';
import { EditorPreview } from './EditorPreview';
import { EditorSidebar } from './EditorSidebar';
import { toast } from 'sonner';
import type { Site, Page, Section, ViewMode } from '@/types';

export default function SiteEditor() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { currentTenant } = useTenant();

  // State
  const [site, setSite] = useState<Site | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [loading, setLoading] = useState(true);

  const { isSaving, lastSaved, saveSection } = useAutoSave({
    debounceMs: 1500,
  });

  // Fetch site data
  useEffect(() => {
    async function fetchData() {
      if (!siteId || !currentTenant) return;

      try {
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

        const { data: pagesData, error: pagesError } = await supabase
          .from('pages')
          .select('*')
          .eq('site_id', siteId)
          .order('sort_order');

        if (pagesError) throw pagesError;
        setPages(pagesData || []);

        if (pagesData && pagesData.length > 0) {
          const homepage = pagesData.find((p) => p.is_homepage) || pagesData[0];
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

  // Handlers
  const handleContentChange = useCallback(
    (sectionId: string, content: SectionContent) => {
      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, content: content as Section['content'] } : s
        )
      );
      saveSection(sectionId, content);
    },
    [saveSection]
  );

  const handleSectionAdded = useCallback((section: Section) => {
    setSections((prev) => [...prev, section]);
  }, []);

  const handleSectionDeleted = useCallback(
    (sectionId: string) => {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      if (selectedSectionId === sectionId) {
        setSelectedSectionId(null);
      }
    },
    [selectedSectionId]
  );

  const handleSectionsReorder = useCallback(
    async (reorderedSections: Section[]) => {
      setSections(reorderedSections);

      try {
        const updates = reorderedSections.map((section, index) =>
          supabase.from('sections').update({ sort_order: index }).eq('id', section.id)
        );

        await Promise.all(updates);
        toast.success('סדר הסקשנים עודכן');
      } catch (error) {
        console.error('Error updating sort order:', error);
        toast.error('שגיאה בעדכון סדר הסקשנים');
      }
    },
    []
  );

  const handlePublish = async () => {
    if (!site || !currentTenant) return;

    try {
      const { data: lastPublish } = await supabase
        .from('publishes')
        .select('version')
        .eq('site_id', site.id)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newVersion = (lastPublish?.version || 0) + 1;

      const { data: allPages } = await supabase
        .from('pages')
        .select('*')
        .eq('site_id', site.id);

      const { data: allSections } = await supabase
        .from('sections')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .in(
          'page_id',
          (allPages || []).map((p) => p.id)
        );

      const pagesWithSections = (allPages || []).map((page) => ({
        ...page,
        sections: (allSections || [])
          .filter((s) => s.page_id === page.id)
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
      }));

      const snapshot = {
        pages: pagesWithSections,
        settings: site.settings,
        published_at: new Date().toISOString(),
      };

      await supabase
        .from('publishes')
        .update({ is_current: false })
        .eq('site_id', site.id);

      const { error: publishError } = await supabase.from('publishes').insert({
        site_id: site.id,
        tenant_id: currentTenant.id,
        version: newVersion,
        snapshot,
        is_current: true,
      });

      if (publishError) throw publishError;

      await supabase.from('sites').update({ status: 'published' }).eq('id', site.id);

      setSite((prev) => (prev ? { ...prev, status: 'published' } : null));

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

  const sectionToDelete = deletingSectionId
    ? sections.find((s) => s.id === deletingSectionId)
    : null;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!site) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/50 flex flex-col" dir="rtl">
      <EditorHeader
        site={site}
        pages={pages}
        currentPage={currentPage}
        viewMode={viewMode}
        isEditing={isEditing}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onPageChange={setCurrentPage}
        onViewModeChange={setViewMode}
        onToggleEditing={() => setIsEditing(!isEditing)}
        onPublish={handlePublish}
        onSiteUpdate={setSite}
      />

      <div className="flex-1 flex overflow-hidden">
        <EditorPreview
          site={site}
          sections={sections}
          selectedSectionId={selectedSectionId}
          isEditing={isEditing}
          viewMode={viewMode}
          onSectionSelect={setSelectedSectionId}
          onContentChange={handleContentChange}
          onDeleteClick={setDeletingSectionId}
          onSectionsReorder={handleSectionsReorder}
        />

        {isEditing && (
          <EditorSidebar
            site={site}
            sections={sections}
            currentPage={currentPage}
            selectedSectionId={selectedSectionId}
            onSectionSelect={setSelectedSectionId}
            onSectionAdded={handleSectionAdded}
            onSiteUpdate={setSite}
          />
        )}
      </div>

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
