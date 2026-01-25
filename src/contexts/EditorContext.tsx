import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ViewMode, Site, Page, Section } from '@/types';

interface EditorContextValue {
  // Selection state
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  
  // View state
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  // Active tab in sidebar
  activeTab: 'sections' | 'theme';
  setActiveTab: (tab: 'sections' | 'theme') => void;
  
  // Deletion dialog state
  deletingSectionId: string | null;
  setDeletingSectionId: (id: string | null) => void;
  
  // Drag state
  activeDragId: string | null;
  setActiveDragId: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

interface EditorProviderProps {
  children: ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [activeTab, setActiveTab] = useState<'sections' | 'theme'>('sections');
  const [deletingSectionId, setDeletingSectionId] = useState<string | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        selectedSectionId,
        setSelectedSectionId,
        isPreviewMode,
        togglePreviewMode,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        deletingSectionId,
        setDeletingSectionId,
        activeDragId,
        setActiveDragId,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}
