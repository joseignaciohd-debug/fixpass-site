create table if not exists public.waitlist_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  city text,
  address_line_1 text,
  details text not null,
  source text not null default 'website',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.waitlist_leads enable row level security;

drop policy if exists "admins can manage waitlist leads" on public.waitlist_leads;
create policy "admins can manage waitlist leads"
on public.waitlist_leads
for all
to authenticated
using (private.current_app_role() = 'admin')
with check (private.current_app_role() = 'admin');
