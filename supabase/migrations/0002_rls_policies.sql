-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. Policies for Products (Public)
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin')
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- 2. Policies for Profiles (Users manage their own, Admins manage all)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles" ON public.profiles
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin')
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- 3. Policies for Orders (Clients manage their own, Admins manage all)
DROP POLICY IF EXISTS "Clients can create their own orders" ON public.orders;
CREATE POLICY "Clients can create their own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can view their own orders" ON public.orders;
CREATE POLICY "Clients can view their own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
CREATE POLICY "Admins can manage orders" ON public.orders
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin')
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- 4. Policies for Order Items (Linked to Orders)
DROP POLICY IF EXISTS "Clients can create their own order items" ON public.order_items;
CREATE POLICY "Clients can create their own order items" ON public.order_items
FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id)
);

DROP POLICY IF EXISTS "Clients can view their own order items" ON public.order_items;
CREATE POLICY "Clients can view their own order items" ON public.order_items
FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id)
);

DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;
CREATE POLICY "Admins can manage order items" ON public.order_items
FOR ALL USING (public.get_user_role(auth.uid()) = 'admin')
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');