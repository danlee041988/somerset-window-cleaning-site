# End-to-End tests

Playwright specs that exercise the full application via the browser.

## Running tests

- `npm run test:e2e` – smoke suite (./tests/e2e/smoke) covering key customer journeys.
- `npm run test:e2e:full` – full legacy/debug suite (./tests/e2e) for deeper auditing.

The broader suite contains experimental checks that require production credentials (EmailJS,
reCAPTCHA, image diagnostics). They remain available but are excluded from the default run
to keep CI and local workflows fast and reliable.
