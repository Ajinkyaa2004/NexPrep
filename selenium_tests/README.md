# NexPrep — Selenium UI Test Suite

End-to-end UI tests that exercise **every page and interactive control** in the app.

## What it covers (73 checks)

| Area | Checks |
|------|--------|
| SEO | `robots.txt`, `sitemap.xml`, `manifest.webmanifest` served |
| Routing | `/` → `/auth/sign-in` redirect |
| Sign In | inputs, password show/hide toggle, sign-up link, invalid-login handling |
| Sign Up | all 4 inputs, links, password-mismatch validation |
| Dashboard | heading, 4 stat cards, sidebar nav links, Sign Out, Create-Interview card |
| New Interview dialog | opens, inputs, difficulty/mode/duration dropdowns, Cancel closes |
| Questions / Resume / ATS | page loads, resume template selection, **real resume upload + analysis** |
| Interview detail | job role loads, Enable Webcam + Start buttons, info card |
| Interview session | full-screen fit (no scroll), Record/Type/Save/Next/End, **real AI evaluation + save**, question navigation |
| Feedback | overall score, detailed analysis, bullet-rendered feedback (no raw markdown) |
| Console errors | no severe JS errors on key pages |

## Prerequisites

```bash
pip install selenium                 # Selenium 4 auto-manages ChromeDriver
brew services start mongodb-community
npm run dev                          # app on http://localhost:3000
```

The app must have a working `NEXT_PUBLIC_GEMINI_API_KEY` (the AI-evaluation tests
make a real Gemini call) and a reachable MongoDB.

## Run

```bash
bash selenium_tests/run_tests.sh
```

This seeds a deterministic interview (`selenium-test-interview`), runs the suite,
and cleans up afterwards. Tests run headless with faked camera/mic
(`--use-fake-device-for-media-stream`).

Override targets via env vars:

```bash
BASE_URL=http://localhost:3000 MONGODB_URI=mongodb://127.0.0.1:27017/nexprep \
  bash selenium_tests/run_tests.sh
```

Exit code is non-zero if any check fails; failures are listed in the summary.
