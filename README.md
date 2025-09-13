# Somerset Window Cleaning Website

TypeScript Next.js site for Somerset Window Cleaning. Black-first theme with bright red accents, white text, and an EmailJS-powered contact form.

## Tech
- Next.js 14 (App Router)
- Tailwind CSS
- React Hook Form
- EmailJS (client SDK)

## Getting Started
1. Install deps:
   npm install

2. Configure environment:
   - Copy `.env.example` to `.env.local`
   - Add `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`

3. Run dev server:
   npm run dev

## Alternate Preview (No Dev Server)
If localhost ports are blocked, build a static export and serve it on a different port:

1) Build static files:
   npm run build:static

2) Serve the `out/` directory:
   npm run preview:static

Then open:
   http://localhost:4321

## EmailJS Template
Map your template variables to the following keys:
- name, email, phone, postcode, service, message, submitted_at

## Deploy (Vercel)
- Project root: `CODEX_SWC_WEBSITE`
- Build command: `next build`
- Output: `.next`
- Set env vars in Vercel for Production and Preview.

## Pages
- `/` Home (hero, services preview, CTA)
- `/services` Services
- `/contact` Contact form (EmailJS)
- Auto-generated: `/robots.txt`, `/sitemap.xml`

## Brand
- Black: `#0B0B0B`
- Red: `#E11D2A`
- White: `#FFFFFF`
