-- Porch Light Flavor Co. — initial schema
-- Run this in the Supabase SQL editor (Database > SQL Editor > New query)

-- Enable the pgcrypto extension if not already enabled (provides gen_random_uuid)
create extension if not exists pgcrypto;

-- ============================================================
-- orders table
-- ============================================================
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  name            text not null,
  email           text not null,
  phone           text not null,
  interests       text[] not null default '{}',
  product_details text,
  quantity        text,
  desired_date    date,
  fulfillment     text,        -- 'Pickup' | 'Delivery' | 'Not sure yet'
  event_type      text,
  notes           text,
  payment_method  text,
  status          text not null default 'new_request',
  internal_notes  text
);

-- Add a check constraint for valid status values
alter table public.orders
  add constraint orders_status_check check (
    status in (
      'new_request',
      'needs_followup',
      'quote_sent',
      'payment_pending',
      'confirmed',
      'in_progress',
      'ready',
      'completed',
      'cancelled'
    )
  );

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.orders enable row level security;

-- Anon role: INSERT only (public order form)
create policy "anon_insert_orders"
  on public.orders
  for insert
  to anon
  with check (true);

-- Authenticated role: SELECT (CRM dashboard)
create policy "auth_select_orders"
  on public.orders
  for select
  to authenticated
  using (true);

-- Authenticated role: UPDATE (move cards, edit notes)
create policy "auth_update_orders"
  on public.orders
  for update
  to authenticated
  using (true)
  with check (true);

-- Service role bypasses RLS by default (used by the API route)
