-- ═══════════════════════════════════════════════════════════════
-- AMDIR - Architectural Fixes for Enterprise Scalability
-- ═══════════════════════════════════════════════════════════════
-- Fixes:
-- 1. Global slug uniqueness to prevent collision on /s/[slug] routes
-- 2. Composite indexes for RLS policy performance at scale
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- FIX 1: Global Slug Uniqueness
-- ═══════════════════════════════════════════════════════════════
-- Problem: Site slugs are unique per-tenant but preview route /s/[slug]
-- serves sites globally. Two tenants could create slug "my-restaurant"
-- causing collision on public preview URL.

-- First drop the existing constraint
ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_tenant_id_slug_key;

-- Add global uniqueness constraint on slug
ALTER TABLE sites ADD CONSTRAINT sites_slug_key UNIQUE (slug);

-- ═══════════════════════════════════════════════════════════════
-- FIX 2: Composite Indexes for RLS Performance
-- ═══════════════════════════════════════════════════════════════
-- Problem: RLS policies call is_tenant_member(tenant_id, user_id) on every
-- query. At scale (1000+ tenants, 100k+ sites), this causes full table scans.

-- Optimal index for tenant membership lookups (used by is_tenant_member function)
CREATE INDEX IF NOT EXISTS idx_tenant_members_lookup
    ON tenant_members(tenant_id, user_id);

-- Composite index for sites queries filtered by tenant and status
CREATE INDEX IF NOT EXISTS idx_sites_tenant_status
    ON sites(tenant_id, status);

-- Composite index for pages with site and tenant (for RLS joins)
CREATE INDEX IF NOT EXISTS idx_pages_site_tenant
    ON pages(site_id, tenant_id);

-- Composite index for sections with page and tenant (for RLS joins)
CREATE INDEX IF NOT EXISTS idx_sections_page_tenant
    ON sections(page_id, tenant_id);

-- Index for publishes lookups by site and current status
CREATE INDEX IF NOT EXISTS idx_publishes_site_current
    ON publishes(site_id, is_current) WHERE is_current = true;

-- Index for domains by site and status
CREATE INDEX IF NOT EXISTS idx_domains_site_status
    ON domains(site_id, status);

-- Index for assets by tenant and site
CREATE INDEX IF NOT EXISTS idx_assets_tenant_site
    ON assets(tenant_id, site_id);

-- ═══════════════════════════════════════════════════════════════
-- Performance: Analyze tables after index creation
-- ═══════════════════════════════════════════════════════════════
ANALYZE tenant_members;
ANALYZE sites;
ANALYZE pages;
ANALYZE sections;
ANALYZE publishes;
ANALYZE domains;
ANALYZE assets;
