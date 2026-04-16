create schema if not exists private;

create or replace function private.current_app_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.users
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function private.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.users
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function private.current_customer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select c.id
  from public.customers c
  join public.users u on u.id = c.user_id
  where u.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function private.current_technician_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select t.id
  from public.technicians t
  join public.users u on u.id = t.user_id
  where u.auth_user_id = auth.uid()
  limit 1
$$;

grant usage on schema private to authenticated;
grant execute on function private.current_app_user_id() to authenticated;
grant execute on function private.current_app_role() to authenticated;
grant execute on function private.current_customer_id() to authenticated;
grant execute on function private.current_technician_id() to authenticated;

alter table public.users enable row level security;
alter table public.customers enable row level security;
alter table public.technicians enable row level security;
alter table public.admins enable row level security;
alter table public.properties enable row level security;
alter table public.membership_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.service_requests enable row level security;
alter table public.technician_assignments enable row level security;
alter table public.quotes enable row level security;
alter table public.notes enable row level security;
alter table public.notifications enable row level security;
alter table public.billing_records enable row level security;
alter table public.plan_usage enable row level security;
alter table public.fair_use_flags enable row level security;
alter table public.settings enable row level security;

drop policy if exists "users read own or admin" on public.users;
create policy "users read own or admin"
on public.users
for select
to authenticated
using (id = private.current_app_user_id() or private.current_app_role() = 'admin');

drop policy if exists "users update own or admin" on public.users;
create policy "users update own or admin"
on public.users
for update
to authenticated
using (id = private.current_app_user_id() or private.current_app_role() = 'admin')
with check (id = private.current_app_user_id() or private.current_app_role() = 'admin');

drop policy if exists "customers read own assigned or admin" on public.customers;
create policy "customers read own assigned or admin"
on public.customers
for select
to authenticated
using (
  user_id = private.current_app_user_id()
  or private.current_app_role() = 'admin'
  or exists (
    select 1
    from public.service_requests sr
    join public.technician_assignments ta on ta.service_request_id = sr.id
    where sr.customer_id = customers.id
      and ta.technician_id = private.current_technician_id()
  )
);

drop policy if exists "customers update own or admin" on public.customers;
create policy "customers update own or admin"
on public.customers
for update
to authenticated
using (user_id = private.current_app_user_id() or private.current_app_role() = 'admin')
with check (user_id = private.current_app_user_id() or private.current_app_role() = 'admin');

drop policy if exists "technicians read own or admin" on public.technicians;
create policy "technicians read own or admin"
on public.technicians
for select
to authenticated
using (user_id = private.current_app_user_id() or private.current_app_role() = 'admin');

drop policy if exists "technicians update own or admin" on public.technicians;
create policy "technicians update own or admin"
on public.technicians
for update
to authenticated
using (user_id = private.current_app_user_id() or private.current_app_role() = 'admin')
with check (user_id = private.current_app_user_id() or private.current_app_role() = 'admin');

drop policy if exists "admins read own" on public.admins;
create policy "admins read own"
on public.admins
for select
to authenticated
using (user_id = private.current_app_user_id() or private.current_app_role() = 'admin');

drop policy if exists "properties read own assigned or admin" on public.properties;
create policy "properties read own assigned or admin"
on public.properties
for select
to authenticated
using (
  private.current_app_role() = 'admin'
  or exists (
    select 1
    from public.customers c
    where c.id = properties.customer_id
      and c.user_id = private.current_app_user_id()
  )
  or exists (
    select 1
    from public.service_requests sr
    join public.technician_assignments ta on ta.service_request_id = sr.id
    where sr.property_id = properties.id
      and ta.technician_id = private.current_technician_id()
  )
);

drop policy if exists "properties update own or admin" on public.properties;
create policy "properties update own or admin"
on public.properties
for update
to authenticated
using (
  private.current_app_role() = 'admin'
  or exists (
    select 1
    from public.customers c
    where c.id = properties.customer_id
      and c.user_id = private.current_app_user_id()
  )
)
with check (
  private.current_app_role() = 'admin'
  or exists (
    select 1
    from public.customers c
    where c.id = properties.customer_id
      and c.user_id = private.current_app_user_id()
  )
);

drop policy if exists "plans readable by authenticated users" on public.membership_plans;
create policy "plans readable by authenticated users"
on public.membership_plans
for select
to authenticated
using (status = 'active' or private.current_app_role() = 'admin');

drop policy if exists "plans editable by admin" on public.membership_plans;
create policy "plans editable by admin"
on public.membership_plans
for update
to authenticated
using (private.current_app_role() = 'admin')
with check (private.current_app_role() = 'admin');

drop policy if exists "subscriptions read own assigned or admin" on public.subscriptions;
create policy "subscriptions read own assigned or admin"
on public.subscriptions
for select
to authenticated
using (
  private.current_app_role() = 'admin'
  or customer_id = private.current_customer_id()
  or exists (
    select 1
    from public.service_requests sr
    join public.technician_assignments ta on ta.service_request_id = sr.id
    where sr.subscription_id = subscriptions.id
      and ta.technician_id = private.current_technician_id()
  )
);

drop policy if exists "service requests read own assigned or admin" on public.service_requests;
create policy "service requests read own assigned or admin"
on public.service_requests
for select
to authenticated
using (
  private.current_app_role() = 'admin'
  or customer_id = private.current_customer_id()
  or exists (
    select 1
    from public.technician_assignments ta
    where ta.service_request_id = service_requests.id
      and ta.technician_id = private.current_technician_id()
  )
);

drop policy if exists "customers create own service requests" on public.service_requests;
create policy "customers create own service requests"
on public.service_requests
for insert
to authenticated
with check (
  customer_id = private.current_customer_id()
  and exists (
    select 1
    from public.properties p
    where p.id = service_requests.property_id
      and p.customer_id = private.current_customer_id()
  )
  and exists (
    select 1
    from public.subscriptions s
    where s.id = service_requests.subscription_id
      and s.customer_id = private.current_customer_id()
  )
);

drop policy if exists "customers update own service requests" on public.service_requests;
create policy "customers update own service requests"
on public.service_requests
for update
to authenticated
using (customer_id = private.current_customer_id())
with check (customer_id = private.current_customer_id());

drop policy if exists "technicians update assigned requests" on public.service_requests;
create policy "technicians update assigned requests"
on public.service_requests
for update
to authenticated
using (
  exists (
    select 1
    from public.technician_assignments ta
    where ta.service_request_id = service_requests.id
      and ta.technician_id = private.current_technician_id()
  )
)
with check (
  exists (
    select 1
    from public.technician_assignments ta
    where ta.service_request_id = service_requests.id
      and ta.technician_id = private.current_technician_id()
  )
);

drop policy if exists "admins update service requests" on public.service_requests;
create policy "admins update service requests"
on public.service_requests
for update
to authenticated
using (private.current_app_role() = 'admin')
with check (private.current_app_role() = 'admin');

drop policy if exists "assignments read own or admin" on public.technician_assignments;
create policy "assignments read own or admin"
on public.technician_assignments
for select
to authenticated
using (technician_id = private.current_technician_id() or private.current_app_role() = 'admin');

drop policy if exists "assignments update own or admin" on public.technician_assignments;
create policy "assignments update own or admin"
on public.technician_assignments
for update
to authenticated
using (technician_id = private.current_technician_id() or private.current_app_role() = 'admin')
with check (technician_id = private.current_technician_id() or private.current_app_role() = 'admin');

drop policy if exists "assignments insert admin only" on public.technician_assignments;
create policy "assignments insert admin only"
on public.technician_assignments
for insert
to authenticated
with check (private.current_app_role() = 'admin');

drop policy if exists "quotes read own assigned or admin" on public.quotes;
create policy "quotes read own assigned or admin"
on public.quotes
for select
to authenticated
using (
  private.current_app_role() = 'admin'
  or customer_id = private.current_customer_id()
  or exists (
    select 1
    from public.technician_assignments ta
    where ta.service_request_id = quotes.service_request_id
      and ta.technician_id = private.current_technician_id()
  )
);

drop policy if exists "quotes admin manage" on public.quotes;
create policy "quotes admin manage"
on public.quotes
for all
to authenticated
using (private.current_app_role() = 'admin')
with check (private.current_app_role() = 'admin');

drop policy if exists "notes read relevant users" on public.notes;
create policy "notes read relevant users"
on public.notes
for select
to authenticated
using (
  private.current_app_role() = 'admin'
  or author_user_id = private.current_app_user_id()
  or (
    visibility <> 'internal'
    and customer_id = private.current_customer_id()
  )
  or exists (
    select 1
    from public.technician_assignments ta
    where ta.service_request_id = notes.service_request_id
      and ta.technician_id = private.current_technician_id()
  )
);

drop policy if exists "notes insert admin or technician" on public.notes;
create policy "notes insert admin or technician"
on public.notes
for insert
to authenticated
with check (
  private.current_app_role() = 'admin'
  or author_user_id = private.current_app_user_id()
);

drop policy if exists "notifications read own" on public.notifications;
create policy "notifications read own"
on public.notifications
for select
to authenticated
using (user_id = private.current_app_user_id() or private.current_app_role() = 'admin');

drop policy if exists "notifications update own" on public.notifications;
create policy "notifications update own"
on public.notifications
for update
to authenticated
using (user_id = private.current_app_user_id() or private.current_app_role() = 'admin')
with check (user_id = private.current_app_user_id() or private.current_app_role() = 'admin');

drop policy if exists "notifications insert admin" on public.notifications;
create policy "notifications insert admin"
on public.notifications
for insert
to authenticated
with check (private.current_app_role() = 'admin');

drop policy if exists "billing records read own or admin" on public.billing_records;
create policy "billing records read own or admin"
on public.billing_records
for select
to authenticated
using (
  private.current_app_role() = 'admin'
  or exists (
    select 1
    from public.subscriptions s
    where s.id = billing_records.subscription_id
      and s.customer_id = private.current_customer_id()
  )
);

drop policy if exists "plan usage read own or admin" on public.plan_usage;
create policy "plan usage read own or admin"
on public.plan_usage
for select
to authenticated
using (
  private.current_app_role() = 'admin'
  or exists (
    select 1
    from public.subscriptions s
    where s.id = plan_usage.subscription_id
      and s.customer_id = private.current_customer_id()
  )
);

drop policy if exists "fair use read own assigned or admin" on public.fair_use_flags;
create policy "fair use read own assigned or admin"
on public.fair_use_flags
for select
to authenticated
using (
  private.current_app_role() = 'admin'
  or customer_id = private.current_customer_id()
  or exists (
    select 1
    from public.technician_assignments ta
    where ta.service_request_id = fair_use_flags.service_request_id
      and ta.technician_id = private.current_technician_id()
  )
);

drop policy if exists "fair use admin manage" on public.fair_use_flags;
create policy "fair use admin manage"
on public.fair_use_flags
for all
to authenticated
using (private.current_app_role() = 'admin')
with check (private.current_app_role() = 'admin');

drop policy if exists "settings admin only" on public.settings;
create policy "settings admin only"
on public.settings
for all
to authenticated
using (private.current_app_role() = 'admin')
with check (private.current_app_role() = 'admin');

drop policy if exists "service request photos read relevant users" on public.service_request_photos;
create policy "service request photos read relevant users"
on public.service_request_photos
for select
to authenticated
using (
  exists (
    select 1
    from public.service_requests sr
    where sr.id = service_request_photos.service_request_id
      and (
        private.current_app_role() = 'admin'
        or sr.customer_id = private.current_customer_id()
        or exists (
          select 1
          from public.technician_assignments ta
          where ta.service_request_id = sr.id
            and ta.technician_id = private.current_technician_id()
        )
      )
  )
);

drop policy if exists "service request photos insert own customer" on public.service_request_photos;
create policy "service request photos insert own customer"
on public.service_request_photos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.service_requests sr
    where sr.id = service_request_photos.service_request_id
      and sr.customer_id = private.current_customer_id()
  )
);

drop policy if exists "staff can view service request photos in storage" on storage.objects;
create policy "staff can view service request photos in storage"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'service-request-photos'
  and (
    private.current_app_role() = 'admin'
    or private.current_app_role() = 'technician'
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);
