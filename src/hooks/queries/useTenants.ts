import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantsApi, TenantWithRole } from '@/api/tenants.api';
import { useAuth } from '@/hooks/useAuth';
import { queryKeys } from '@/lib/query-keys';

/**
 * Hook to fetch all tenants for the current user
 */
export function useTenants() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.tenants.list(user?.id),
    queryFn: () => {
      if (!user) throw new Error('No user authenticated');
      return tenantsApi.getAllForUser(user.id);
    },
    enabled: !!user,
  });
}

/**
 * Hook to fetch a single tenant by ID
 */
export function useTenantById(tenantId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tenants.detail(tenantId),
    queryFn: () => {
      if (!tenantId) throw new Error('No tenant ID provided');
      return tenantsApi.getById(tenantId);
    },
    enabled: !!tenantId,
  });
}

/**
 * Hook to create a new tenant
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; slug: string }) => tenantsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
    },
  });
}

/**
 * Hook to update a tenant
 */
export function useUpdateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, updates }: { tenantId: string; updates: Partial<TenantWithRole> }) =>
      tenantsApi.update(tenantId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all });
      queryClient.setQueryData(queryKeys.tenants.detail(data.id), data);
    },
  });
}
