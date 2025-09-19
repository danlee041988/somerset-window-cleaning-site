import { test, expect } from '@playwright/test';

test.describe('Image Improvements Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
  });

  test('Hero image has correct brightness and opacity improvements', async ({ page }) => {
    // Wait for hero section to load
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Find the hero background image
    const heroImage = page.locator('section img[aria-hidden="true"]').first();
    await expect(heroImage).toBeVisible();

    // Check that brightness filter is applied
    const style = await heroImage.getAttribute('style');
    expect(style).toContain('brightness(1.2)');

    // Check that opacity class is updated to 60%
    const classNames = await heroImage.getAttribute('class');
    expect(classNames).toContain('opacity-60');

    // Verify image loads successfully (no 404)
    const src = await heroImage.getAttribute('src');
    expect(src).toBeTruthy();

    // Check image loads without error
    await expect(heroImage).toHaveAttribute('src', /.+/);
  });

  test('Homepage service cards load correct images', async ({ page }) => {
    // Navigate to service cards section and wait for it to load
    await expect(page.locator('text=Services tailored to your property')).toBeVisible();

    // Define expected service cards (only those on homepage)
    const expectedServices = [
      { title: 'Window Cleaning', imagePath: '/images/photos/Window Clean.jpeg' },
      { title: 'Gutter Clearing', imagePath: '/images/photos/Gutter Clearing.jpg' },
      { title: 'Conservatory Roof Cleaning', imagePath: '/images/photos/DJI_0052.JPG' },
      { title: 'Solar Panels', imagePath: '/images/photos/Solar Panel .jpeg' }
    ];

    // Check each service by finding images with expected paths
    for (const service of expectedServices) {
      // Find images that contain the expected path
      const serviceImage = page.locator(`img[src*="${service.imagePath}"]`).first();
      await expect(serviceImage).toBeVisible();

      // Verify the image loads successfully
      const imageSrc = await serviceImage.getAttribute('src');
      expect(imageSrc).toContain(service.imagePath);
    }
  });

  test('Services page loads all service images correctly', async ({ page }) => {
    // Navigate to services page
    await page.goto('/services');

    // Wait for page to load
    await expect(page.locator('text=Our services')).toBeVisible();

    // Define expected services on services page
    const expectedServices = [
      { title: 'Window Cleaning', imagePath: '/images/photos/Window Clean.jpeg' },
      { title: 'Gutter Clearing', imagePath: '/images/photos/Gutter Clearing.jpg' },
      { title: 'Conservatory Roof Cleaning', imagePath: '/images/photos/DJI_0052.JPG' },
      { title: 'Solar Panel Cleaning', imagePath: '/images/photos/Solar Panel .jpeg' },
      { title: 'Fascias & Soffits Cleaning', imagePath: '/images/photos/DJI_0045.JPG' },
      { title: 'External Commercial Cleaning', imagePath: '/images/photos/Commercial.jpg' }
    ];

    // Check each service by finding images with expected paths
    for (const service of expectedServices) {
      // Find images that contain the expected path
      const serviceImage = page.locator(`img[src*="${service.imagePath}"]`).first();
      await expect(serviceImage).toBeVisible();

      // Verify the image loads successfully
      const imageSrc = await serviceImage.getAttribute('src');
      expect(imageSrc).toContain(service.imagePath);
    }
  });

  test('No 404 errors for any images', async ({ page }) => {
    const imageErrors: string[] = [];

    // Listen for failed image requests
    page.on('response', response => {
      if (response.url().includes('/images/') && response.status() === 404) {
        imageErrors.push(response.url());
      }
    });

    // Test homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test services page
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Check that no image 404s occurred
    expect(imageErrors).toEqual([]);
  });

  test('Hero image brightness is visually improved', async ({ page }) => {
    // Take screenshot of hero section for visual validation
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Ensure hero image is loaded
    const heroImage = page.locator('section img[aria-hidden="true"]').first();
    await expect(heroImage).toBeVisible();

    // Wait for image to fully load
    await page.waitForLoadState('networkidle');

    // Take screenshot for manual validation if needed
    await heroSection.screenshot({ 
      path: 'test-results/hero-brightness-validation.png',
      animations: 'disabled'
    });

    // Verify the image has the brightness filter applied
    const computedStyle = await heroImage.evaluate((img) => {
      return window.getComputedStyle(img).filter;
    });

    expect(computedStyle).toContain('brightness(1.2)');
  });

  test('Service images load within reasonable time', async ({ page }) => {
    // Test homepage service images load quickly
    await page.goto('/');

    const serviceImages = page.locator('img[src*="/images/photos/"]');
    const imageCount = await serviceImages.count();

    // Wait for all service images to load
    for (let i = 0; i < imageCount; i++) {
      const image = serviceImages.nth(i);
      await expect(image).toBeVisible({ timeout: 5000 });
    }

    // Test services page images load quickly
    await page.goto('/services');

    const servicesPageImages = page.locator('img[src*="/images/photos/"]');
    const servicesImageCount = await servicesPageImages.count();

    for (let i = 0; i < servicesImageCount; i++) {
      const image = servicesPageImages.nth(i);
      await expect(image).toBeVisible({ timeout: 5000 });
    }
  });
});