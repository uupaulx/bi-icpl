import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display login page correctly', async ({ page }) => {
    await page.goto('/login');

    // Check ICPL branding
    await expect(page.getByText('ICPL × BI Report')).toBeVisible();

    // Check login button exists
    await expect(page.getByRole('button', { name: /Microsoft/i })).toBeVisible();

    // Check descriptive text
    await expect(page.getByText('เข้าสู่ระบบอย่างปลอดภัยด้วย Azure AD')).toBeVisible();
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should login with mock Microsoft SSO', async ({ page }) => {
    await page.goto('/login');

    // Click login button
    await page.getByRole('button', { name: /Microsoft/i }).click();

    // Wait for navigation to dashboard
    await page.waitForURL('/', { timeout: 10000 });

    // Should see dashboard with user name
    await expect(page.getByText('สวัสดี,')).toBeVisible();
  });

  test('should show user dropdown after login', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /Microsoft/i }).click();
    await page.waitForURL('/');

    // Find and click user avatar/dropdown trigger in header
    await page.locator('header button').last().click();

    // Should see logout option
    await expect(page.getByRole('menuitem', { name: /ออกจากระบบ/i })).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByRole('button', { name: /Microsoft/i }).click();
    await page.waitForURL('/');

    // Open dropdown and logout
    await page.locator('header button').last().click();
    await page.getByRole('menuitem', { name: /ออกจากระบบ/i }).click();

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});
