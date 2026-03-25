# Chef’s Choice by Maison Solange

Premium, mobile-first e-commerce for a cookware & home lifestyle brand (Accra-first, globally scalable). Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Supabase**, **Paystack** (GHS checkout), and a **provider-agnostic Mobile Money** layer.

## Quick start

```bash
npm install
cp .env.example .env.local
```

1. Create a Supabase project and run `supabase/migrations/001_initial_schema.sql` in the SQL editor.
2. Create a public storage bucket `product-images` (optional for uploads).
3. Set env vars in `.env.local` (see `.env.example`).
4. Seed demo merchandising & content:

```bash
npm run db:seed
```

5. **Bootstrap admin (Auth user + `profiles.role = admin` + `admin_users`):** add to `.env.local` (temporary — remove the password after success):

   ```bash
   ADMIN_BOOTSTRAP_EMAIL=your@email.com
   ADMIN_BOOTSTRAP_PASSWORD='your-secure-password'
   npm run bootstrap:admin
   ```

   Then delete `ADMIN_BOOTSTRAP_PASSWORD` from `.env.local`. Sign in at `/admin/login`.

6. Run the app:

```bash
npm run dev
```

Storefront: `http://localhost:3000` · Admin: `http://localhost:3000/admin/login`

7. **Secure `admin_users` in Supabase:** run `supabase/migrations/002_admin_users_rls.sql` in the SQL Editor (enables RLS on `admin_users`).

## Architecture notes

- **Catalog, content, reviews, FAQs, testimonials, homepage sections, delivery zones, orders** are loaded from Supabase (server components + typed data layer under `src/lib/data`).
- **Cart & wishlist** use resilient client state (localStorage) for guests; authenticated cart persistence can be layered via service-role APIs.
- **Checkout** creates orders via `SUPABASE_SERVICE_ROLE_KEY`, supports **Paystack** (hosted payment), **Mobile Money (mock-ready)**, **COD**, and **WhatsApp-assisted** flows.
- **Paystack webhooks** (`charge.success`) and the **confirmation** callback finalize paid orders (`/api/webhooks/paystack`).
- **RLS** separates public reads, customer ownership, and admin privileges (`profiles.role = admin`).

## Mobile Money

Implement real providers inside `src/lib/payments/mobile-money-service.ts` (MTN, Telecel, AirtelTigo). Use `MOBILE_MONEY_MOCK=true` locally.

## Production checklist

- Configure `NEXT_PUBLIC_SITE_URL`, Paystack live secret key, and a webhook URL in the Paystack dashboard pointing to `/api/webhooks/paystack`.
- Harden rate limits on checkout & newsletter routes.
- Connect transactional email + WhatsApp Business API for order updates.
- Add product image pipeline to Supabase Storage with signed upload policies for admins.

## Brand

**Tagline:** Elevating the Joy of Cooking.
