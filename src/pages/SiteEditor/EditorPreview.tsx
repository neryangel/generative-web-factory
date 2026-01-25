import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortablePreviewSection } from '@/components/editor/SortablePreviewSection';
import { AddSectionButton } from '@/components/editor/AddSectionButton';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { VIEW_MODE_WIDTHS } from '@/lib/constants';
import type { EditorPreviewProps } from './editor.types';
import type { Section } from '@/types';

export function EditorPreview({
  site,
  sections,
  selectedSectionId,
  isEditing,
  viewMode,
  onSectionSelect,
  onContentChange,
  onDeleteClick,
  onSectionsReorder,
}: EditorPreviewProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedSections = arrayMove(sections, oldIndex, newIndex);
    onSectionsReorder(reorderedSections);
  };

  const activeDragSection = activeDragId
    ? sections.find((s) => s.id === activeDragId)
    : null;

  return (
    <div className="flex-1 overflow-hidden p-4 flex justify-center">
      <div
        className="bg-card shadow-xl rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col"
        style={{
          width: VIEW_MODE_WIDTHS[viewMode],
          maxWidth: '100%',
        }}
      >
        <ThemeProvider settings={site?.settings as Record<string, unknown>}>
          <div className="flex-1 overflow-y-auto">
            {sections.length === 0 ? (
              <EmptyPreview />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section) => (
                    <SortablePreviewSection
                      key={section.id}
                      section={section}
                      isSelected={selectedSectionId === section.id}
                      isEditing={isEditing}
                      onSelect={() => onSectionSelect(section.id)}
                      onContentChange={(content) => onContentChange(section.id, content)}
                      onDeleteClick={() => onDeleteClick(section.id)}
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
  );
}

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
      <Plus className="h-12 w-12 mb-4 opacity-30" />
      <p>אין סקשנים בעמוד זה</p>
      <p className="text-sm mb-4">הוסף סקשנים מהתפריט הימני</p>
    </div>
  );
}
