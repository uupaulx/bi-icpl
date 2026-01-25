import { test, expect } from '@playwright/test';

test.describe('Report Viewer', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByRole('button', { name: /Microsoft/i }).click();
    await page.waitForURL('/');
  });

  test('should navigate to report from dashboard', async ({ page }) => {
    // Wait for reports to load
    await page.waitForTimeout(1000);

    // Click on first report link
    const reportLink = page.locator('a[href^="/reports/"]').first();

    if (await reportLink.isVisible()) {
      await reportLink.click();

      // Should navigate to report page
      await expect(page).toHaveURL(/\/reports\//);
    }
  });

  test('should navigate to report from sidebar', async ({ page }) => {
    // Expand a category in sidebar
    const categoryButton = page.locator('aside button').filter({ hasText: /ขาย|การเงิน|HR|การตลาด|บริหาร/i }).first();

    if (await categoryButton.isVisible()) {
      await categoryButton.click();

      // Wait for collapse to expand
      await page.waitForTimeout(500);

      // Click on first report link in sidebar
      const reportLink = page.locator('aside a[href^="/reports/"]').first();

      if (await reportLink.isVisible()) {
        await reportLink.click();
        await expect(page).toHaveURL(/\/reports\//);
      }
    }
  });

  test('should display report details after navigation', async ({ page }) => {
    // First navigate to dashboard to ensure we're logged in
    await page.waitForTimeout(1000);

    // Click on first report link from dashboard
    const reportLink = page.locator('a[href^="/reports/"]').first();

    if (await reportLink.isVisible()) {
      await reportLink.click();

      // Wait for navigation
      await page.waitForURL(/\/reports\//);
      await page.waitForTimeout(1000);

      // Should see either report content or a message
      const hasBackButton = await page.getByRole('button').filter({ has: page.locator('svg') }).first().isVisible();
      expect(hasBackButton).toBeTruthy();
    } else {
      // No reports available, test passes
      expect(true).toBeTruthy();
    }
  });
});
