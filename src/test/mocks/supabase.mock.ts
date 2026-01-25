import { vi } from 'vitest';

// Mock Supabase client for testing
export const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
  })),
  auth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  },
  functions: {
    invoke: vi.fn(),
  },
};

// Helper to create mock response
export function createMockResponse<T>(data: T, error: Error | null = null) {
  return { data, error };
}

// Helper to reset all mocks
export function resetSupabaseMocks() {
  vi.clearAllMocks();
}

// Mock data factories
export const mockFactories = {
  site: (overrides = {}) => ({
    id: 'site-1',
    tenant_id: 'tenant-1',
    name: 'Test Site',
    slug: 'test-site',
    description: 'A test site',
    settings: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  page: (overrides = {}) => ({
    id: 'page-1',
    site_id: 'site-1',
    tenant_id: 'tenant-1',
    title: 'Test Page',
    slug: 'test-page',
    is_homepage: false,
    sort_order: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  section: (overrides = {}) => ({
    id: 'section-1',
    page_id: 'page-1',
    tenant_id: 'tenant-1',
    type: 'hero',
    variant: 'default',
    content: {},
    settings: {},
    sort_order: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  template: (overrides = {}) => ({
    id: 'template-1',
    name: 'Test Template',
    slug: 'test-template',
    category: 'business',
    description: 'A test template',
    preview_image: 'https://example.com/preview.jpg',
    structure: {},
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  domain: (overrides = {}) => ({
    id: 'domain-1',
    site_id: 'site-1',
    tenant_id: 'tenant-1',
    domain: 'example.com',
    status: 'pending',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  publish: (overrides = {}) => ({
    id: 'publish-1',
    site_id: 'site-1',
    tenant_id: 'tenant-1',
    version: 1,
    snapshot: { pages: [], settings: {}, published_at: '2024-01-01T00:00:00Z' },
    changelog: null,
    is_current: true,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  tenant: (overrides = {}) => ({
    id: 'tenant-1',
    name: 'Test Tenant',
    slug: 'test-tenant',
    settings: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  user: (overrides = {}) => ({
    id: 'user-1',
    email: 'test@example.com',
    user_metadata: { full_name: 'Test User' },
    ...overrides,
  }),

  session: (overrides = {}) => ({
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    user: mockFactories.user(),
    ...overrides,
  }),
};
