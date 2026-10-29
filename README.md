# 万乐琪 — 实时三维与交互开发

An Editorial + Generative Art portfolio built with Vue 3, TypeScript, Three.js and GSAP. The second iteration follows the supplied Figma Make prototype, with orbital geometry, star callouts, full-width editorial pages, and a split-screen assistant.

## Development

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite. `npm run build` runs TypeScript checks and generates `dist/`. `npm run preview` serves the production build.

## Explore

- Four star callouts and the header open Work, Experience, About and Contact.
- Education appears in About. Work entries expand to show project notes.
- Drag the orbital artwork to rotate it. A click opens the assistant; dragging never opens it.
- Focus the artwork and use arrow keys to rotate, R to reset, Enter or Space to open the assistant.
- Pause / Play controls automatic rotation. Reset restores the manual rotation offset.
- Escape closes the assistant to its previous page, or returns an inner page to the homepage.
- URL hashes support direct links, refresh and browser Back / Forward.
- `/#work/universe/lod` opens the Universe case at the chronological LOD study. The former standalone LOD preview redirects here.

## Personal information

Replace the labelled examples in `src/content.ts` with verified projects, experience, education, location, email and availability. The prototype does not claim the Figma example's location, employers, dates or email as real information.

The assistant uses curated local responses, makes no API requests, sends no email, and resets on refresh. It can link to Work. It is explicitly labelled as a demo.

## Assets and accessibility

DM Sans and Italiana are served locally from `public/fonts/`; their SIL Open Font Licenses are included beside them. Reduced-motion settings stop automatic rotation and transitions; manual rotation remains available. A static SVG appears when WebGL cannot initialize. Three.js resources are released when the artwork unmounts.

The current design and validation notes live in `docs/PROJECT_CONTEXT.md` and `docs/IMPLEMENTATION_PLAN.md`. Screenshots are in `docs/previews/figma-v2/`.
