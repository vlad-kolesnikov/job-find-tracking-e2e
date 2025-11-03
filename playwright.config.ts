import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine environment (default to staging)
const ENVIRONMENT = process.env.ENVIRONMENT || 'staging';

// Environment-specific base URLs
const BASE_URLS = {
  local: 'http://localhost:5174',
  staging: process.env.STAGING_URL || 'https://staging.yourapp.com',
  production: process.env.PRODUCTION_URL || 'https://yourapp.com',
};

const baseURL = BASE_URLS[ENVIRONMENT as keyof typeof BASE_URLS] || BASE_URLS.staging;

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: !isCI, // Run in parallel locally, sequential in CI
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ...(isCI ? [['github'], ['junit', { outputFile: 'junit.xml' }]] : []),
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Browser context options
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: ENVIRONMENT === 'staging', // Ignore SSL errors on staging
  },

  projects: [
    // Setup authentication (if needed)
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Chromium - Guest (unauthenticated)
    {
      name: 'chromium-guest',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/auth.spec.ts'],
    },

    // Chromium - Desktop (authenticated)
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: ['**/auth.spec.ts'],
    },

    // Firefox (authenticated)
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: ['**/auth.spec.ts'],
    },
  ],

  // Only use webServer for local development
  ...(ENVIRONMENT === 'local' ? {
    webServer: {
      command: 'echo "Please start your local dev server manually"',
      url: baseURL,
      reuseExistingServer: true,
      timeout: 5_000,
    },
  } : {}),
});
