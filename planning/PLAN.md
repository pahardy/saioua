# Sai Oua Website — Implementation Plan

> Status: **Approved — in progress**

---

## What We're Building

A visually engaging, informational website about sai oua — an artisanal sausage from Thailand and Laos. The site will be available in English, Thai, and Laotian, run locally in Docker for now, and be structured so features can be added over time without rebuilding from scratch.

---

## Tech Stack

| Purpose | Tool | Why |
|---|---|---|
| Frontend framework | Next.js (React) | Flexible, widely used, easy to scale |
| Styling | Tailwind CSS | Fast to build with, consistent results |
| Translations | Google Cloud Translation API | Automatic; keys already in place |
| Containerization | Docker + docker-compose | Runs locally on Mac without any cloud setup |

---

## Site Structure

The site will have a single page with clearly separated sections, scrollable from top to bottom. A sticky header will carry the navigation and language toggle.

### Sections

1. **Header / Navigation**
   - Logo / site name
   - Nav links to each section
   - Language toggle (English | ລາວ | ภาษาไทย)

2. **Hero**
   - Large, appetizing image of sai oua
   - Bold headline and short tagline
   - Call-to-action (e.g., "Learn More" or "Explore")

3. **Maker Introduction** *(placeholder for now)*
   - Brief placeholder text noting content is coming
   - A neutral image as stand-in

4. **Product Information**
   - History of sai oua
   - Where and how it's eaten
   - Cultural associations (festivals, occasions)
   - Sourced from freely available web resources

5. **Ingredients & Process**
   - Key ingredients
   - Overview of how it's made
   - Sourced from freely available web resources

6. **Contact**
   - Simple email link(s) for visitors to get in touch

7. **Footer**
   - Basic copyright and language toggle (repeated)

---

## Translation Approach

- All text content will be stored in language files (one per language: `en`, `lo`, `th`)
- The Google Cloud Translation API will be used to generate the Thai and Laotian translations from the English source
- The language toggle in the header switches the entire site instantly, with no page reload
- Adding a new language later requires only a new language file — no structural changes

---

## Deployment

- A `Dockerfile` and `docker-compose.yml` will define the container
- A `start.sh` script will build and launch the site locally
- A `stop.sh` script will shut it down
- The site will be accessible in a browser at `http://localhost:3000`

---

## What's Not In Scope (Yet)

- Videos (planned for a future phase)
- AI chatbot (planned for a future phase)
- Online ordering or payment (aspirational)
- Cloud hosting (e.g., Vercel) — local Docker only for now

---

## Build Sequence

1. Scaffold Next.js project with Tailwind CSS
2. Set up Docker and start/stop scripts; confirm site loads in browser
3. Create language file structure and wire up language toggle
4. Connect Google Cloud Translation API; generate Thai and Laotian translations
5. Build each site section in order (Hero → Maker placeholder → Product Info → Ingredients → Contact → Footer)
6. Polish: animations, mobile responsiveness, visual refinement
7. Final review with director before handoff

---

## Decided

- **Contact email:** `fake@fake.com` (placeholder; to be replaced with real address later)
- **Site name / logo:** Developer's choice — no constraints
- **Color palette:** Developer's choice — changes may be requested later based on audience feedback

---

*This plan should be approved before any code is written.*
