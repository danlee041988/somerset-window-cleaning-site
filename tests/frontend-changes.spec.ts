import { test, expect } from '@playwright/test'

test.describe('Frontend Changes Validation', () => {
  
  test.describe('Header Logo Styling', () => {
    test('logo displays seamlessly in header without visible borders', async ({ page }) => {
      await page.goto('/')
      
      // Check logo is present and visible
      const logo = page.locator('header img[alt="Somerset Window Cleaning"]')
      await expect(logo).toBeVisible()
      
      // Verify logo has proper blend styling classes
      await expect(logo).toHaveClass(/logo-blend/)
      await expect(logo).toHaveClass(/transition-all/)
      
      // Check computed styles to ensure seamless integration
      const logoStyles = await logo.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          mixBlendMode: computed.mixBlendMode,
          background: computed.background,
          border: computed.border,
          outline: computed.outline,
          filter: computed.filter
        }
      })
      
      // Verify blend mode is applied for seamless integration
      expect(logoStyles.mixBlendMode).toBe('multiply')
      expect(logoStyles.background).toContain('transparent')
      expect(logoStyles.border).toContain('none')
      expect(logoStyles.outline).toContain('none')
      expect(logoStyles.filter).toContain('invert(1)')
    })

    test('logo maintains visibility while scrolling', async ({ page }) => {
      await page.goto('/')
      
      const logo = page.locator('header img[alt="Somerset Window Cleaning"]')
      
      // Logo visible at top of page
      await expect(logo).toBeVisible()
      
      // Scroll down the page
      await page.evaluate(() => window.scrollTo(0, 500))
      await page.waitForTimeout(100)
      
      // Logo still visible after scroll (fixed header)
      await expect(logo).toBeVisible()
      
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(100)
      
      // Logo still visible at bottom
      await expect(logo).toBeVisible()
    })

    test('logo has proper sizing across different screen sizes', async ({ page }) => {
      // Test desktop size
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.goto('/')
      
      const logo = page.locator('header img[alt="Somerset Window Cleaning"]')
      await expect(logo).toBeVisible()
      
      // Test tablet size
      await page.setViewportSize({ width: 768, height: 1024 })
      await expect(logo).toBeVisible()
      
      // Test mobile size
      await page.setViewportSize({ width: 375, height: 667 })
      await expect(logo).toBeVisible()
    })
  })

  test.describe('Hero Section Red Dots', () => {
    test('displays three red dots separating hero tagline text', async ({ page }) => {
      await page.goto('/')
      
      // Find the hero tagline section
      const tagline = page.locator('span:has-text("Local") >> xpath=..')
      await expect(tagline).toBeVisible()
      
      // Check for red dots (should be 3 span elements with brand-red background)
      const redDots = tagline.locator('span[style*="background-color: var(--brand-red)"]')
      await expect(redDots).toHaveCount(3)
      
      // Verify the text content is properly separated
      await expect(tagline).toContainText('Local')
      await expect(tagline).toContainText('Reliable') 
      await expect(tagline).toContainText('Fully Insured')
    })

    test('red dots have proper styling and spacing', async ({ page }) => {
      await page.goto('/')
      
      const redDots = page.locator('span[style*="background-color: var(--brand-red)"]')
      
      // Check each dot has proper dimensions
      for (let i = 0; i < 3; i++) {
        const dot = redDots.nth(i)
        const styles = await dot.evaluate((el) => {
          const computed = window.getComputedStyle(el)
          return {
            width: computed.width,
            height: computed.height,
            borderRadius: computed.borderRadius,
            backgroundColor: computed.backgroundColor
          }
        })
        
        // Verify dot dimensions (should be 6px x 6px - h-1.5 w-1.5)
        expect(styles.width).toBe('6px')
        expect(styles.height).toBe('6px')
        expect(styles.borderRadius).toBe('9999px') // rounded-full
      }
    })
  })

  test.describe('Recent Work Section', () => {
    test('Recent Work section displays without Somerset Council logo', async ({ page }) => {
      await page.goto('/')
      
      // Find Recent Work section
      const recentWorkSection = page.locator('section:has(h2:text("Recent work"))')
      await expect(recentWorkSection).toBeVisible()
      
      // Check that gallery images are loaded
      const galleryImages = recentWorkSection.locator('img')
      await expect(galleryImages.first()).toBeVisible()
      
      // Ensure no "Council" images are present
      const councilImages = recentWorkSection.locator('img[src*="Council"]')
      await expect(councilImages).toHaveCount(0)
      
      // Verify we still have gallery images (should be at least 8-12)
      await expect(galleryImages).toHaveCount({ min: 8 })
    })

    test('Recent Work gallery loads proper service images', async ({ page }) => {
      await page.goto('/')
      
      const recentWorkSection = page.locator('section:has(h2:text("Recent work"))')
      const galleryImages = recentWorkSection.locator('img')
      
      // Wait for images to load
      await expect(galleryImages.first()).toBeVisible()
      
      // Check that images have proper alt attributes
      const imageCount = await galleryImages.count()
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = galleryImages.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
        expect(alt).toContain('Somerset Window Cleaning')
      }
    })

    test('Recent Work section has proper service image mappings', async ({ page }) => {
      await page.goto('/services')
      
      // Check service cards use correct images
      const serviceCards = page.locator('[data-testid*="service-"], article:has(h3)')
      
      // Wait for service cards to load
      await expect(serviceCards.first()).toBeVisible()
      
      const cardCount = await serviceCards.count()
      
      // Verify each service card has an image
      for (let i = 0; i < cardCount; i++) {
        const card = serviceCards.nth(i)
        const img = card.locator('img').first()
        
        if (await img.isVisible()) {
          const src = await img.getAttribute('src')
          
          // Ensure no service uses the old logo placeholder
          expect(src).not.toContain('logo.png')
          expect(src).not.toContain('Council')
          
          // Should use actual photo URLs
          expect(src).toMatch(/\.(jpg|jpeg|png|webp)$/i)
        }
      }
    })

    test('Gallery page excludes Council logo from image collection', async ({ page }) => {
      await page.goto('/gallery')
      
      // Wait for gallery to load
      const galleryImages = page.locator('main img, [data-testid="gallery"] img, section img')
      await expect(galleryImages.first()).toBeVisible()
      
      // Check no Council images are present
      const councilImages = galleryImages.filter({ hasText: 'Council' })
      await expect(councilImages).toHaveCount(0)
      
      // Verify by checking src attributes
      const imageCount = await galleryImages.count()
      for (let i = 0; i < imageCount; i++) {
        const img = galleryImages.nth(i)
        const src = await img.getAttribute('src')
        if (src) {
          expect(src).not.toContain('Council')
        }
      }
    })
  })

  test.describe('Service Image Mappings', () => {
    test('conservatory service uses proper aerial photo instead of logo', async ({ page }) => {
      await page.goto('/services')
      
      // Find conservatory service card
      const conservatoryCard = page.locator('text=Conservatory').locator('..').locator('..')
      await expect(conservatoryCard).toBeVisible()
      
      // Check its image source
      const img = conservatoryCard.locator('img').first()
      if (await img.isVisible()) {
        const src = await img.getAttribute('src')
        
        // Should use DJI aerial photo, not logo
        expect(src).toMatch(/DJI_\d+\.JPG/i)
        expect(src).not.toContain('logo')
      }
    })

    test('all service cards have appropriate real photos', async ({ page }) => {
      await page.goto('/')
      
      // Find service cards in homepage preview
      const serviceCards = page.locator('article:has(h3), [class*="service"]').filter({ hasText: /(Window|Gutter|Conservatory|Solar|Fascia)/i })
      
      const cardCount = await serviceCards.count()
      expect(cardCount).toBeGreaterThan(0)
      
      // Check each service has a real photo
      for (let i = 0; i < Math.min(cardCount, 6); i++) {
        const card = serviceCards.nth(i)
        const img = card.locator('img').first()
        
        if (await img.isVisible()) {
          const src = await img.getAttribute('src')
          
          // Should be actual photos, not logos or placeholders
          expect(src).toMatch(/\.(jpg|jpeg|png|webp)$/i)
          expect(src).not.toContain('logo')
          expect(src).not.toContain('placeholder')
        }
      }
    })
  })

  test.describe('Cross-browser Logo Compatibility', () => {
    test('logo blend modes work across different browsers', async ({ page, browserName }) => {
      await page.goto('/')
      
      const logo = page.locator('header img[alt="Somerset Window Cleaning"]')
      await expect(logo).toBeVisible()
      
      // Check that logo is visible regardless of browser
      const logoBox = await logo.boundingBox()
      expect(logoBox).toBeTruthy()
      expect(logoBox!.width).toBeGreaterThan(0)
      expect(logoBox!.height).toBeGreaterThan(0)
      
      // Take screenshot for visual comparison if needed
      await expect(logo).toHaveScreenshot(`logo-${browserName}.png`)
    })
  })
})