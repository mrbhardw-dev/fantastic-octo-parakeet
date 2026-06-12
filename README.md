# baile.fyi

Kilcock's local community noticeboard — a neighbourhood community app for Kilcock, Co. Kildare, Ireland.

## Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase Postgres + Row Level Security |
| Auth | Clerk |
| Social feed | Stream Feeds (getstream.io) |
| Images | Cloudinary |
| Search | Algolia |
| Email | Resend |
| Deployment | Cloudflare Pages |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See comments in that file for where to get each key.

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run each migration in order from `supabase/migrations/`:
   - Open the **SQL Editor** in the Supabase Dashboard
   - Run `001_profiles.sql` → `002_posts.sql` → `003_events.sql` → `004_directory_listings.sql` → `005_help_posts.sql` → `006_reports.sql`
3. Edit `supabase/migrations/seed.sql` — replace `YOUR_CLERK_ADMIN_USER_ID` with your actual Clerk user ID
4. Run `seed.sql` to create sample data

### 4. Set up Clerk

1. Create an app at [clerk.com](https://clerk.com)
2. Copy **Publishable Key** and **Secret Key** to `.env.local`
3. In the Clerk Dashboard → **Webhooks** → Add endpoint:
   - URL: `https://your-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`
   - Copy the **Webhook Secret** to `.env.local` as `CLERK_WEBHOOK_SECRET`
4. Set **Sign-in URL** to `/sign-in` and **Sign-up URL** to `/sign-up`

### 5. Set up Stream Feeds

1. Create an app at [getstream.io](https://getstream.io)
2. Create a **Feed Group** named `timeline` (Flat type)
3. Copy **API Key** and **Secret** to `.env.local`

### 6. Set up Algolia

1. Create an app at [algolia.com](https://www.algolia.com)
2. Create three indices: `baile_posts`, `baile_events`, `baile_directory`
3. Copy **App ID**, **Search-Only API Key**, and **Admin API Key** to `.env.local`

### 7. Set up Cloudinary

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. Copy **Cloud Name**, **API Key**, and **API Secret** to `.env.local`

### 8. Set up Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your sending domain
3. Copy the **API Key** to `.env.local`

### 9. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Development commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npx tsc --noEmit     # TypeScript check
npm run lint         # ESLint
```

## Deployment to Cloudflare Pages

1. Install the adapter:
   ```bash
   npm install @cloudflare/next-on-pages --save-dev
   ```
2. Add to `package.json` scripts: `"build:cf": "npx @cloudflare/next-on-pages"`
3. Connect your GitHub repo to [Cloudflare Pages](https://pages.cloudflare.com):
   - Build command: `npm run build:cf`
   - Build output: `.vercel/output/static`
4. Add all environment variables in the Cloudflare dashboard

## Making someone an admin

1. Sign up on the site
2. In Supabase Dashboard → Table Editor → `profiles` → set `role` to `admin`
3. Visit `/admin` to access the moderation dashboard

## Project structure

```
src/
  app/                # Next.js App Router pages
    (auth)/           # Clerk auth pages (sign-in, sign-up)
    admin/            # Moderation dashboard
    api/              # API routes (webhooks, image upload)
    directory/        # Local directory pages
    events/           # Events pages
    feed/             # Community feed pages
    help/             # Neighbour help board pages
    guidelines/       # Community guidelines
    privacy/          # Privacy policy (GDPR)
  actions/            # Next.js Server Actions
  components/         # React components
    admin/            # Admin/moderation UI
    directory/        # Directory components
    events/           # Events components
    feed/             # Feed + post components
    help/             # Help board components
    layout/           # Header, Footer
    ui/               # shadcn/ui components
  lib/                # Service clients (Supabase, Stream, Cloudinary, Algolia, Resend)
  types/              # Shared TypeScript types
supabase/
  migrations/         # SQL schema migrations + Kilcock seed data
```

## Extending to other towns

All content has `town` and `county` fields. To add another Irish town:
1. Create a user profile with the new town/county
2. Update Stream feed slugs in `src/lib/stream.ts`
3. Optionally update the default values in migrations for new deployments
