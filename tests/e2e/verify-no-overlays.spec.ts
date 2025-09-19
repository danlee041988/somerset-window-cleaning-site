import { test, expect } from '@playwright/test'

test.describe('Verify No Photo Overlays', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services')
  })

  test('should have clean service photos without overlay badges', async ({ page }) => {
    // Wait for service cards to load
    await page.waitForSelector('[data-testid="service-card"]', { timeout: 10000 })
    
    const serviceCards = page.locator('[data-testid="service-card"]')
    const cardCount = await serviceCards.count()
    
    for (let i = 0; i < cardCount; i++) {
      const card = serviceCards.nth(i)
      const cardTitle = await card.locator('h3').textContent()
      
      // Check that image sections exist
      const imageSection = card.locator('div.aspect-\\[16\\/9\\]')
      
      if (await imageSection.count() > 0) {
        // Verify NO specialty badges are overlaying the image
        const overlayBadges = imageSection.locator('[data-testid="specialty-badge"]')
        const badgeCount = await overlayBadges.count()
        
        expect(badgeCount).toBe(0) // Should be zero - no overlays on images
        
        // Verify NO absolute positioned text elements over images
        const absoluteTextElements = imageSection.locator('.absolute').filter({
          hasText: /.+/ // Any text content
        })
        const textOverlayCount = await absoluteTextElements.count()
        
        expect(textOverlayCount).toBe(0) // Should be zero - no text overlays
        
        console.log(`✅ Card "${cardTitle}" has clean image with no overlays`)
      }
      
      // Verify specialty badges are now in the content section (not over image)
      const contentSection = card.locator('div.relative.flex-1.p-6')
      const contentBadges = contentSection.locator('[data-testid="specialty-badge"]')
      const contentBadgeCount = await contentBadges.count()
      
      if (contentBadgeCount > 0) {
        const badgeText = await contentBadges.first().textContent()
        console.log(`✅ Card "${cardTitle}" has specialty badge "${badgeText}" in content section`)
      }
    }
  })

  test('should have specialty badges in content section only', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"]')
    
    for (let i = 0; i < await serviceCards.count(); i++) {
      const card = serviceCards.nth(i)
      const cardTitle = await card.locator('h3').textContent()
      
      // Check for specialty badges in content section
      const contentBadges = card.locator('[data-testid="specialty-badge"]')
      const badgeCount = await contentBadges.count()
      
      if (badgeCount > 0) {
        // Verify badge is NOT inside image section
        const imageSection = card.locator('div.aspect-\\[16\\/9\\]')
        const imageBadges = imageSection.locator('[data-testid="specialty-badge"]')
        const imageBadgeCount = await imageBadges.count()
        
        expect(imageBadgeCount).toBe(0) // Should be zero
        
        // Verify badge IS in content section
        const contentSection = card.locator('div.relative.flex-1.p-6')
        const contentBadges = contentSection.locator('[data-testid="specialty-badge"]')
        const contentBadgeCount = await contentBadges.count()
        
        expect(contentBadgeCount).toBeGreaterThan(0) // Should have at least one
        
        const badgeText = await contentBadges.first().textContent()
        console.log(`✅ Badge "${badgeText}" properly positioned in content for "${cardTitle}"`)
      }
    }
  })

  test('should have clean image presentation', async ({ page }) => {
    const serviceCards = page.locator('[data-testid="service-card"]')
    
    for (let i = 0; i < await serviceCards.count(); i++) {
      const card = serviceCards.nth(i)
      const cardTitle = await card.locator('h3').textContent()
      
      const imageSection = card.locator('div.aspect-\\[16\\/9\\]')
      
      if (await imageSection.count() > 0) {
        // Verify image loads
        const image = imageSection.locator('img')
        await expect(image).toBeVisible()
        
        // Verify no text overlays on image
        const textElements = imageSection.locator('text, span, div').filter({
          hasText: /Most Popular|Essential|Specialist|High-Tech|Business/
        })
        const textCount = await textElements.count()
        
        expect(textCount).toBe(0) // Should be zero - no specialty text on images
        
        console.log(`✅ Image for "${cardTitle}" is clean without text overlays`)
      }
    }
  })
})