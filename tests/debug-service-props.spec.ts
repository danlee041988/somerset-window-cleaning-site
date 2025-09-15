import { test, expect } from '@playwright/test';

test.describe('Debug Service Props', () => {
  test('Check ServiceCard props in DOM', async ({ page }) => {
    await page.goto('/');
    
    // Add some console logging via browser evaluation
    await page.evaluate(() => {
      // Log all images on the page
      const images = document.querySelectorAll('img');
      console.log('All images on page:', images.length);
      images.forEach((img, i) => {
        console.log(`Image ${i}: src="${img.src}", alt="${img.alt}", naturalWidth=${img.naturalWidth}, naturalHeight=${img.naturalHeight}`);
      });
    });
    
    // Wait and check service section
    await expect(page.locator('text=Services tailored to your property')).toBeVisible();
    
    // Look for any broken image indicators
    const brokenImages = page.locator('img[src=""]');
    const brokenCount = await brokenImages.count();
    console.log(`Found ${brokenCount} images with empty src`);
    
    // Check if there are any ImageWithFallback loading placeholders
    const loadingPlaceholders = page.locator('svg[viewBox="0 0 20 20"]');
    const placeholderCount = await loadingPlaceholders.count();
    console.log(`Found ${placeholderCount} loading placeholders`);
    
    // Check for any error states in ImageWithFallback
    const errorStates = page.locator('.bg-white\\/10.animate-pulse');
    const errorCount = await errorStates.count();
    console.log(`Found ${errorCount} error/loading states`);
  });
});