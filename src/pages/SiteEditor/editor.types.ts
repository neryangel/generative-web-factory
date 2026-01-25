import type { ViewMode, Site, Page, Section } from '@/types';
import type { SectionContent } from '@/components/editor/SectionRenderer';

export interface EditorState {
  site: Site | null;
  pages: Page[];
  sections: Section[];
  currentPage: Page | null;
  selectedSectionId: string | null;
  isEditing: boolean;
  viewMode: ViewMode;
  loading: boolean;
}

export interface EditorHeaderProps {
  site: Site;
  pages: Page[];
  currentPage: Page | null;
  viewMode: ViewMode;
  isEditing: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  onPageChange: (page: Page) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleEditing: () => void;
  onPublish: () => void;
  onSiteUpdate: (site: Site) => void;
}

export interface EditorPreviewProps {
  site: Site;
  sections: Section[];
  selectedSectionId: string | null;
  isEditing: boolean;
  viewMode: ViewMode;
  onSectionSelect: (id: string) => void;
  onContentChange: (sectionId: string, content: SectionContent) => void;
  onDeleteClick: (sectionId: string) => void;
  onSectionsReorder: (sections: Section[]) => void;
}

export interface EditorSidebarProps {
  site: Site;
  sections: Section[];
  currentPage: Page | null;
  selectedSectionId: string | null;
  onSectionSelect: (id: string | null) => void;
  onSectionAdded: (section: Section) => void;
  onSiteUpdate: (site: Site) => void;
}
