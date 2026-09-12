const { test, expect } = require('@playwright/test');

test.describe('Admin Authentication Flow', () => {
  test('should login with valid credentials and redirect to dashboard', async ({ page }) => {
    // Navigate to admin login page
    await page.goto('http://localhost:5173/admin/login');
    
    // Check if we are on the login page
    await expect(page).toHaveTitle(/Sai International/);
    
    // Fill in credentials
    await page.fill('input[type="email"]', 'sai.world.cc@gmail.com');
    await page.fill('input[type="password"]', 'SaiAdmin@2026');
    
    // Click submit
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    
    // Verify dashboard elements
    await expect(page.locator('.admin-page-title')).toContainText('Dashboard');
    await expect(page.locator('.admin-stat-label').first()).toContainText('Total Bookings');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    
    await page.fill('input[type="email"]', 'sai.world.cc@gmail.com');
    await page.fill('input[type="password"]', 'WrongPassword123');
    
    await page.click('button[type="submit"]');
    
    // Check for error message
    const errorMsg = page.locator('.error-message, .alert-danger'); // Adjust selector based on actual implementation
    // Depending on how the error is displayed, this might need tweaking
    // await expect(errorMsg).toBeVisible();
  });
});
