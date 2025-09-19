import { test, expect } from '@playwright/test'

test.describe('Uniform Service Cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services')
  })

  test('should display all service cards with uniform height', async ({ page }) => {
    // Wait for service cards to load
    await page.waitForSelector('[data-testid="service-card"]', { timeout: 10000 })
    
    // Get all service cards
    const serviceCards = page.locator('[data-testid="service-card"]')
    const cardCount = await serviceCards.count()
    
    // Verify we have the expected number of services
    expect(cardCount).toBe(6)
    
    // Check that all cards have uniform height
    const cardHeights = []
    for (let i = 0; i < cardCount; i++) {
      const card = serviceCards.nth(i)
      const boundingBox = await card.boundingBox()
      if (boundingBox) {
        cardHeights.push(boundingBox.height)
      }
    }
    
    // All heights should be the same (400px as set in component)
    const firstHeight = cardHeights[0]
    cardHeights.forEach(height => {
      expect(Math.abs(height - firstHeight)).toBeLessThan(2) // Allow 2px tolerance
    })
  })

  test('should show swirl animation on card selection', async ({ page }) => {
    const firstCard = page.locator('[data-testid="service-card"]').first()
    
    // Click to select the card
    await firstCard.click()
    
    // Check that the card has selected state styling
    await expect(firstCard).toHaveClass(/border-brand-red/)
    await expect(firstCard).toHaveClass(/shadow-brand-red/)
  })

  test('should have CTA buttons on all cards', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"]')
    const cardCount = await serviceCards.count()
    
    // Check each card has a CTA button
    for (let i = 0; i < cardCount; i++) {
      const card = serviceCards.nth(i)
      const ctaButton = card.locator('a[href*="/get-in-touch"]')
      await expect(ctaButton).toBeVisible()
      await expect(ctaButton).toContainText('Get Quote')
    }
  })

  test('should navigate to quote page with service parameter', async ({ page }) => {
    const firstCard = page.locator('[data-testid="service-card"]').first()
    const ctaButton = firstCard.locator('a[href*="/get-in-touch"]')
    
    // Get the href to check service parameter
    const href = await ctaButton.getAttribute('href')
    expect(href).toContain('service=')
  })

  test('should display service information with photos', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"]')
    const firstCard = serviceCards.first()
    
    // Check that card contains text content
    await expect(firstCard.locator('h3')).toBeVisible() // Title
    await expect(firstCard.locator('p')).toBeVisible() // Description
    
    // Check that there are images in the cards
    const images = firstCard.locator('img')
    expect(await images.count()).toBeGreaterThan(0)
    
    // Verify image has proper alt text
    const firstImage = images.first()
    const altText = await firstImage.getAttribute('alt')
    expect(altText).toContain('Somerset Window Cleaning')
  })

  test('should show benefits list', async ({ page }) => {
    const firstCard = page.locator('[data-testid="service-card"]').first()
    
    // Check for benefits list items
    const benefitItems = firstCard.locator('[data-testid="benefit-item"]')
    expect(await benefitItems.count()).toBeGreaterThan(0)
    
    // Each benefit should have a bullet point icon
    for (let i = 0; i < Math.min(4, await benefitItems.count()); i++) {
      const benefit = benefitItems.nth(i)
      await expect(benefit.locator('.text-brand-red')).toBeVisible() // Bullet icon
    }
  })

  test('should display specialty badges', async ({ page }) => {
    // Look for specialty badges on cards that have them
    const specialtyBadges = page.locator('[data-testid="specialty-badge"]')
    
    if (await specialtyBadges.count() > 0) {
      await expect(specialtyBadges.first()).toBeVisible()
      await expect(specialtyBadges.first()).toHaveClass(/bg-brand-red/)
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    const serviceCards = page.locator('[data-testid="service-card"]')
    
    // On mobile, cards should stack vertically
    const firstCard = serviceCards.first()
    const secondCard = serviceCards.nth(1)
    
    const firstBox = await firstCard.boundingBox()
    const secondBox = await secondCard.boundingBox()
    
    if (firstBox && secondBox) {
      // Second card should be below first card (higher Y position)
      expect(secondBox.y).toBeGreaterThan(firstBox.y)
    }
  })
})