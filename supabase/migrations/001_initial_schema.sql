-- Chef's Choice by Maison Solange — initial schema + RLS
-- Apply via Supabase SQL editor or: supabase db push

create extension if not exists "pgcrypto";

do $$ begin
  create type user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('card', 'mobile_money', 'cod', 'whatsapp');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending', 'processing', 'succeeded', 'failed', 'refunded');
exception when duplicate_object then null; end $$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade unique,
  created_at timestamptz not null default now()
);

-- Settings & delivery
create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  fee_ghs numeric(12,2) not null default 0,
  free_over_ghs numeric(12,2),
  eta_hours_min int default 24,
  eta_hours_max int default 48,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id uuid references public.categories (id) on delete set null,
  sort_order int not null default 0,
  is_future_collection boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  price numeric(12,2) not null,
  compare_at_price numeric(12,2),
  sku text not null unique,
  stock int not null default 0,
  category_id uuid references public.categories (id) on delete set null,
  material text,
  dimensions text,
  weight text,
  featured boolean not null default false,
  best_seller boolean not null default false,
  care_instructions text,
  shipping_info text,
  tags text[] default '{}',
  rating numeric(3,2) default 0,
  review_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Customers (extends profile for CRM; optional duplicate of profile id)
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null unique,
  email text,
  phone text,
  notes text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null default 'Accra',
  region text,
  country text not null default 'GH',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Carts (authenticated; guests use client cart until login — or service-role API)
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade unique,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  wishlist_id uuid not null references public.wishlists (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (wishlist_id, product_id)
);

-- Coupons
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  percent_off int check (percent_off is null or (percent_off > 0 and percent_off <= 100)),
  amount_off_ghs numeric(12,2),
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  max_redemptions int,
  redemption_count int not null default 0,
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  email text,
  phone text,
  status order_status not null default 'pending',
  subtotal_ghs numeric(12,2) not null,
  shipping_ghs numeric(12,2) not null default 0,
  tax_ghs numeric(12,2) not null default 0,
  discount_ghs numeric(12,2) not null default 0,
  total_ghs numeric(12,2) not null,
  coupon_id uuid references public.coupons (id) on delete set null,
  delivery_zone_id uuid references public.delivery_zones (id) on delete set null,
  shipping_address jsonb not null default '{}',
  notes text,
  whatsapp_thread_hint text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name_snapshot text not null,
  sku_snapshot text,
  unit_price_ghs numeric(12,2) not null,
  quantity int not null check (quantity > 0)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  provider text not null,
  method payment_method not null,
  status payment_status not null default 'pending',
  amount_ghs numeric(12,2) not null,
  currency text not null default 'GHS',
  stripe_payment_intent_id text,
  mobile_money_phone text,
  mobile_money_reference text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Content
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  author_name text,
  rating int not null check (rating >= 1 and rating <= 5),
  title text,
  body text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  subtitle text,
  image_url text,
  rating int check (rating is null or (rating >= 1 and rating <= 5)),
  featured boolean not null default false,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text,
  subtitle text,
  body jsonb not null default '{}',
  active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_profiles_updated on public.profiles;
create trigger tr_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists tr_products_updated on public.products;
create trigger tr_products_updated before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists tr_orders_updated on public.orders;
create trigger tr_orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.customers enable row level security;
alter table public.coupons enable row level security;
alter table public.settings enable row level security;
alter table public.delivery_zones enable row level security;

-- Helper: is admin
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p where p.id = uid and p.role = 'admin'
  );
$$;

-- Profiles: users manage self
create policy profiles_select_self on public.profiles for select using (auth.uid() = id or public.is_admin(auth.uid()));
create policy profiles_update_self on public.profiles for update using (auth.uid() = id or public.is_admin(auth.uid()));

-- Public read catalogs
create policy categories_public_read on public.categories for select using (true);
create policy products_public_read on public.products for select using (true);
create policy product_images_public_read on public.product_images for select using (true);
create policy faqs_public_read on public.faqs for select using (active = true);
create policy testimonials_public_read on public.testimonials for select using (active = true);
create policy homepage_public_read on public.homepage_sections for select using (active = true);
create policy delivery_zones_public_read on public.delivery_zones for select using (active = true);
create policy reviews_public_read on public.reviews for select using (approved = true);

-- Admin write for merchandising/content
create policy categories_admin_all on public.categories for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy products_admin_all on public.products for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy product_images_admin_all on public.product_images for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy faqs_admin_all on public.faqs for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy testimonials_admin_all on public.testimonials for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy homepage_admin_all on public.homepage_sections for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy coupons_admin_all on public.coupons for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy settings_admin_all on public.settings for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy delivery_zones_admin_all on public.delivery_zones for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy orders_admin_all on public.orders for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy order_items_admin_all on public.order_items for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy payments_admin_all on public.payments for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy customers_admin_all on public.customers for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy reviews_admin_moderate on public.reviews for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- Reviews: insert by authenticated users
create policy reviews_insert_auth on public.reviews for insert with check (auth.uid() = user_id);

-- Carts (authenticated users)
create policy carts_all_owner on public.carts for all using (user_id = auth.uid() or public.is_admin(auth.uid())) with check (user_id = auth.uid() or public.is_admin(auth.uid()));

create policy cart_items_by_cart on public.cart_items for all using (
  exists (select 1 from public.carts c where c.id = cart_id and (c.user_id = auth.uid() or public.is_admin(auth.uid())))
)
with check (
  exists (select 1 from public.carts c where c.id = cart_id and (c.user_id = auth.uid() or public.is_admin(auth.uid())))
);

-- Wishlist
create policy wishlists_owner on public.wishlists for all using (user_id = auth.uid() or public.is_admin(auth.uid())) with check (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy wishlist_items_owner on public.wishlist_items for all using (
  exists (select 1 from public.wishlists w where w.id = wishlist_id and (w.user_id = auth.uid() or public.is_admin(auth.uid())))
)
with check (
  exists (select 1 from public.wishlists w where w.id = wishlist_id and (w.user_id = auth.uid() or public.is_admin(auth.uid())))
);

-- Addresses
create policy addresses_owner on public.addresses for all using (user_id = auth.uid() or public.is_admin(auth.uid())) with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Orders: customer sees own
create policy orders_select on public.orders for select using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy orders_insert_customer on public.orders for insert with check (auth.uid() is not null and user_id = auth.uid());

create policy order_items_select on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin(auth.uid())))
);

create policy payments_select on public.payments for select using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin(auth.uid())))
);

-- Newsletter
create policy newsletter_insert on public.newsletter_subscribers for insert with check (true);
create policy newsletter_admin on public.newsletter_subscribers for select using (public.is_admin(auth.uid()));

-- Storage bucket policy placeholder (create bucket `product-images` in dashboard)
-- profiles trigger on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'customer');
  insert into public.customers (user_id, email, phone, marketing_opt_in)
  values (
    new.id,
    new.email,
    coalesce(new.phone, new.raw_user_meta_data->>'phone', ''),
    false
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
