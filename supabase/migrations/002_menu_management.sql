-- Menu categories
create table if not exists menu_categories (
  id          text primary key,
  title       text not null,
  tagline     text not null,
  label       text,
  sort_order  int not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Menu items
create table if not exists menu_items (
  id          uuid primary key default gen_random_uuid(),
  category_id text not null references menu_categories(id) on delete cascade,
  name        text not null,
  description text not null,
  price       text,
  image_url   text,
  featured    boolean not null default false,
  sort_order  int not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Enable RLS
alter table menu_categories enable row level security;
alter table menu_items enable row level security;

-- Public read
create policy "public_read_categories" on menu_categories
  for select using (true);
create policy "public_read_items" on menu_items
  for select using (true);

-- Authenticated write
create policy "auth_write_categories" on menu_categories
  for all using (auth.role() = 'authenticated');
create policy "auth_write_items" on menu_items
  for all using (auth.role() = 'authenticated');

-- Storage bucket for menu images
insert into storage.buckets (id, name, public)
  values ('menu-images', 'menu-images', true)
  on conflict (id) do nothing;

create policy "public_read_menu_images" on storage.objects
  for select using (bucket_id = 'menu-images');
create policy "auth_upload_menu_images" on storage.objects
  for insert with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');
create policy "auth_delete_menu_images" on storage.objects
  for delete using (bucket_id = 'menu-images' and auth.role() = 'authenticated');

-- Seed from static data
insert into menu_categories (id, title, tagline, label, sort_order) values
  ('premium-muffins', 'Premium Muffins', 'Baked from scratch in small batches, our muffins bring together fresh flavors, tender crumb, and the warmth of home in every bite.', '6-count minimum · $4.50 each', 1),
  ('porch-slice',     'Porch Slice',     'Signature triple-layer cake slices baked from scratch and layered with silky frosting or rich ganache. A little celebration in every bite.', null, 2),
  ('bread-box',       'The Bread Box',   'Each available as: $4 slice · $5 mini loaf · $10 whole large loaf.', null, 3),
  ('little-treats',   'Little Porch Light Treats', 'Sweet little things worth every bite.', null, 4),
  ('made-in-house',   'Made In House',   'Small-batch sauces and salsas made from scratch with bold Southwest flavors. Perfect for gifting or stocking your own kitchen.', null, 5)
on conflict (id) do nothing;

insert into menu_items (category_id, name, description, price, sort_order) values
  ('premium-muffins', 'Blueberry Morning Crumble',  'Plump blueberries, buttery crumb topping baked to a golden crunch.', null, 1),
  ('premium-muffins', 'Sunshine Lemon Poppy',       'Lemon zest and poppy seeds, moist and buttery, delicate lemon glaze.', null, 2),
  ('premium-muffins', 'Chocolate Hearth',            'Deep chocolate, tender bakery crumb, loaded with chocolate chips.', null, 3),
  ('porch-slice',     'Midnight Chocolate',          'Black cocoa cake, chocolate ganache, chocolate sprinkles.', '$6/slice · $27 for 5', 1),
  ('porch-slice',     'Garden Gate Carrot Cake',     'Pineapple, carrots, walnuts, cream cheese frosting.', '$6.50/slice · $30 for 5', 2),
  ('porch-slice',     'Honeysuckle White',           'Soft white/vanilla cake, vanilla buttercream.', '$6/slice · $27 for 5', 3),
  ('bread-box',       'Rocking Chair Banana Bread',  'Soft banana bread packed with pecans, baked golden.', null, 1),
  ('bread-box',       'Fresh Squeezed Lemon Loaf',   'Moist lemon loaf, fresh juice and zest, lemon glaze.', null, 2),
  ('little-treats',   'Front Porch Fudge Brownie',   'Large fudge brownie, chocolate chips, dense chewy center.', '$5 each', 1),
  ('little-treats',   'Campfire Crispies',            'Oversized crispy treats, buttery marshmallow, extra marshmallow on top.', '$4 each', 2),
  ('little-treats',   'Fresh Baked Porch Cookies',   'Oversized chocolate chip, crisp edges, chewy center.', '$3.50 each · 12 for $40', 3),
  ('made-in-house',   'Midnight Ember Red Chili Sauce', 'Slow-simmered NM red chili sauce with deep, smoky heat. Great on everything from eggs to enchiladas.', '8oz $6 · 16oz $12 · 32oz $20', 1),
  ('made-in-house',   'High Desert Heat Salsa',      'Fresh made hot salsa — bold, spicy, and packed with flavor.', 'Pint 16oz $8 · Quart 32oz $14', 2),
  ('made-in-house',   'Copper Canyon Salsa',         'Fresh made medium salsa — a perfect balance of heat and freshness.', 'Pint 16oz $8 · Quart 32oz $14', 3),
  ('made-in-house',   'Lantern Glow Salsa',          'Fresh made mild salsa — bright, flavorful, gentle on the heat.', 'Pint 16oz $8 · Quart 32oz $14', 4);
