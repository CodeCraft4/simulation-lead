# Lead Engine Simulation

Click-through simulation of a WhatsApp + Meta Ads + Google Ads lead pipeline. Frontend only; every number is simulated.

- Plans and scripts: [docs/](docs/00-README.md)
- UI designs: https://claude.ai/artifact/ApVcoeUumXPMKSAYcCURZU

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
```

## Structure

```
src/
  app/           App root, router, providers (ThemeProvider)
  config/        routes.ts (all URLs), navigation.ts (app tab bar)
  data/          Simulated content: business.ts, scenes.ts
  features/
    scenario/    Engine: store, director (cues, reset, auto-play), timers, clock
    scenes/      One folder per scene: data, stage, cue steps; registry.ts lists them
    mobile-app/  The clickable app: navigator + screens
  components/
    ui/          Generic building blocks (Button, Badge)
    common/      App-wide pieces (BrandMark, ThemeToggle)
    devices/     IPhoneFrame, BrowserWindow / AppWindow
    whatsapp/    WhatsApp-style chat and call screens (customer side)
    motion/      CountUp, AnimatedNumber, Countdown
    stage/       FitStage (scales a scene to fit the screen)
    presenter/   TopBar, CuePanel, FlowMap
    app/         Lead Engine app parts (AppTabBar, ScoreRing, AppNotification)
  layouts/       PresenterLayout (top bar), MobileAppLayout (iPhone + tabs)
  pages/         Route pages: presenter/ (scene list, scene), NotFoundPage
  hooks/         useTheme, useFitScale
  lib/           cn (class names), storage (safe localStorage)
  styles/        globals.css: Tailwind + design tokens + light/dark themes
```

## Conventions

- **Aliases:** `@/`, `@app/`, `@components/`, `@config/`, `@data/`, `@features/`, `@hooks/`, `@layouts/`, `@lib/`, `@pages/`, `@styles/`. Defined in both `vite.config.ts` and `tsconfig.app.json`; keep them in sync.
- **Themes:** colours are CSS variables in `globals.css`, exposed as Tailwind classes (`bg-surface`, `text-ink-3`, `border-line`, `bg-brand` …). Dark theme = `data-theme="dark"` on `<html>`. The mobile app uses fixed `navy` colours in both themes.
- **Routes:** add paths to `config/routes.ts`, then register them in `app/router.tsx`.

| URL | Page |
|---|---|
| `/` | Scene list |
| `/scenes/:sceneId` | One presenter scene (all 9 are built), full screen, fits 100vh |
| `/app` | Clickable Lead Engine app in an iPhone frame (also on scene 9) |
