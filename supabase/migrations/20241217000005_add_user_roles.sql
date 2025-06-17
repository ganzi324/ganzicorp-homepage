-- Add user roles system
-- Create user_roles enum type
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- Add role column to auth.users table via profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Super admins can update any profile
CREATE POLICY "Super admins can update any profile" ON public.profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Function to handle user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = user_id AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS user_role AS $$
DECLARE
    user_role_result user_role;
BEGIN
    SELECT role INTO user_role_result 
    FROM public.profiles 
    WHERE id = user_id;
    
    RETURN COALESCE(user_role_result, 'user'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update notices table to use proper author_id
ALTER TABLE public.notices 
ALTER COLUMN author_id TYPE UUID USING author_id::UUID;

-- Add foreign key constraint
ALTER TABLE public.notices 
ADD CONSTRAINT notices_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Update notices policies to use role-based access
DROP POLICY IF EXISTS "Anyone can view published notices" ON public.notices;
DROP POLICY IF EXISTS "Admins can manage notices" ON public.notices;

-- Anyone can view published notices
CREATE POLICY "Anyone can view published notices" ON public.notices
    FOR SELECT USING (published = true);

-- Admins can view all notices
CREATE POLICY "Admins can view all notices" ON public.notices
    FOR SELECT USING (public.is_admin());

-- Admins can insert notices
CREATE POLICY "Admins can insert notices" ON public.notices
    FOR INSERT WITH CHECK (public.is_admin());

-- Admins can update notices
CREATE POLICY "Admins can update notices" ON public.notices
    FOR UPDATE USING (public.is_admin());

-- Admins can delete notices
CREATE POLICY "Admins can delete notices" ON public.notices
    FOR DELETE USING (public.is_admin());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Insert a default admin user (will be updated with real credentials)
-- This is just for testing purposes
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
) VALUES (
    gen_random_uuid(),
    'admin@ganzicorp.com',
    crypt('admin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Set the admin role for the admin user
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
    id,
    email,
    'GanziCorp Admin',
    'super_admin'::user_role
FROM auth.users 
WHERE email = 'admin@ganzicorp.com'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin'::user_role; 