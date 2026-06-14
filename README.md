# Green Garden 🌿

> AI-powered plant recommendation app — built at the Hopamine Green Hackathon, June 2026

## What it does

Answer 5 simple questions about your garden (type, climate, sun exposure, size, soil) and get personalized plant recommendations powered by Gemini AI via OpenRouter.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + inline styles
- **AI**: Google Gemini 2.5 Flash via OpenRouter
- **Email**: Resend
- **Images**: Unsplash (dynamic via `source.unsplash.com`)
- **Deploy**: Vercel

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Intro | `/` | Landing page with Get Started CTA |
| Questions | `/questions` | 5-step garden quiz |
| Results | `/results` | AI plant recommendations |
| Plant Detail | `/plant/[id]` | Individual plant info + partner card |

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy the environment template and fill in your keys:

```bash
cp .env.example .env.local
```

4. Run locally: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following keys (never commit this file):

```
OPENROUTER_API_KEY=your_openrouter_key_here
RESEND_API_KEY=your_resend_key_here
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add the environment variables in Vercel project settings
4. Deploy!

---

Built with 💚 at Hopamine Green Hackathon · June 2026
