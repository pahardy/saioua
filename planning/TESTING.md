# Testing — Sai Oua Website

## Approach

Two complementary test types are applied to the mockup:

| Type | What it checks |
|---|---|
| **Unit / integration** | Language context logic (key resolution, language switching, localStorage persistence) |
| **Component smoke tests** | Every page component renders without crashing; key content and links are present |

End-to-end browser testing (e.g. Playwright) is not included at this stage. The site is a static informational mockup with no user-submitted data or dynamic server logic, so unit and component tests cover the meaningful behaviour.

## Framework

- **Jest** — test runner
- **React Testing Library** — component rendering and DOM assertions
- **@testing-library/user-event** — simulating user interactions (button clicks)
- **jest-environment-jsdom** — browser-like environment for Node

## Test Files

| File | Coverage |
|---|---|
| `__tests__/LanguageContext.test.tsx` | `resolve()` key lookup, language switching, localStorage read/write |
| `__tests__/components.test.tsx` | Smoke render of all 7 page components |

## Running Tests

```bash
npm test
```

## Results

```
Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
Time:        ~0.8s
```

### LanguageContext (8 tests)
- Defaults to English on first load
- Resolves nested translation keys correctly (`hero.headline` → `"Sai Oua"`)
- Resolves deeply nested keys (`product.history_heading`)
- Returns key path as fallback for missing keys
- Switches to Thai; translated text differs from English source
- Switches to Lao; translated text differs from English source
- Persists selected language to `localStorage`
- Restores language from `localStorage` on mount

### Component smoke tests (7 tests)
- **Header** — site name and nav links present
- **Hero** — `<h1>` contains "Sai Oua"; CTA link present
- **MakerIntro** — placeholder heading present
- **ProductInfo** — section heading present
- **Process** — both sub-headings (Ingredients, Process) present
- **Contact** — email link points to `mailto:fake@fake.com`
- **Footer** — copyright text present
