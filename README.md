# TRIANGLE Intelligence // Global OSINT Matrix

A front-end concept for a global open-source-intelligence (OSINT) dashboard: a 3D orbital globe, a "council" of analytical agents, and a cyber-themed command interface.

> **Important:** this project is currently a **UI demo that runs on simulated data**. All intelligence content comes from `src/data/mockIntelligence.ts`; there is no backend, no live feeds and no AI model behind the "agents" yet.

<img width="1279" height="799" alt="Screenshot 2026-09-26 201142" src="https://github.com/user-attachments/assets/e9df6526-f54b-42c1-946b-0eede1cee646" />

## Features

- **Interactive 3D globe** (React Three Fiber) showing strategic points of interest
- **Intelligence Council console:** the interface for 11 analyst roles (9 domain specialists, an adversarial verifier and a supervisor) - defence operations, weapons and military tech, procurement and industry, geopolitical affairs, global powers and alliances, regional conflicts, markets and macro, energy and commodities
- **Country dossiers, intelligence reports and a knowledge-base view**
- **Verification drawer** for reviewing a report's sources
- **Immersive cyber UI:** scanlines, encrypted-text reveal animations, HUD overlays, loading animation and sound effects

<img width="1280" height="800" alt="Screenshot 2026-09-26 201158" src="https://github.com/user-attachments/assets/1877881c-499e-466b-b34a-42ea829d27da" />

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS, Three.js with React Three Fiber / drei, GSAP, Motion.

## Getting started

Prerequisite: Node.js.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build to dist/
npm run lint       # TypeScript type-check
```

`npm install` and `npm run build` were verified for this README. No environment variables are required.

## Project structure

```
src/
  App.tsx, main.tsx
  components/   globe, council monitor, dossiers, reports, knowledge base, HUD
  data/         mockIntelligence.ts  (all demo content)
  lib/          sound effects, utilities
  types/        osint.ts
components/     shared UI components (globe, encrypted text, holographic card)
public/         static assets
```

## How it works

The app is a single-page React application. `App.tsx` composes the sections; each section reads the mock dataset and renders it with animations and a Three.js globe. Nothing is sent to a server.

## Roadmap / known limitations

- Replace the mock dataset with real data sources and a real agent backend.
- `express` and `tsx` are listed as dependencies but are not used by the current code.
- Two lockfiles (`package-lock.json` and `bun.lock`) are committed; pick one package manager.
- UI components exist in both `components/` and `src/components/`.
- The production bundle triggers a Vite warning for chunks over 500 kB.

## Author

Mrittunjay Dubey, GitHub [@JayD108](https://github.com/JayD108)

## License

No license file is included yet, so all rights are reserved by default.