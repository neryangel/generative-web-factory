-- Drop the old trigger function that's causing issues
DROP FUNCTION IF EXISTS public.handle_new_tenant() CASCADE;