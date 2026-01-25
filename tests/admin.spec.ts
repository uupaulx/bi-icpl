import { test, expect } from '@playwright/test';

test.describe('Admin Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByRole('button', { name: /Microsoft/i }).click();
    await page.waitForURL('/');
  });

  test.describe('Admin Dashboard', () => {
    test('should display admin dashboard', async ({ page }) => {
      await page.goto('/admin');

      // Check page title
      await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();

      // Check stats cards - use exact card titles
      await expect(page.getByText('Reports ทั้งหมด')).toBeVisible();
      await expect(page.getByRole('heading', { name: 'หมวดหมู่' }).first()).toBeVisible();
      await expect(page.getByText('ผู้ใช้งาน')).toBeVisible();
    });
  });

  test.describe('Report Management', () => {
    test('should display reports management page', async ({ page }) => {
      await page.goto('/admin/reports');

      await expect(page.getByRole('heading', { name: 'จัดการ Reports' })).toBeVisible();

      // Check for add report button
      await expect(page.getByRole('button', { name: /เพิ่ม Report/i })).toBeVisible();
    });

    test('should open add report dialog', async ({ page }) => {
      // Navigate via sidebar link to ensure auth state is ready
      await page.getByRole('button', { name: 'จัดการ Reports' }).first().click();
      await page.waitForURL('/admin/reports');

      // Wait for page to fully load
      await expect(page.getByRole('heading', { name: 'จัดการ Reports' })).toBeVisible();

      await page.getByRole('button', { name: /เพิ่ม Report/i }).click();

      // Wait for dialog animation
      await page.waitForTimeout(500);

      // Check dialog appears
      await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('should display reports table', async ({ page }) => {
      await page.goto('/admin/reports');

      // Check table headers
      await expect(page.getByRole('columnheader', { name: 'ชื่อ Report' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'หมวดหมู่' })).toBeVisible();
    });
  });

  test.describe('Category Management', () => {
    test('should display categories management page', async ({ page }) => {
      await page.goto('/admin/categories');

      await expect(page.getByRole('heading', { name: 'จัดการหมวดหมู่' })).toBeVisible();

      // Check for add category button
      await expect(page.getByRole('button', { name: /เพิ่มหมวดหมู่/i })).toBeVisible();
    });

    test('should open add category dialog', async ({ page }) => {
      // Navigate via sidebar link to ensure auth state is ready
      await page.getByRole('button', { name: 'จัดการหมวดหมู่' }).first().click();
      await page.waitForURL('/admin/categories');

      // Wait for page to fully load
      await expect(page.getByRole('heading', { name: 'จัดการหมวดหมู่' })).toBeVisible();

      await page.getByRole('button', { name: /เพิ่มหมวดหมู่/i }).click();

      // Wait for dialog animation
      await page.waitForTimeout(500);

      // Check dialog appears
      await expect(page.getByRole('dialog')).toBeVisible();
    });
  });

  test.describe('User Management', () => {
    test('should display users management page', async ({ page }) => {
      await page.goto('/admin/users');

      await expect(page.getByRole('heading', { name: 'จัดการผู้ใช้' })).toBeVisible();
    });

    test('should display users table', async ({ page }) => {
      await page.goto('/admin/users');

      // Check table headers - actual headers are ผู้ใช้ and อีเมล
      await expect(page.getByRole('columnheader', { name: 'ผู้ใช้' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'อีเมล' })).toBeVisible();
    });
  });

  test.describe('Access Management', () => {
    test('should display access management page', async ({ page }) => {
      await page.goto('/admin/access');

      await expect(page.getByRole('heading', { name: 'จัดการสิทธิ์การเข้าถึง' })).toBeVisible();
    });

    test('should display tabs for access management', async ({ page }) => {
      await page.goto('/admin/access');

      // Check tabs exist
      await expect(page.getByRole('tab', { name: 'จัดการตามผู้ใช้' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'จัดการตาม Report' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'ตาราง Access Matrix' })).toBeVisible();

      // Default tab shows user selection
      await expect(page.getByRole('heading', { name: 'เลือกผู้ใช้' })).toBeVisible();
    });
  });
});
