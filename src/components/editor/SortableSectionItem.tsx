import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';

type Section = Tables<'sections'>;

interface SortableSectionItemProps {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
}

export function SortableSectionItem({ section, isSelected, onSelect }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'p-3 rounded-lg border cursor-pointer transition-all duration-200',
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'hover:border-muted-foreground/30 hover:bg-muted/50',
        isDragging && 'opacity-50 shadow-lg scale-[1.02] z-50 bg-card'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <button
          className="cursor-grab active:cursor-grabbing touch-none p-1 -m-1 rounded hover:bg-muted"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-medium capitalize">{section.type}</span>
      </div>
      <span className="text-xs text-muted-foreground mr-6">
        {section.variant}
      </span>
    </div>
  );
}
