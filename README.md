# Concours archive

A free, French-language static site where Tunisian **2ème prépa MP** students
revise by **chapitre**: pick a chapter from the Tunisian MP program and get every
past-concours **exercise** (🇫🇷 🇹🇳 🇲🇦) tagged with it.

Built with [Astro](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/),
tested with [Vitest](https://vitest.dev/). Static, no server, no accounts.

## Getting started

```bash
npm install
```

## Scripts

| command | what it does |
| --- | --- |
| `npm run dev` | start the dev server (hot reload) |
| `npm run build` | build the static site into `dist/` |
| `npm run preview` | preview the production build locally |
| `npm run check` | Astro/TypeScript diagnostics |
| `npm test` | run the test suite once |
| `npm run test:watch` | run tests in watch mode |

## Project docs

- `CONTEXT.md` — domain glossary
- `docs/adr/` — architecture decisions
- `.scratch/concours-archive/` — spec, design system notes, and tickets

The look ("ink & paper") is defined by the Concours archive Design System; the
tokens live in `src/styles/global.css`.
