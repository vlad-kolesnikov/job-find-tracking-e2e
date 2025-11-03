import { test, expect } from '@playwright/test';

test.describe('Auth flow (unauthenticated)', () => {
  test('redirects from / to /auth and shows auth UI @smoke', async ({ page }) => {
    const resp = await page.goto('/');
    expect(resp?.ok()).toBeTruthy();

    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.getByRole('heading', { name: /welcome back|create an account/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
  });

  test('landing page - registration and login form verification @smoke', async ({ page, context }) => {
    // Step 1: Navigate to the application URL
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();

    // Step 2: Observe the landing page
    await expect(page).toHaveURL(/\/auth$/);

    // Step 3: Clear browser cache
    await context.clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Reload page after clearing cache
    await page.reload();

    // Step 4: Registration and login form is displayed
    await expect(page).toHaveURL(/\/auth$/);
    const authForm = page.locator('form').first();
    await expect(authForm).toBeVisible();

    // Step 5: Form contains email and password fields
    const emailField = page.getByRole('textbox', { name: /email/i }).or(page.locator('input[type="email"]'));
    const passwordField = page.locator('input[type="password"]');

    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();

    // Step 6: "Sign up with Google" button is visible
    const googleButton = page.getByRole('button', { name: /sign up with google|continue with google/i });
    await expect(googleButton).toBeVisible();

    // Step 7: "Login" and "Register" options are available
    // Check for Sign In button (already visible on the form)
    const signInButton = page.getByRole('button', { name: /^sign in$/i });
    await expect(signInButton).toBeVisible();

    // Check for Sign Up link/text at the bottom
    const signUpLink = page.getByText(/need an account\?/i).locator('..').getByText(/sign up/i);
    await expect(signUpLink.or(page.getByRole('link', { name: /sign up/i }))).toBeVisible();
  });
});
