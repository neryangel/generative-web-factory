import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, FileText, Layers, Palette } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Template = Tables<'templates'>;

interface TemplatePreviewDialogProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: Template) => void;
}

const sectionTypeLabels: Record<string, string> = {
  hero: 'Hero - כותרת ראשית',
  features: 'תכונות ויתרונות',
  about: 'אודות',
  gallery: 'גלריה',
  testimonials: 'המלצות',
  contact: 'צור קשר',
  cta: 'קריאה לפעולה',
  footer: 'פוטר',
  stats: 'סטטיסטיקות',
  team: 'צוות',
  pricing: 'מחירים',
  faq: 'שאלות נפוצות',
};

// Helper to extract section type from both old (string) and new (object) formats
const getSectionType = (section: string | { type: string }): string => {
  return typeof section === 'object' && section.type ? section.type : String(section);
};

export function TemplatePreviewDialog({ 
  template, 
  open, 
  onOpenChange, 
  onSelect 
}: TemplatePreviewDialogProps) {
  if (!template) return null;

  const blueprintSchema = template.blueprint_schema as any;
  const pages = blueprintSchema?.pages || [];
  const settings = blueprintSchema?.settings || {};
  const colors = settings.colors || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-3">
            {template.name}
            <Badge variant="secondary" className="font-normal">
              {template.category}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {/* Thumbnail Preview */}
            {template.thumbnail_url && (
              <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                <img 
                  src={template.thumbnail_url} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <p className="text-muted-foreground">{template.description}</p>

            {/* Colors Preview */}
            {colors.primary && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  צבעי התבנית
                </h4>
                <div className="flex gap-3">
                  {colors.primary && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg border shadow-sm" 
                        style={{ backgroundColor: colors.primary }}
                      />
                      <span className="text-sm text-muted-foreground">ראשי</span>
                    </div>
                  )}
                  {colors.secondary && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg border shadow-sm" 
                        style={{ backgroundColor: colors.secondary }}
                      />
                      <span className="text-sm text-muted-foreground">משני</span>
                    </div>
                  )}
                  {colors.accent && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg border shadow-sm" 
                        style={{ backgroundColor: colors.accent }}
                      />
                      <span className="text-sm text-muted-foreground">הדגשה</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pages Structure */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                מבנה העמודים
              </h4>
              <div className="space-y-3">
                {pages.map((page: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-lg bg-muted/50 border"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{page.title}</span>
                      <span className="text-xs text-muted-foreground">/{page.slug}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {page.sections?.map((section: string | { type: string }, sIdx: number) => {
                        const sectionType = getSectionType(section);
                        return (
                          <Badge 
                            key={sIdx} 
                            variant="outline" 
                            className="text-xs gap-1"
                          >
                            <Layers className="h-3 w-3" />
                            {sectionTypeLabels[sectionType] || sectionType}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Font Info */}
            {settings.fonts && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">פונטים: </span>
                {settings.fonts.heading} / {settings.fonts.body}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            סגור
          </Button>
          <Button onClick={() => onSelect(template)} className="gap-2">
            <Check className="h-4 w-4" />
            השתמש בתבנית זו
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
