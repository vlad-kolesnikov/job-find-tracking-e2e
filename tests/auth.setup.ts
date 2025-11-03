import { test, expect } from '@playwright/test';

test('authenticate and save storage', async ({ page, context, baseURL }) => {
  // Go to auth page explicitly in case of redirects
  await page.goto(baseURL ? new URL('/auth', baseURL).toString() : '/auth');

  // Fill credentials from environment variables
  const email = process.env.TEST_USER_EMAIL || 'test@example.com';
  const password = process.env.TEST_USER_PASSWORD || 'testpassword';

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);

  // Submit
  await page.getByRole('button', { name: /sign in/i }).click();

  // Expect to land on the main page
  await page.waitForURL(/\/$/);
  await expect(page).toHaveURL(/\/$/);

  // Persist storage for subsequent projects
  await context.storageState({ path: 'playwright/.auth/user.json' });
});
