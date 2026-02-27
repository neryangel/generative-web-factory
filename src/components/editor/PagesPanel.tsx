import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  FileText,
  Home,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';

type Page = Tables<'pages'>;

interface PagesPanelProps {
  siteId: string;
  tenantId: string;
  pages: Page[];
  currentPageId: string | null;
  onPageSelect: (page: Page) => void;
  onPageCreated: (page: Page) => void;
  onPageDeleted: (pageId: string) => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function PagesPanel({
  siteId,
  tenantId,
  pages,
  currentPageId,
  onPageSelect,
  onPageCreated,
  onPageDeleted,
}: PagesPanelProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleTitleChange = (title: string) => {
    setNewPageTitle(title);
    setNewPageSlug(slugify(title));
  };

  const handleCreatePage = useCallback(async () => {
    if (!newPageTitle.trim() || !newPageSlug.trim()) {
      toast.error('יש להזין שם וכתובת לעמוד');
      return;
    }

    // Check for duplicate slug
    if (pages.some(p => p.slug === newPageSlug)) {
      toast.error('כתובת עמוד זו כבר קיימת');
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          site_id: siteId,
          tenant_id: tenantId,
          title: newPageTitle.trim(),
          slug: newPageSlug.trim(),
          sort_order: pages.length,
          is_homepage: false,
        })
        .select()
        .single();

      if (error) throw error;

      onPageCreated(data);
      setNewPageTitle('');
      setNewPageSlug('');
      setShowCreateDialog(false);
      toast.success('העמוד נוצר בהצלחה');
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('שגיאה ביצירת העמוד');
    } finally {
      setCreating(false);
    }
  }, [newPageTitle, newPageSlug, siteId, tenantId, pages, onPageCreated]);

  const handleDeletePage = useCallback(async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page?.is_homepage) {
      toast.error('לא ניתן למחוק את עמוד הבית');
      return;
    }

    setDeletingId(pageId);
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      onPageDeleted(pageId);
      toast.success('העמוד נמחק');
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error('שגיאה במחיקת העמוד');
    } finally {
      setDeletingId(null);
    }
  }, [pages, onPageDeleted]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">עמודים</h3>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          חדש
        </Button>
      </div>

      {/* Pages list */}
      <div className="space-y-2">
        {pages.map((page) => (
          <div
            key={page.id}
            className={cn(
              'group flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200',
              currentPageId === page.id
                ? 'border-primary bg-primary/5'
                : 'hover:border-muted-foreground/30 hover:bg-muted/50'
            )}
            onClick={() => onPageSelect(page)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {page.is_homepage ? (
                <Home className="h-4 w-4 text-muted-foreground shrink-0" />
              ) : (
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium block truncate">
                  {page.title}
                </span>
                <span className="text-xs text-muted-foreground block truncate" dir="ltr">
                  /{page.slug}
                </span>
              </div>
            </div>

            {/* Delete button - only for non-homepage */}
            {!page.is_homepage && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(page.id);
                }}
                disabled={deletingId === page.id}
              >
                {deletingId === page.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                )}
              </Button>
            )}
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">אין עמודים</p>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => { if (!open) setConfirmDeleteId(null); }}
        title="מחיקת עמוד"
        description="האם אתה בטוח שברצונך למחוק את העמוד? פעולה זו לא ניתנת לביטול."
        confirmText="מחק"
        cancelText="ביטול"
        variant="destructive"
        onConfirm={() => {
          if (confirmDeleteId) {
            void handleDeletePage(confirmDeleteId);
            setConfirmDeleteId(null);
          }
        }}
      />

      {/* Create Page Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>עמוד חדש</DialogTitle>
            <DialogDescription>
              צור עמוד חדש לאתר שלך
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">שם העמוד</label>
              <Input
                value={newPageTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="לדוגמה: שירותים"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">כתובת (slug)</label>
              <Input
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(slugify(e.target.value))}
                placeholder="services"
                dir="ltr"
                className="text-left"
              />
              <p className="text-xs text-muted-foreground">
                העמוד יהיה זמין בכתובת: /s/.../{newPageSlug || 'slug'}
              </p>
            </div>

            <Button
              onClick={handleCreatePage}
              disabled={creating || !newPageTitle.trim() || !newPageSlug.trim()}
              className="w-full gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  יוצר...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  צור עמוד
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
