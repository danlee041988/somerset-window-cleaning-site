# Testing Guide

## Frontend Validation with Playwright

This project uses Playwright E2E tests to validate frontend changes and ensure UI consistency.

### Quick Start

```bash
# Install dependencies (if not already done)
npm ci

# Run all frontend validation tests
npm run test:frontend

# Run tests with browser window visible (for debugging)
npm run test:frontend:headed

# Run all E2E tests
npm run test:e2e
```

### Frontend Changes Validation

The `tests/frontend-changes.spec.ts` file contains comprehensive tests for:

#### ✅ **Header Logo Styling**
- Seamless integration without visible borders
- Proper blend modes and transparency
- Cross-browser compatibility
- Responsive sizing across devices

#### ✅ **Hero Section Red Dots**
- Three red dots separating tagline text
- Proper styling and brand color usage
- Correct spacing and dimensions

#### ✅ **Recent Work Section**
- Somerset Council logo removed from gallery
- Proper service image mappings
- No placeholder or logo images in work samples

#### ✅ **Service Image Mappings**
- Conservatory service uses aerial photo (not logo)
- All services display appropriate real photos
- No broken or missing image references

### Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:frontend` | Run frontend validation tests |
| `npm run test:frontend:headed` | Run with visible browser (debugging) |
| `npm run test:e2e` | Run all Playwright tests |
| `npm run test:e2e:headed` | Run all tests with visible browser |

### Continuous Integration

Tests automatically run on:
- Push to `main` branch
- Pull request creation
- Manual workflow dispatch

See `.github/workflows/e2e-tests.yml` for CI configuration.

### Test Reports

Failed tests generate:
- Screenshots of failures
- Video recordings
- Detailed error reports
- Visual comparisons

These are uploaded as GitHub Actions artifacts for review.

### Local Development

When making frontend changes:

1. **Make your changes** to components/styles
2. **Run validation tests**: `npm run test:frontend`
3. **Fix any failures** before committing
4. **Commit changes** - CI will run full test suite

### Test Structure

```
tests/
├── frontend-changes.spec.ts    # Main frontend validation tests
├── quote.spec.ts              # Quote flow tests
└── components/                # Component unit tests
```

### Adding New Tests

To add validation for new frontend changes:

1. Add test cases to `tests/frontend-changes.spec.ts`
2. Group related tests in `test.describe()` blocks
3. Use descriptive test names
4. Include both positive and negative test cases
5. Test across different screen sizes when relevant

### Debugging Tests

```bash
# Run specific test
npx playwright test -g "logo displays seamlessly"

# Run with debug mode
npx playwright test --debug

# Generate screenshots for comparison
npx playwright test --update-snapshots
```

### Browser Support

Tests run on:
- ✅ Chromium (default)
- ✅ Firefox (optional)
- ✅ Safari/WebKit (optional)

Configure additional browsers in `playwright.config.ts`.