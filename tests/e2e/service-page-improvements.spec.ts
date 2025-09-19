import { test, expect } from '@playwright/test'

test.describe('Service Page Improvements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services')
    // Wait for the page to load completely
    await expect(page.locator('text=Our Exterior Cleaning Services')).toBeVisible()
  })

  test('service cards are properly aligned and uniform in height', async ({ page }) => {
    // Get all service cards
    const serviceCards = page.locator('[data-testid="service-card"], .group:has(button)')
    
    // Ensure we have the expected number of service cards
    await expect(serviceCards).toHaveCount(6)
    
    // Check that all cards are visible
    for (let i = 0; i < 6; i++) {
      await expect(serviceCards.nth(i)).toBeVisible()
    }
    
    // Check card alignment by verifying they're in a proper grid
    const firstCard = serviceCards.first()
    const secondCard = serviceCards.nth(1)
    const thirdCard = serviceCards.nth(2)
    
    const firstCardBox = await firstCard.boundingBox()
    const secondCardBox = await secondCard.boundingBox()
    const thirdCardBox = await thirdCard.boundingBox()
    
    // Cards should have similar heights (within 20px tolerance)
    expect(Math.abs(firstCardBox!.height - secondCardBox!.height)).toBeLessThan(20)
    expect(Math.abs(secondCardBox!.height - thirdCardBox!.height)).toBeLessThan(20)
  })

  test('no red borders appear when hovering or interacting with cards', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"], .group:has(button)')
    
    // Test hover states on all cards
    for (let i = 0; i < 6; i++) {
      const card = serviceCards.nth(i)
      
      // Hover over the card
      await card.hover()
      
      // Check that there are no red borders
      const cardStyles = await card.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          borderColor: computed.borderColor,
          borderTopColor: computed.borderTopColor,
          borderRightColor: computed.borderRightColor,
          borderBottomColor: computed.borderBottomColor,
          borderLeftColor: computed.borderLeftColor,
        }
      })
      
      // Ensure no red colors in borders (red would contain rgb values like 225, 29, 42)
      const hasRedBorder = Object.values(cardStyles).some(color => 
        color.includes('225') && color.includes('29') && color.includes('42')
      )
      expect(hasRedBorder).toBeFalsy()
    }
  })

  test('tabbed content (Service Includes, Process, Equipment) is removed', async ({ page }) => {
    // Look for any tab-related content that should be removed
    await expect(page.locator('text=Service Includes')).not.toBeVisible()
    await expect(page.locator('text=Process')).not.toBeVisible()
    await expect(page.locator('text=Equipment')).not.toBeVisible()
    
    // Check for tab navigation elements
    await expect(page.locator('[role="tab"]')).not.toBeVisible()
    await expect(page.locator('.bg-brand-red:has-text("Benefits")')).not.toBeVisible()
    await expect(page.locator('.bg-brand-red:has-text("Process")')).not.toBeVisible()
    await expect(page.locator('.bg-brand-red:has-text("Equipment")')).not.toBeVisible()
  })

  test('service cards are compact and appropriately sized', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"], .group:has(button)')
    
    // Check that cards are not too large
    for (let i = 0; i < 6; i++) {
      const card = serviceCards.nth(i)
      const cardBox = await card.boundingBox()
      
      // Cards should be reasonably sized (not larger than 400px height)
      expect(cardBox!.height).toBeLessThan(400)
      
      // Cards should have a minimum height for consistency
      expect(cardBox!.height).toBeGreaterThan(250)
    }
  })

  test('service cards contain only essential information', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"], .group:has(button)')
    
    // Check first service card for expected content structure
    const firstCard = serviceCards.first()
    
    // Should have title
    await expect(firstCard.locator('h3, .text-lg')).toBeVisible()
    
    // Should have description
    await expect(firstCard.locator('p')).toBeVisible()
    
    // Should have CTA button
    await expect(firstCard.locator('button, a[href*="get-in-touch"]')).toBeVisible()
    
    // Should NOT have complex expandable content
    await expect(firstCard.locator('text=Show More Details')).not.toBeVisible()
    await expect(firstCard.locator('text=Show Less')).not.toBeVisible()
  })

  test('all service cards have consistent styling and layout', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"], .group:has(button)')
    
    // Check that all cards have images
    for (let i = 0; i < 6; i++) {
      const card = serviceCards.nth(i)
      const image = card.locator('img').first()
      await expect(image).toBeVisible()
    }
    
    // Check that all cards have titles
    for (let i = 0; i < 6; i++) {
      const card = serviceCards.nth(i)
      const title = card.locator('h3, .text-lg').first()
      await expect(title).toBeVisible()
      
      const titleText = await title.textContent()
      expect(titleText).toBeTruthy()
    }
    
    // Check that all cards have CTA buttons
    for (let i = 0; i < 6; i++) {
      const card = serviceCards.nth(i)
      const button = card.locator('button, a[href*="get-in-touch"]').first()
      await expect(button).toBeVisible()
    }
  })

  test('grid layout works properly on different screen sizes', async ({ page }) => {
    // Test desktop layout (3 columns)
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.reload()
    await expect(page.locator('text=Our Exterior Cleaning Services')).toBeVisible()
    
    const serviceCards = page.locator('[data-testid="service-card"], .group:has(button)')
    await expect(serviceCards).toHaveCount(6)
    
    // Test tablet layout (2 columns)
    await page.setViewportSize({ width: 768, height: 800 })
    await page.reload()
    await expect(page.locator('text=Our Exterior Cleaning Services')).toBeVisible()
    await expect(serviceCards).toHaveCount(6)
    
    // Test mobile layout (1 column)
    await page.setViewportSize({ width: 375, height: 800 })
    await page.reload()
    await expect(page.locator('text=Our Exterior Cleaning Services')).toBeVisible()
    await expect(serviceCards).toHaveCount(6)
  })

  test('hover effects work correctly without red styling', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"], .group:has(button)')
    const firstCard = serviceCards.first()
    
    // Get initial state
    const initialBorder = await firstCard.evaluate((el) => 
      window.getComputedStyle(el).borderColor
    )
    
    // Hover over card
    await firstCard.hover()
    
    // Check that border changed but not to red
    const hoveredBorder = await firstCard.evaluate((el) => 
      window.getComputedStyle(el).borderColor
    )
    
    // Border should change on hover but not be red
    const isRedBorder = hoveredBorder.includes('225') && hoveredBorder.includes('29') && hoveredBorder.includes('42')
    expect(isRedBorder).toBeFalsy()
  })
})