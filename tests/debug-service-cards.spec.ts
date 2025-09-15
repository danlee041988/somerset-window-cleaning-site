import { test, expect } from '@playwright/test';

test.describe('Debug Service Cards', () => {
  test('Check service card components on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await expect(page.locator('text=Services tailored to your property')).toBeVisible();
    
    // Find service cards by looking for ServiceCard components
    const serviceCards = page.locator('[class*="rounded-xl"][class*="border-white"]').filter({hasText: /Window Cleaning|Gutter Clearing|Conservatory|Solar/});
    const count = await serviceCards.count();
    
    console.log(`Found ${count} service cards on homepage`);
    
    for (let i = 0; i < count; i++) {
      const card = serviceCards.nth(i);
      const text = await card.textContent();
      const images = card.locator('img');
      const imageCount = await images.count();
      
      console.log(`Card ${i}: "${text?.split('\n')[0]}" has ${imageCount} images`);
      
      if (imageCount > 0) {
        const img = images.first();
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        console.log(`  Image: src="${src}", alt="${alt}"`);
      }
    }
  });

  test('Check service card components on services page', async ({ page }) => {
    await page.goto('/services');
    
    // Wait for page to load
    await expect(page.locator('text=Our services')).toBeVisible();
    
    // Find service cards
    const serviceCards = page.locator('[class*="rounded-xl"][class*="border-white"]').filter({hasText: /Window Cleaning|Gutter Clearing|Conservatory|Solar|Fascias|Commercial/});
    const count = await serviceCards.count();
    
    console.log(`Found ${count} service cards on services page`);
    
    for (let i = 0; i < count; i++) {
      const card = serviceCards.nth(i);
      const text = await card.textContent();
      const images = card.locator('img');
      const imageCount = await images.count();
      
      console.log(`Services Card ${i}: "${text?.split('\n')[0]}" has ${imageCount} images`);
      
      if (imageCount > 0) {
        const img = images.first();
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        console.log(`  Services Image: src="${src}", alt="${alt}"`);
      }
    }
  });
});