import { Layers, Palette } from 'lucide-react';
import { SortableSectionList } from '@/components/editor/SortableSectionList';
import { AddSectionButton } from '@/components/editor/AddSectionButton';
import { ThemeCustomizer } from '@/components/editor/ThemeCustomizer';
import type { EditorSidebarProps } from './editor.types';
import { useState } from 'react';
import { useTenant } from '@/hooks/useTenant';

export function EditorSidebar({
  site,
  sections,
  currentPage,
  selectedSectionId,
  onSectionSelect,
  onSectionAdded,
  onSiteUpdate,
}: EditorSidebarProps) {
  const { currentTenant } = useTenant();
  const [activeTab, setActiveTab] = useState<'sections' | 'theme'>('sections');

  return (
    <aside className="w-72 bg-card border-r shrink-0 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b shrink-0">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'sections'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="w-4 h-4" />
          סקשנים
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'theme'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Palette className="w-4 h-4" />
          עיצוב
        </button>
      </div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'theme' ? (
          <ThemeCustomizer site={site} onUpdate={onSiteUpdate} />
        ) : (
          <>
            <h3 className="font-semibold mb-4">סקשנים</h3>

            <SortableSectionList
              sections={sections}
              selectedSectionId={selectedSectionId}
              onSelect={onSectionSelect}
              onReorder={() => {}}
            />

            {currentPage && currentTenant && (
              <AddSectionButton
                pageId={currentPage.id}
                tenantId={currentTenant.id}
                currentSectionsCount={sections.length}
                onSectionAdded={onSectionAdded}
              />
            )}
          </>
        )}
      </div>
    </aside>
  );
}
