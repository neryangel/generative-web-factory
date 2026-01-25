-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- RLS Policy: Anyone can view public assets
CREATE POLICY "Public assets are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'assets');

-- RLS Policy: Tenant members can upload assets to their tenant folder
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

-- RLS Policy: Tenant members can update their assets
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

-- RLS Policy: Tenant editors can delete assets
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