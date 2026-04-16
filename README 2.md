# Fixpass Marketing Site

Production-ready marketing website for Fixpass built with Next.js, React, TypeScript, and Tailwind CSS.

## Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS

## Run Locally
1. Install Node.js 20+.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Build
```bash
npm run build
npm run start
```

## Key Pages
- `/` Home (all core marketing sections)
- `/pricing` Plan comparison page
- `/contact` Contact + early access form

## Integration Points
- Stripe:
  - Add checkout session creation in `src/app/api/checkout/route.ts` (new file).
  - Link plan buttons in `src/components/pricing-cards.tsx` to Stripe checkout URLs.
- CRM:
  - Replace placeholder in `src/app/api/waitlist/route.ts` with HubSpot/Salesforce API call.
  - Add lead source metadata and UTM capture.
- Booking:
  - Add booking provider webhook endpoint in `src/app/api/booking/route.ts`.
  - Trigger scheduler links from post-signup and confirmation emails.

## Notes
- Forms are production-structured but currently mocked (no database persistence).
- Branding and copy are optimized for trust, clarity, and conversion.
- Launch area currently set to Houston and easy to update.
