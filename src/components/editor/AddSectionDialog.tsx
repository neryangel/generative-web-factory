import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Grid,
  Image,
  Layout,
  LayoutGrid,
  Loader2,
  Mail,
  Megaphone,
  Quote,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type SectionRegistry = Tables<'section_registry'>;

interface AddSectionDialogProps {
  children: React.ReactNode;
  pageId: string;
  tenantId: string;
  currentSectionsCount: number;
  onSectionAdded: (section: Tables<'sections'>) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  layout: Layout,
  grid: Grid,
  image: Image,
  quote: Quote,
  megaphone: Megaphone,
  mail: Mail,
  users: Users,
  'layout-grid': LayoutGrid,
};

export function AddSectionDialog({
  children,
  pageId,
  tenantId,
  currentSectionsCount,
  onSectionAdded,
}: AddSectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [registry, setRegistry] = useState<SectionRegistry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchRegistry() {
      try {
        const { data, error } = await supabase
          .from('section_registry')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setRegistry(data || []);
        
        // Set default variants
        const defaults: Record<string, string> = {};
        data?.forEach(item => {
          const variants = item.supported_variants as string[] || [];
          if (variants.length > 0) {
            defaults[item.type] = variants[0];
          }
        });
        setSelectedVariants(defaults);
      } catch (error) {
        console.error('Error fetching section registry:', error);
        toast.error('שגיאה בטעינת סוגי הסקשנים');
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      void fetchRegistry();
    }
  }, [open]);

  const handleAddSection = async (registryItem: SectionRegistry) => {
    setAdding(registryItem.type);

    try {
      const variant = selectedVariants[registryItem.type] || 'default';
      
      const { data, error } = await supabase
        .from('sections')
        .insert({
          page_id: pageId,
          tenant_id: tenantId,
          type: registryItem.type,
          variant,
          content: registryItem.default_content,
          sort_order: currentSectionsCount,
        })
        .select()
        .single();

      if (error) throw error;

      onSectionAdded(data);
      setOpen(false);
      toast.success(`סקשן ${registryItem.name} נוסף בהצלחה`);
    } catch (error) {
      console.error('Error adding section:', error);
      toast.error('שגיאה בהוספת הסקשן');
    } finally {
      setAdding(null);
    }
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Layout;
    return iconMap[iconName] || Layout;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] bg-card">
        <DialogHeader>
          <DialogTitle>הוספת סקשן חדש</DialogTitle>
          <DialogDescription>
            בחר את סוג הסקשן שברצונך להוסיף לעמוד
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-[60vh] pr-4">
            <div className="grid grid-cols-2 gap-4">
              {registry.map((item) => {
                const Icon = getIcon(item.icon);
                const variants = (item.supported_variants as string[]) || [];
                const isAdding = adding === item.type;

                return (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 hover:border-primary/50 transition-colors bg-background"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Variant Selection */}
                    {variants.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-2">סגנון:</p>
                        <div className="flex flex-wrap gap-1">
                          {variants.map((variant) => (
                            <Badge
                              key={variant}
                              variant={selectedVariants[item.type] === variant ? 'default' : 'outline'}
                              className="cursor-pointer text-xs"
                              onClick={() => setSelectedVariants(prev => ({
                                ...prev,
                                [item.type]: variant,
                              }))}
                            >
                              {variant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddSection(item)}
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin ml-2" />
                          מוסיף...
                        </>
                      ) : (
                        'הוסף סקשן'
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
