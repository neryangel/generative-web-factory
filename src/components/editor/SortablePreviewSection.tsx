import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SectionContent } from './SectionRenderer';
import { SectionRenderer } from './SectionRenderer';
import type { SectionStyles } from './SectionPropertiesPanel';
import { cn } from '@/lib/utils';
import type { Tables } from '@/integrations/supabase/types';

type Section = Tables<'sections'>;

const paddingMap: Record<string, string> = {
  compact: '3rem',
  normal: '5rem',
  spacious: '7rem',
};

interface SortablePreviewSectionProps {
  section: Section;
  isSelected: boolean;
  isEditing: boolean;
  isDeleting?: boolean;
  sectionStyles?: SectionStyles;
  onSelect: () => void;
  onContentChange: (content: SectionContent) => void;
  onDeleteClick: () => void;
  onSettingsClick?: () => void;
}

export const SortablePreviewSection = React.memo(function SortablePreviewSection({
  section,
  isSelected,
  isEditing,
  isDeleting,
  sectionStyles,
  onSelect,
  onContentChange,
  onDeleteClick,
  onSettingsClick,
}: SortablePreviewSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'all 300ms ease',
  };

  // Apply section-specific styles
  const sectionInlineStyle: React.CSSProperties = {
    ...dndStyle,
    ...(sectionStyles?.backgroundColor ? { backgroundColor: sectionStyles.backgroundColor } : {}),
    ...(sectionStyles?.textColor ? { color: sectionStyles.textColor } : {}),
    ...(sectionStyles?.paddingY ? { paddingTop: paddingMap[sectionStyles.paddingY], paddingBottom: paddingMap[sectionStyles.paddingY] } : {}),
  };

  return (
    <div
      ref={setNodeRef}
      style={sectionInlineStyle}
      className={cn(
        'relative group transition-all duration-300',
        isEditing && isSelected && 'outline outline-2 outline-primary outline-offset-2',
        isDragging && 'opacity-50 z-50',
        isDeleting && 'animate-fade-out opacity-0 scale-95'
      )}
    >
      {/* Section Controls */}
      {isEditing && (
        <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onSettingsClick?.();
            }}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
          >
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
        isSelected={isSelected}
        onSelect={onSelect}
        onContentChange={onContentChange}
      />
    </div>
  );
});
