import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddSectionDialog } from './AddSectionDialog';
import type { Tables } from '@/integrations/supabase/types';

interface AddSectionButtonProps {
  pageId: string;
  tenantId: string;
  currentSectionsCount: number;
  onSectionAdded: (section: Tables<'sections'>) => void;
  variant?: 'default' | 'inline';
}

export function AddSectionButton({
  pageId,
  tenantId,
  currentSectionsCount,
  onSectionAdded,
  variant = 'default',
}: AddSectionButtonProps) {
  if (variant === 'inline') {
    return (
      <AddSectionDialog
        pageId={pageId}
        tenantId={tenantId}
        currentSectionsCount={currentSectionsCount}
        onSectionAdded={onSectionAdded}
      >
        <div className="flex items-center justify-center py-2 group cursor-pointer">
          <div className="flex-1 h-px bg-border group-hover:bg-primary/50 transition-colors" />
          <Button
            variant="outline"
            size="sm"
            className="mx-2 h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-4 w-4 ms-1" />
            הוסף סקשן
          </Button>
          <div className="flex-1 h-px bg-border group-hover:bg-primary/50 transition-colors" />
        </div>
      </AddSectionDialog>
    );
  }

  return (
    <AddSectionDialog
      pageId={pageId}
      tenantId={tenantId}
      currentSectionsCount={currentSectionsCount}
      onSectionAdded={onSectionAdded}
    >
      <Button variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        הוסף סקשן
      </Button>
    </AddSectionDialog>
  );
}
