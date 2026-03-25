-- Lock down admin_users (was created without RLS in 001)
alter table public.admin_users enable row level security;

drop policy if exists admin_users_select_admin on public.admin_users;

-- Only admins can read who is in admin_users; writes stay service-role / SQL only
create policy admin_users_select_admin on public.admin_users
  for select
  using (public.is_admin(auth.uid()));
