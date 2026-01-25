-- First, drop the existing problematic trigger on tenants
DROP TRIGGER IF EXISTS on_new_tenant ON public.tenants;

-- Update the handle_new_tenant function to accept user_id as parameter from the tenant insert
-- Since the existing trigger causes issues, we'll handle tenant_members creation differently

-- Create trigger function to automatically create a personal tenant for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_tenant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_tenant_id uuid;
BEGIN
  -- Create a personal tenant for the new user
  INSERT INTO public.tenants (name, slug)
  VALUES (
    'האתרים שלי',
    'user-' || substr(NEW.user_id::text, 1, 8)
  )
  RETURNING id INTO new_tenant_id;
  
  -- Add the user as owner of the tenant (using NEW.user_id from profiles trigger)
  INSERT INTO public.tenant_members (tenant_id, user_id, role)
  VALUES (new_tenant_id, NEW.user_id, 'owner');
  
  RETURN NEW;
END;
$$;

-- Create trigger to run after user profile is created
DROP TRIGGER IF EXISTS on_profile_created_create_tenant ON public.profiles;
CREATE TRIGGER on_profile_created_create_tenant
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_tenant();