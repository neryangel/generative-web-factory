import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sectionsApi } from '@/api/sections.api';
import { useTenant } from '@/hooks/useTenant';
import { queryKeys } from '@/lib/query-keys';
import type { SectionContent, SectionInsert, SectionUpdate } from '@/types';

/** @deprecated Use queryKeys.sections from '@/lib/query-keys' instead */
export const SECTIONS_QUERY_KEY = queryKeys.sections.all;

/**
 * Hook to fetch all sections for a page
 */
export function useSections(pageId: string | null | undefined, tenantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sections.list(pageId) ?? ['_disabled'],
    queryFn: () => sectionsApi.getByPageId(pageId!, tenantId!),
    enabled: !!pageId && !!tenantId,
  });
}

/**
 * Hook to fetch a single section
 */
export function useSection(sectionId: string | undefined, tenantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.sections.detail(sectionId) ?? ['_disabled'],
    queryFn: () => sectionsApi.getById(sectionId!, tenantId!),
    enabled: !!sectionId && !!tenantId,
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.sections.list(data.page_id) });
    },
  });
}

/**
 * Hook to update a section
 */
export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, tenantId, updates }: { sectionId: string; tenantId: string; updates: SectionUpdate }) =>
      sectionsApi.update(sectionId, tenantId, updates),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sections.list(data.page_id) });
    },
  });
}

/**
 * Hook to update section content
 */
export function useUpdateSectionContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, tenantId, content }: { sectionId: string; tenantId: string; content: SectionContent }) =>
      sectionsApi.updateContent(sectionId, tenantId, content),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.sections.list(data.page_id) });
    },
  });
}

/**
 * Hook to delete a section
 */
export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, tenantId }: { sectionId: string; tenantId: string }) =>
      sectionsApi.delete(sectionId, tenantId),
    onSuccess: (_data, _variables) => {
      // Invalidate all section queries since we don't know the page_id here
      void queryClient.invalidateQueries({ queryKey: queryKeys.sections.all });
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.sections.all });
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.sections.list(data.page_id) });
    },
  });
}
