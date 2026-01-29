-- ═══════════════════════════════════════════════════════════════
-- AMDIR Multi-Tenant Site Builder - Complete Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════

CREATE TYPE site_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE domain_status AS ENUM ('pending', 'verifying', 'active', 'failed');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

-- ═══════════════════════════════════════════════════════════════
-- GLOBAL TABLES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    blueprint_schema JSONB NOT NULL DEFAULT '{}',
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE section_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    schema JSONB NOT NULL DEFAULT '{}',
    default_content JSONB NOT NULL DEFAULT '{}',
    supported_variants TEXT[] DEFAULT '{}',
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- TENANT-SCOPED TABLES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tenant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    role user_role DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, user_id)
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES templates(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status site_status DEFAULT 'draft',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    seo JSONB DEFAULT '{}',
    sort_order INT DEFAULT 0,
    is_homepage BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(site_id, slug)
);

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    variant TEXT DEFAULT 'default',
    content JSONB NOT NULL DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT,
    alt_text TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE publishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    version INT NOT NULL,
    snapshot JSONB NOT NULL,
    changelog TEXT,
    published_by UUID,
    is_current BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(site_id, version)
);

CREATE TABLE domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    status domain_status DEFAULT 'pending',
    ssl_status TEXT DEFAULT 'pending',
    cf_hostname_id TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
    user_id UUID,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX idx_tenant_members_user ON tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant ON tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_lookup ON tenant_members(tenant_id, user_id);
CREATE INDEX idx_sites_tenant ON sites(tenant_id);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_tenant_status ON sites(tenant_id, status);
CREATE INDEX idx_sites_status_published ON sites(status) WHERE status = 'published';
CREATE INDEX idx_pages_site ON pages(site_id);
CREATE INDEX idx_pages_site_tenant ON pages(site_id, tenant_id);
CREATE INDEX idx_sections_page ON sections(page_id);
CREATE INDEX idx_sections_page_tenant ON sections(page_id, tenant_id);
CREATE INDEX idx_assets_tenant ON assets(tenant_id);
CREATE INDEX idx_assets_tenant_site ON assets(tenant_id, site_id);
CREATE INDEX idx_publishes_site ON publishes(site_id);
CREATE INDEX idx_publishes_site_current ON publishes(site_id, is_current) WHERE is_current = true;
CREATE INDEX idx_domains_site ON domains(site_id);
CREATE INDEX idx_domains_site_status ON domains(site_id, status);
CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- RLS ENABLE
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_registry ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.is_tenant_member(p_tenant_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM tenant_members
        WHERE tenant_id = p_tenant_id AND user_id = p_user_id
    );
$$;

CREATE OR REPLACE FUNCTION public.get_user_tenants(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT tenant_id FROM tenant_members WHERE user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.has_tenant_role(p_tenant_id UUID, p_user_id UUID, p_roles user_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM tenant_members
        WHERE tenant_id = p_tenant_id
          AND user_id = p_user_id
          AND role = ANY(p_roles)
    );
$$;

-- ═══════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════

-- Templates & Section Registry (public read)
CREATE POLICY "Anyone can view active templates"
    ON templates FOR SELECT
    USING (is_active = true);

CREATE POLICY "Anyone can view active sections"
    ON section_registry FOR SELECT
    USING (is_active = true);

-- Profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Tenants
CREATE POLICY "tenant_insert_policy"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "tenant_select_policy"
ON public.tenants
FOR SELECT
TO authenticated
USING (id IN (SELECT public.get_user_tenants(auth.uid())));

CREATE POLICY "tenant_update_policy"
ON public.tenants
FOR UPDATE
TO authenticated
USING (public.has_tenant_role(id, auth.uid(), ARRAY['owner']::user_role[]));

-- Tenant Members
CREATE POLICY "tenant_members_insert_policy"
ON public.tenant_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Members can view tenant members"
ON public.tenant_members
FOR SELECT
TO authenticated
USING (is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Owners/Admins can update members"
ON public.tenant_members
FOR UPDATE
TO authenticated
USING (has_tenant_role(tenant_id, auth.uid(), ARRAY['owner'::user_role, 'admin'::user_role]));

CREATE POLICY "Owners/Admins can delete members"
ON public.tenant_members
FOR DELETE
TO authenticated
USING (has_tenant_role(tenant_id, auth.uid(), ARRAY['owner'::user_role, 'admin'::user_role]));

-- Sites
CREATE POLICY "Members can view sites"
    ON sites FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage sites"
    ON sites FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

CREATE POLICY "Anyone can view published sites"
    ON sites FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- Pages
CREATE POLICY "Members can view pages"
    ON pages FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage pages"
    ON pages FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

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

-- Sections
CREATE POLICY "Members can view sections"
    ON sections FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage sections"
    ON sections FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

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

-- Assets
CREATE POLICY "Members can view assets"
    ON assets FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage assets"
    ON assets FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

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

-- Publishes
CREATE POLICY "Members can view publishes"
    ON publishes FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can create publishes"
    ON publishes FOR INSERT
    WITH CHECK (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

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

-- Domains
CREATE POLICY "Members can view domains"
    ON domains FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Admins can manage domains"
    ON domains FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin']::user_role[]));

CREATE POLICY "Anyone can lookup active domains"
    ON domains FOR SELECT
    TO anon, authenticated
    USING (status = 'active');

-- Audit Log
CREATE POLICY "Members can view audit log"
    ON audit_log FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "System can insert audit log"
    ON audit_log FOR INSERT
    WITH CHECK (public.is_tenant_member(tenant_id, auth.uid()));

-- ═══════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-create personal tenant for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_tenant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_tenant_id uuid;
BEGIN
  INSERT INTO public.tenants (name, slug)
  VALUES (
    'האתרים שלי',
    'user-' || substr(NEW.user_id::text, 1, 8)
  )
  RETURNING id INTO new_tenant_id;

  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (new_tenant_id, NEW.user_id, 'owner');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_create_tenant
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_tenant();

-- ═══════════════════════════════════════════════════════════════
-- REORDER SECTIONS RPC
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION reorder_sections(
  p_page_id UUID,
  p_section_orders JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  section_item JSONB;
BEGIN
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(p_section_orders) AS item
    WHERE NOT EXISTS (
      SELECT 1 FROM sections
      WHERE id = (item->>'id')::UUID
      AND page_id = p_page_id
    )
  ) THEN
    RAISE EXCEPTION 'One or more sections do not belong to the specified page';
  END IF;

  FOR section_item IN SELECT * FROM jsonb_array_elements(p_section_orders)
  LOOP
    UPDATE sections
    SET sort_order = (section_item->>'sort_order')::INT,
        updated_at = NOW()
    WHERE id = (section_item->>'id')::UUID
    AND page_id = p_page_id;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION reorder_sections(UUID, JSONB) TO authenticated;

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKET
-- ═══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

CREATE POLICY "Public assets are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

CREATE POLICY "Tenant members can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assets'
  AND auth.uid() IS NOT NULL
  AND public.is_tenant_member(
    (storage.foldername(name))[1]::uuid,
    auth.uid()
  )
);

CREATE POLICY "Tenant members can update assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assets'
  AND auth.uid() IS NOT NULL
  AND public.is_tenant_member(
    (storage.foldername(name))[1]::uuid,
    auth.uid()
  )
);

CREATE POLICY "Tenant editors can delete assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assets'
  AND auth.uid() IS NOT NULL
  AND public.has_tenant_role(
    (storage.foldername(name))[1]::uuid,
    auth.uid(),
    ARRAY['owner'::user_role, 'admin'::user_role, 'editor'::user_role]
  )
);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: Section Registry
-- ═══════════════════════════════════════════════════════════════

INSERT INTO section_registry (type, name, description, schema, default_content, supported_variants, icon) VALUES
('hero', 'Hero Section', 'Main banner with headline and CTA',
 '{"headline": "string", "subheadline": "string", "cta_primary": {"text": "string", "url": "string"}, "cta_secondary": {"text": "string", "url": "string"}, "background_image": "string", "overlay_opacity": "number"}',
 '{"headline": "ברוכים הבאים", "subheadline": "תיאור קצר של העסק שלך", "cta_primary": {"text": "צור קשר", "url": "#contact"}}',
 ARRAY['centered', 'split', 'video', 'minimal'], 'layout'),

('features', 'Features Section', 'Highlight key features or services',
 '{"title": "string", "subtitle": "string", "items": [{"icon": "string", "title": "string", "description": "string"}]}',
 '{"title": "השירותים שלנו", "subtitle": "מה אנחנו מציעים", "items": []}',
 ARRAY['grid', 'list', 'cards', 'icons'], 'grid'),

('gallery', 'Gallery Section', 'Image gallery or portfolio',
 '{"title": "string", "images": [{"src": "string", "alt": "string", "caption": "string"}]}',
 '{"title": "הגלריה שלנו", "images": []}',
 ARRAY['grid', 'masonry', 'carousel', 'lightbox'], 'image'),

('testimonials', 'Testimonials Section', 'Customer reviews and quotes',
 '{"title": "string", "items": [{"quote": "string", "author": "string", "role": "string", "avatar": "string"}]}',
 '{"title": "מה הלקוחות אומרים", "items": []}',
 ARRAY['carousel', 'grid', 'single', 'cards'], 'quote'),

('cta', 'Call to Action', 'Conversion-focused section',
 '{"headline": "string", "description": "string", "button": {"text": "string", "url": "string"}, "background_color": "string"}',
 '{"headline": "מוכנים להתחיל?", "description": "צרו איתנו קשר עוד היום", "button": {"text": "דברו איתנו", "url": "#contact"}}',
 ARRAY['simple', 'split', 'banner', 'floating'], 'megaphone'),

('contact', 'Contact Section', 'Contact form and information',
 '{"title": "string", "subtitle": "string", "email": "string", "phone": "string", "address": "string", "show_form": "boolean", "show_map": "boolean"}',
 '{"title": "צור קשר", "subtitle": "נשמח לשמוע ממך", "show_form": true, "show_map": false}',
 ARRAY['form', 'split', 'minimal', 'full'], 'mail'),

('about', 'About Section', 'Company or personal story',
 '{"title": "string", "content": "string", "image": "string", "stats": [{"value": "string", "label": "string"}]}',
 '{"title": "אודותינו", "content": "ספרו את הסיפור שלכם כאן"}',
 ARRAY['story', 'team', 'timeline', 'stats'], 'users'),

('footer', 'Footer Section', 'Site footer with links and info',
 '{"logo": "string", "tagline": "string", "links": [{"title": "string", "items": [{"text": "string", "url": "string"}]}], "social": [{"platform": "string", "url": "string"}], "copyright": "string"}',
 '{"copyright": "© 2025 כל הזכויות שמורות", "links": [], "social": []}',
 ARRAY['simple', 'columns', 'minimal', 'mega'], 'layout-grid'),

('stats', 'Stats Section', 'Display statistics and metrics',
 '{"title": "string", "subtitle": "string", "stats": [{"value": "number", "suffix": "string", "label": "string", "icon": "string"}]}',
 '{"title": "המספרים שלנו", "stats": []}',
 ARRAY['default', 'inline', 'minimal'], 'bar-chart'),

('pricing', 'Pricing Section', 'Pricing plans and comparison',
 '{"title": "string", "subtitle": "string", "plans": []}',
 '{"title": "תכניות מחירים", "subtitle": "בחרו את התכנית המתאימה"}',
 ARRAY['default', 'simple', 'comparison'], 'credit-card'),

('faq', 'FAQ Section', 'Frequently asked questions',
 '{"title": "string", "subtitle": "string", "items": [{"question": "string", "answer": "string"}]}',
 '{"title": "שאלות נפוצות", "items": []}',
 ARRAY['default', 'minimal', 'grid'], 'help-circle'),

('team', 'Team Section', 'Team member profiles',
 '{"title": "string", "subtitle": "string", "members": []}',
 '{"title": "הצוות שלנו", "members": []}',
 ARRAY['default', 'grid', 'cards'], 'users');

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA: Templates
-- ═══════════════════════════════════════════════════════════════

INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('restaurant-starter', 'מסעדה - בסיסי', 'restaurant', 'תבנית בסיסית לאתר מסעדה',
'{"meta":{"name":"","template_id":"restaurant-starter","language":"he","direction":"rtl"},"settings":{"colors":{"primary":"#D97706","secondary":"#78350F","accent":"#FCD34D"},"fonts":{"heading":"Heebo","body":"Heebo"}},"pages":[{"slug":"home","title":"דף הבית","sections":["hero","features","gallery","testimonials","cta","footer"]}]}', true),

('saas-modern', 'SaaS מודרני', 'saas', 'תבנית מודרנית למוצר SaaS',
'{"meta":{"name":"SaaS מודרני","template_id":"saas-modern","language":"he","direction":"rtl"},"settings":{"colors":{"primary":"#6366F1","secondary":"#1E1B4B","accent":"#06B6D4"},"fonts":{"heading":"Heebo","body":"Heebo"},"direction":"rtl"},"pages":[{"slug":"home","title":"דף הבית","sections":[{"type":"hero","variant":"default"},{"type":"features","variant":"default"},{"type":"stats","variant":"default"},{"type":"testimonials","variant":"default"},{"type":"pricing","variant":"default"},{"type":"faq","variant":"default"},{"type":"cta","variant":"default"},{"type":"footer","variant":"default"}]}]}', true),

('portfolio-minimal', 'פורטפוליו מינימלי', 'portfolio', 'תבנית נקייה לאנשי קריאייטיב',
'{"meta":{"name":"פורטפוליו מינימלי","template_id":"portfolio-minimal","language":"he","direction":"rtl"},"settings":{"colors":{"primary":"#18181B","secondary":"#27272A","accent":"#A1A1AA"},"fonts":{"heading":"Heebo","body":"Heebo"},"direction":"rtl"},"pages":[{"slug":"home","title":"דף הבית","sections":[{"type":"hero","variant":"minimal"},{"type":"gallery","variant":"masonry"},{"type":"about","variant":"team"},{"type":"testimonials","variant":"single"},{"type":"contact","variant":"minimal"},{"type":"footer","variant":"minimal"}]}]}', true),

('business-pro', 'עסקי מקצועי', 'business', 'תבנית מקצועית לעסקים',
'{"meta":{"name":"עסקי מקצועי","template_id":"business-pro","language":"he","direction":"rtl"},"settings":{"colors":{"primary":"#0F766E","secondary":"#134E4A","accent":"#2DD4BF"},"fonts":{"heading":"Heebo","body":"Heebo"},"direction":"rtl"},"pages":[{"slug":"home","title":"דף הבית","sections":[{"type":"hero","variant":"split"},{"type":"features","variant":"cards"},{"type":"stats","variant":"inline"},{"type":"about","variant":"default"},{"type":"testimonials","variant":"grid"},{"type":"cta","variant":"floating"},{"type":"footer","variant":"default"}]}]}', true),

('clinic-care', 'קליניקה מקצועית', 'clinic', 'תבנית לקליניקות ורופאים',
'{"meta":{"name":"קליניקה מקצועית","template_id":"clinic-care","language":"he","direction":"rtl"},"settings":{"colors":{"primary":"#0EA5E9","secondary":"#0C4A6E","accent":"#38BDF8"},"fonts":{"heading":"Heebo","body":"Heebo"},"direction":"rtl"},"pages":[{"slug":"home","title":"דף הבית","sections":[{"type":"hero","variant":"split"},{"type":"features","variant":"cards"},{"type":"team","variant":"default"},{"type":"testimonials","variant":"grid"},{"type":"faq","variant":"minimal"},{"type":"cta","variant":"floating"},{"type":"footer","variant":"default"}]}]}', true),

('landing-conversion', 'דף נחיתה ממיר', 'landing', 'דף נחיתה עם המרה גבוהה',
'{"meta":{"name":"דף נחיתה ממיר","template_id":"landing-conversion","language":"he","direction":"rtl"},"settings":{"colors":{"primary":"#7C3AED","secondary":"#1E1B4B","accent":"#F472B6"},"fonts":{"heading":"Heebo","body":"Heebo"},"direction":"rtl"},"pages":[{"slug":"home","title":"דף נחיתה","sections":[{"type":"hero","variant":"video"},{"type":"stats","variant":"inline"},{"type":"features","variant":"default"},{"type":"testimonials","variant":"default"},{"type":"pricing","variant":"simple"},{"type":"faq","variant":"grid"},{"type":"cta","variant":"default"},{"type":"footer","variant":"minimal"}]}]}', true),

('realestate-luxury', 'נדל"ן יוקרתי', 'realestate', 'תבנית יוקרתית לנדל"ן',
'{"meta":{"name":"נדלן יוקרתי","template_id":"realestate-luxury","language":"he","direction":"rtl"},"settings":{"colors":{"primary":"#B8860B","secondary":"#1C1917","accent":"#D4A853"},"fonts":{"heading":"Heebo","body":"Heebo"},"direction":"rtl"},"pages":[{"slug":"home","title":"דף הבית","sections":[{"type":"hero","variant":"video"},{"type":"features","variant":"minimal"},{"type":"gallery","variant":"carousel"},{"type":"stats","variant":"minimal"},{"type":"testimonials","variant":"single"},{"type":"cta","variant":"split"},{"type":"footer","variant":"simple"}]}]}', true);

-- Done!
SELECT 'Schema created successfully!' as status;
