-- ═══════════════════════════════════════════════════════════════
-- AMDIR Multi-Tenant Site Builder - Phase 1: Foundation Schema
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════

CREATE TYPE site_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE domain_status AS ENUM ('pending', 'verifying', 'active', 'failed');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

-- ═══════════════════════════════════════════
-- GLOBAL TABLES (no tenant_id - system-wide)
-- ═══════════════════════════════════════════

-- Templates: Global, managed by system admins
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

-- Section Registry: Available section types
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

-- ═══════════════════════════════════════════
-- TENANT-SCOPED TABLES (RLS enforced)
-- ═══════════════════════════════════════════

-- Tenants: Organizations/accounts
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tenant Members: User-to-Tenant mapping with roles
CREATE TABLE tenant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    user_id UUID NOT NULL,
    role user_role DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, user_id)
);

-- User Profiles: Additional user data
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sites: Websites owned by tenants
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    template_id UUID REFERENCES templates(id),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    status site_status DEFAULT 'draft',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tenant_id, slug)
);

-- Pages: Pages within sites
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

-- Sections: Content blocks within pages
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

-- Assets: Media files (images, documents, etc.)
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

-- Publishes: Published versions/snapshots
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

-- Domains: Custom domains for sites
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

-- Audit Log: Track all changes
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

-- ═══════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════

CREATE INDEX idx_tenant_members_user ON tenant_members(user_id);
CREATE INDEX idx_tenant_members_tenant ON tenant_members(tenant_id);
CREATE INDEX idx_sites_tenant ON sites(tenant_id);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_pages_site ON pages(site_id);
CREATE INDEX idx_sections_page ON sections(page_id);
CREATE INDEX idx_assets_tenant ON assets(tenant_id);
CREATE INDEX idx_publishes_site ON publishes(site_id);
CREATE INDEX idx_domains_site ON domains(site_id);
CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- ═══════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════

-- Enable RLS on all tenant-scoped tables
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

-- Helper function: Check if user is member of tenant
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

-- Helper function: Get user's tenants
CREATE OR REPLACE FUNCTION public.get_user_tenants(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT tenant_id FROM tenant_members WHERE user_id = p_user_id;
$$;

-- Helper function: Check if user has role in tenant
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

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Tenants policies
CREATE POLICY "Users can view their tenants"
    ON tenants FOR SELECT
    USING (id IN (SELECT public.get_user_tenants(auth.uid())));

CREATE POLICY "Users can create tenants"
    ON tenants FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Owners can update tenants"
    ON tenants FOR UPDATE
    USING (public.has_tenant_role(id, auth.uid(), ARRAY['owner']::user_role[]));

-- Tenant Members policies
CREATE POLICY "Members can view tenant members"
    ON tenant_members FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Owners/Admins can manage members"
    ON tenant_members FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin']::user_role[]));

-- Sites policies
CREATE POLICY "Members can view sites"
    ON sites FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage sites"
    ON sites FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Pages policies
CREATE POLICY "Members can view pages"
    ON pages FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage pages"
    ON pages FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Sections policies
CREATE POLICY "Members can view sections"
    ON sections FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage sections"
    ON sections FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Assets policies
CREATE POLICY "Members can view assets"
    ON assets FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can manage assets"
    ON assets FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Publishes policies
CREATE POLICY "Members can view publishes"
    ON publishes FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Editors can create publishes"
    ON publishes FOR INSERT
    WITH CHECK (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin', 'editor']::user_role[]));

-- Domains policies
CREATE POLICY "Members can view domains"
    ON domains FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "Admins can manage domains"
    ON domains FOR ALL
    USING (public.has_tenant_role(tenant_id, auth.uid(), ARRAY['owner', 'admin']::user_role[]));

-- Audit Log policies
CREATE POLICY "Members can view audit log"
    ON audit_log FOR SELECT
    USING (public.is_tenant_member(tenant_id, auth.uid()));

CREATE POLICY "System can insert audit log"
    ON audit_log FOR INSERT
    WITH CHECK (public.is_tenant_member(tenant_id, auth.uid()));

-- ═══════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Auto-add creator as owner when tenant is created
CREATE OR REPLACE FUNCTION public.handle_new_tenant()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.tenant_members (tenant_id, user_id, role)
    VALUES (NEW.id, auth.uid(), 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_tenant_created
    AFTER INSERT ON tenants
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_tenant();

-- ═══════════════════════════════════════════
-- SEED DATA: Default Section Registry
-- ═══════════════════════════════════════════

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
 ARRAY['simple', 'columns', 'minimal', 'mega'], 'layout-grid');

-- ═══════════════════════════════════════════
-- SEED DATA: Default Template (Restaurant)
-- ═══════════════════════════════════════════

INSERT INTO templates (slug, name, category, description, blueprint_schema, is_active) VALUES
('restaurant-starter', 'מסעדה - בסיסי', 'restaurant', 'תבנית בסיסית לאתר מסעדה עם תפריט, גלריה וצור קשר',
'{
  "meta": {
    "name": "",
    "template_id": "restaurant-starter",
    "language": "he",
    "direction": "rtl"
  },
  "settings": {
    "colors": {
      "primary": "#D97706",
      "secondary": "#78350F",
      "accent": "#FCD34D",
      "background": "#FFFBEB",
      "text": "#1F2937"
    },
    "fonts": {
      "heading": "Heebo",
      "body": "Heebo"
    }
  },
  "pages": [
    {
      "slug": "home",
      "title": "דף הבית",
      "sections": ["hero", "features", "gallery", "testimonials", "cta", "footer"]
    },
    {
      "slug": "menu",
      "title": "תפריט",
      "sections": ["hero", "features", "footer"]
    },
    {
      "slug": "contact",
      "title": "צור קשר",
      "sections": ["contact", "footer"]
    }
  ]
}', true);