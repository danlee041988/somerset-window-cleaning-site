import { test, expect } from '@playwright/test';

test.describe('Debug Image Sources', () => {
  test('Check actual image sources on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.locator('text=Services tailored to your property')).toBeVisible();
    
    // Find all service images and log their sources
    const serviceImages = page.locator('img[src*="/images/"]');
    const count = await serviceImages.count();
    
    console.log(`Found ${count} images with /images/ in src`);
    
    for (let i = 0; i < count; i++) {
      const img = serviceImages.nth(i);
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      console.log(`Image ${i}: src="${src}", alt="${alt}"`);
    }
  });

  test('Check actual image sources on services page', async ({ page }) => {
    await page.goto('/services');
    
    // Wait for page to load
    await expect(page.locator('text=Our services')).toBeVisible();
    
    // Find all service images and log their sources
    const serviceImages = page.locator('img[src*="/images/"]');
    const count = await serviceImages.count();
    
    console.log(`Found ${count} images with /images/ in src on services page`);
    
    for (let i = 0; i < count; i++) {
      const img = serviceImages.nth(i);
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      console.log(`Services Image ${i}: src="${src}", alt="${alt}"`);
    }
  });
});