import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sectionsApi } from '@/api/sections.api';
import { useTenant } from '@/hooks/useTenant';
import type { SectionContent, SectionInsert, SectionUpdate } from '@/types';

export const SECTIONS_QUERY_KEY = ['sections'];

/**
 * Hook to fetch all sections for a page
 */
export function useSections(pageId: string | null | undefined) {
  return useQuery({
    queryKey: [...SECTIONS_QUERY_KEY, pageId],
    queryFn: () => sectionsApi.getByPageId(pageId!),
    enabled: !!pageId,
  });
}

/**
 * Hook to fetch a single section
 */
export function useSection(sectionId: string | undefined) {
  return useQuery({
    queryKey: [...SECTIONS_QUERY_KEY, 'detail', sectionId],
    queryFn: () => sectionsApi.getById(sectionId!),
    enabled: !!sectionId,
  });
}

/**
 * Hook to create a new section
 */
export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (section: SectionInsert) => sectionsApi.create(section),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: [...SECTIONS_QUERY_KEY, data.page_id] });
    },
  });
}

/**
 * Hook to update a section
 */
export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, updates }: { sectionId: string; updates: SectionUpdate }) =>
      sectionsApi.update(sectionId, updates),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: [...SECTIONS_QUERY_KEY, data.page_id] });
    },
  });
}

/**
 * Hook to update section content
 */
export function useUpdateSectionContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, content }: { sectionId: string; content: SectionContent }) =>
      sectionsApi.updateContent(sectionId, content),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: [...SECTIONS_QUERY_KEY, data.page_id] });
    },
  });
}

/**
 * Hook to delete a section
 */
export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) => sectionsApi.delete(sectionId),
    onSuccess: (_data, _sectionId) => {
      // Invalidate all section queries since we don't know the page_id here
      void queryClient.invalidateQueries({ queryKey: SECTIONS_QUERY_KEY });
    },
  });
}

/**
 * Hook to reorder sections
 */
export function useReorderSections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sections: Array<{ id: string; sort_order: number }>) =>
      sectionsApi.updateOrder(sections),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SECTIONS_QUERY_KEY });
    },
  });
}

/**
 * Hook to duplicate a section
 */
export function useDuplicateSection() {
  const { currentTenant } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sectionId: string) =>
      sectionsApi.duplicate(sectionId, currentTenant!.id),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: [...SECTIONS_QUERY_KEY, data.page_id] });
    },
  });
}
