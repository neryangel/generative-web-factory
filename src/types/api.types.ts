import type { Tables } from '@/integrations/supabase/types';

// Tenant types
export type Tenant = Tables<'tenants'>;
export type TenantMember = Tables<'tenant_members'>;

// Domain types
export type Domain = Tables<'domains'>;

// Publish types
export type Publish = Tables<'publishes'>;

// Template types
export type Template = Tables<'templates'>;

// Asset types
export type Asset = Tables<'assets'>;

// Profile types
export type Profile = Tables<'profiles'>;

// API Response wrappers
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// User role types
export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';
