import baseConfig from './playwright.config'

export default {
  ...baseConfig,
  testDir: './tests/e2e',
} as typeof baseConfig
