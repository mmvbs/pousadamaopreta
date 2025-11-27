-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'guest');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy for user_roles (users can view their own role)
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view and manage all roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is staff or admin
CREATE OR REPLACE FUNCTION public.is_staff_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'staff')
  )
$$;

-- Drop existing policies and create new secure ones

-- HOSPEDES table policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users on hospedes" ON public.hospedes;

CREATE POLICY "Only staff and admin can view hospedes"
ON public.hospedes
FOR SELECT
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can insert hospedes"
ON public.hospedes
FOR INSERT
WITH CHECK (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can update hospedes"
ON public.hospedes
FOR UPDATE
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can delete hospedes"
ON public.hospedes
FOR DELETE
USING (public.is_staff_or_admin(auth.uid()));

-- QUARTOS table policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users on quartos" ON public.quartos;

CREATE POLICY "Only staff and admin can view quartos"
ON public.quartos
FOR SELECT
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can insert quartos"
ON public.quartos
FOR INSERT
WITH CHECK (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can update quartos"
ON public.quartos
FOR UPDATE
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can delete quartos"
ON public.quartos
FOR DELETE
USING (public.is_staff_or_admin(auth.uid()));

-- RESERVAS table policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users on reservas" ON public.reservas;

CREATE POLICY "Only staff and admin can view reservas"
ON public.reservas
FOR SELECT
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can insert reservas"
ON public.reservas
FOR INSERT
WITH CHECK (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can update reservas"
ON public.reservas
FOR UPDATE
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can delete reservas"
ON public.reservas
FOR DELETE
USING (public.is_staff_or_admin(auth.uid()));

-- PAGAMENTOS table policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users on pagamentos" ON public.pagamentos;

CREATE POLICY "Only staff and admin can view pagamentos"
ON public.pagamentos
FOR SELECT
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can insert pagamentos"
ON public.pagamentos
FOR INSERT
WITH CHECK (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can update pagamentos"
ON public.pagamentos
FOR UPDATE
USING (public.is_staff_or_admin(auth.uid()));

CREATE POLICY "Only staff and admin can delete pagamentos"
ON public.pagamentos
FOR DELETE
USING (public.is_staff_or_admin(auth.uid()));

-- Create trigger to automatically assign 'staff' role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'staff');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();