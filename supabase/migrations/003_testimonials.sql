-- Customer reviews / testimonials
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  location    text,
  rating      int check (rating between 1 and 5),
  quote       text not null,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table testimonials enable row level security;

-- Public visitors can read only approved reviews
create policy "public_read_approved_testimonials" on testimonials
  for select using (approved = true);

-- Signed-in owner (CRM) can read everything and manage all rows
create policy "auth_manage_testimonials" on testimonials
  for all to authenticated using (true) with check (true);

-- Note: public submissions come through the /api/review route using the
-- service role key (which bypasses RLS), always inserted as approved = false,
-- so no anon insert policy is needed here.
