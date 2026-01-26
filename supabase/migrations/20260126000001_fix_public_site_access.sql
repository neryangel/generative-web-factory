-- ═══════════════════════════════════════════════════════════════
-- AMDIR - Fix Public Site Access for Anonymous Visitors
-- ═══════════════════════════════════════════════════════════════
-- Published sites need to be viewable by anyone (for public-facing rendered sites)
-- The middleware routes custom domains to /sites/[domain], but without these
-- policies, database queries fail for unauthenticated visitors.

-- ═══════════════════════════════════════════════════════════════
-- SITES: Allow anonymous access to published sites
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view published sites"
    ON sites FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- ═══════════════════════════════════════════════════════════════
-- PAGES: Allow anonymous access to pages of published sites
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view pages of published sites"
    ON pages FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM sites
            WHERE sites.id = pages.site_id
            AND sites.status = 'published'
        )
    );

-- ═══════════════════════════════════════════════════════════════
-- SECTIONS: Allow anonymous access to sections of published sites
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view sections of published sites"
    ON sections FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM pages
            JOIN sites ON sites.id = pages.site_id
            WHERE pages.id = sections.page_id
            AND sites.status = 'published'
        )
    );

-- ═══════════════════════════════════════════════════════════════
-- DOMAINS: Allow anonymous lookup of active domains
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can lookup active domains"
    ON domains FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

-- ═══════════════════════════════════════════════════════════════
-- PUBLISHES: Allow anonymous access to current published versions
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view current published versions"
    ON publishes FOR SELECT
    TO anon, authenticated
    USING (
        is_current = true
        AND EXISTS (
            SELECT 1 FROM sites
            WHERE sites.id = publishes.site_id
            AND sites.status = 'published'
        )
    );

-- ═══════════════════════════════════════════════════════════════
-- ASSETS: Allow anonymous access to assets of published sites
-- ═══════════════════════════════════════════════════════════════

CREATE POLICY "Anyone can view assets of published sites"
    ON assets FOR SELECT
    TO anon, authenticated
    USING (
        site_id IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM sites
            WHERE sites.id = assets.site_id
            AND sites.status = 'published'
        )
    );

-- ═══════════════════════════════════════════════════════════════
-- Performance: Add index for status lookups
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_sites_status_published
    ON sites(status) WHERE status = 'published';
