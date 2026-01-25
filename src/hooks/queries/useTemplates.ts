import { useQuery } from '@tanstack/react-query';
import { templatesApi } from '@/api/templates.api';

export const TEMPLATES_QUERY_KEY = ['templates'];

/**
 * Hook to fetch all active templates
 */
export function useTemplates() {
  return useQuery({
    queryKey: TEMPLATES_QUERY_KEY,
    queryFn: () => templatesApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes - templates don't change often
  });
}

/**
 * Hook to fetch templates by category
 */
export function useTemplatesByCategory(category: string | undefined) {
  return useQuery({
    queryKey: [...TEMPLATES_QUERY_KEY, 'category', category],
    queryFn: () => templatesApi.getByCategory(category!),
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch a single template
 */
export function useTemplate(templateId: string | undefined) {
  return useQuery({
    queryKey: [...TEMPLATES_QUERY_KEY, templateId],
    queryFn: () => templatesApi.getById(templateId!),
    enabled: !!templateId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch template by slug
 */
export function useTemplateBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: [...TEMPLATES_QUERY_KEY, 'slug', slug],
    queryFn: () => templatesApi.getBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch all template categories
 */
export function useTemplateCategories() {
  return useQuery({
    queryKey: [...TEMPLATES_QUERY_KEY, 'categories'],
    queryFn: () => templatesApi.getCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
