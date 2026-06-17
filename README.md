# Porch Light Flavor Co. — Website

Marketing site + order request form + CRM dashboard for Porch Light Flavor Co., a home bakery in Prescott Valley, AZ.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Auth) · Vercel

---

## Running locally

### 1. Clone and install

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the three required values (see "Supabase setup" below):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase setup

### Create a project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Choose a name (e.g. `porch-light`) and a strong database password. Save it somewhere safe.
3. Wait for provisioning (~1 min).

### Get your API keys

In your Supabase project: **Settings → API**

- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role / secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### Run the migration

1. In your Supabase project: **Database → SQL Editor → New query**
2. Paste the entire contents of `supabase/migrations/001_initial.sql`
3. Click **Run**

This creates the `orders` table and sets up Row Level Security policies.

---

## Creating the owner's CRM login

The `/crm` dashboard uses Supabase email/password auth. There's one owner account.

### Option A — Supabase dashboard (easiest)

1. In your Supabase project: **Authentication → Users → Add user**
2. Enter the owner's email + a strong password.
3. Use those credentials to sign in at `yoursite.com/crm/login`.

### Option B — Supabase CLI

```bash
supabase auth admin create-user --email owner@porchlightflavor.com --password "strong-password-here"
```

---

## Editing menu items and prices

All menu data lives in one file: **`data/menu.ts`**

Each entry looks like:

```ts
{
  name: "Blueberry Morning Crumble",
  description: "Plump blueberries, buttery crumb topping baked to a golden crunch.",
  price: "$4.50 each",   // optional — add or change freely
  image: "/images/blueberry-muffin.jpg",  // optional — add a photo path here
}
```

To update a price, change the `price` string. To add a real product photo, add an `image` field pointing to a file in `/public/images/`. The menu page will render it automatically.

Category-level pricing labels (e.g. "6-count minimum · $4.50 each") are set in the `label` field of each category object, just above the `items` array.

Site-wide info (phone, email, social links, delivery note) is in **`data/site.ts`**.

---

## Deploying to Vercel

1. Push this repo to GitHub (or your preferred Git host).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**.

Vercel auto-detects Next.js — no additional build config needed.

For a custom domain, add it in **Vercel project → Settings → Domains**.

---

## Adding email notifications later (Resend)

When you're ready to send order confirmation emails, the hook is already in place:

1. Sign up at [resend.com](https://resend.com) and get an API key.
2. `npm install resend`
3. Add to `.env.local` (and Vercel env vars):
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=orders@porchlightflavor.com
   ORDER_NOTIFICATION_EMAIL=owner@porchlightflavor.com
   ```
4. Find the `// TODO: send notification emails` comment in `app/api/order-request/route.ts` — the commented example shows exactly where and how to drop in the Resend call.

---

## Project structure

```
app/
  page.tsx              Home page
  menu/page.tsx         Full menu
  order/page.tsx        Order request form
  wholesale/page.tsx    Wholesale & catering page
  about/page.tsx        About page
  contact/page.tsx      Contact page
  crm/
    page.tsx            Kanban dashboard (auth-protected)
    login/page.tsx      CRM login page
    layout.tsx          CRM layout (no public header/footer)
  api/order-request/
    route.ts            POST handler — validates + inserts to Supabase

components/
  layout/Header.tsx     Sticky nav with mobile menu
  layout/Footer.tsx     Site footer
  order/OrderForm.tsx   Controlled form with validation
  crm/KanbanBoard.tsx   Drag-and-drop Kanban
  crm/OrderDetail.tsx   Slide-in detail panel
  crm/CRMHeader.tsx     CRM top bar with sign-out

data/
  menu.ts               All menu items and prices (edit here)
  site.ts               Phone, email, socials, delivery note

lib/
  types.ts              TypeScript types + status constants
  supabase/client.ts    Browser Supabase client
  supabase/server.ts    Server Supabase client

middleware.ts           Next.js middleware — protects /crm routes

supabase/migrations/
  001_initial.sql       Run once in Supabase SQL editor
```
