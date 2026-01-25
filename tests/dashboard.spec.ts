import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByRole('button', { name: /Microsoft/i }).click();
    await page.waitForURL('/');
  });

  test('should display dashboard correctly', async ({ page }) => {
    // Check welcome message
    await expect(page.getByText('สวัสดี,')).toBeVisible();
    await expect(page.getByText('ยินดีต้อนรับสู่ ICPL × BI Report')).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    // Check stats cards exist - use first() to handle multiple matches
    await expect(page.getByText('Reports ที่เข้าถึงได้')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'หมวดหมู่' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'แผนก' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'สถานะ' })).toBeVisible();
  });

  test('should display recent reports section', async ({ page }) => {
    await expect(page.getByText('Reports ล่าสุด')).toBeVisible();
  });

  test('should display categories section', async ({ page }) => {
    // Look for the categories card heading
    await expect(page.locator('text=หมวดหมู่').first()).toBeVisible();
  });

  test('should have working sidebar navigation', async ({ page }) => {
    // Check sidebar exists
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Check home link
    await expect(page.getByRole('button', { name: 'หน้าแรก' })).toBeVisible();
  });

  test('should display admin shortcuts for admin user', async ({ page }) => {
    // Check admin shortcuts section
    await expect(page.getByText('ทางลัดสำหรับ Admin')).toBeVisible();

    // Check admin buttons in main content area (not sidebar)
    const mainContent = page.getByRole('main');
    await expect(mainContent.getByRole('button', { name: 'จัดการ Reports' })).toBeVisible();
    await expect(mainContent.getByRole('button', { name: 'จัดการหมวดหมู่' })).toBeVisible();
    await expect(mainContent.getByRole('button', { name: 'จัดการผู้ใช้' })).toBeVisible();
    await expect(mainContent.getByRole('button', { name: 'จัดการสิทธิ์' })).toBeVisible();
  });
});
