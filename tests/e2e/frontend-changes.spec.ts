import { test, expect } from '@playwright/test'

function normalizeImageSrc(src: string | null): string {
  if (!src) return ''

  try {
    const decoded = decodeURIComponent(src)
    if (decoded.startsWith('/_next/image')) {
      const proxyUrl = new URL(decoded, 'https://example.com')
      const original = proxyUrl.searchParams.get('url')
      return original ? decodeURIComponent(original) : decoded
    }
    return decoded
  } catch {
    return src
  }
}

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
      expect(logoStyles.mixBlendMode).toBe('screen')
      expect(logoStyles.background).toContain('rgba(0, 0, 0, 0)')
      expect(logoStyles.border).toContain('none')
      expect(logoStyles.outline).toContain('none')
      expect(logoStyles.filter).toContain('brightness')
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

  test.describe('Hero Section Tagline', () => {
    test('displays the Local • Reliable • Fully Insured tagline chip', async ({ page }) => {
      await page.goto('/')

      const taglineChip = page.locator('.noir-chip', { hasText: 'Local • Reliable • Fully Insured' })
      await expect(taglineChip).toBeVisible()
      await expect(taglineChip).toContainText('Local')
      await expect(taglineChip).toContainText('Reliable')
      await expect(taglineChip).toContainText('Fully Insured')
    })

    test('tagline chip is styled as an accent pill', async ({ page }) => {
      await page.goto('/')

      const taglineChip = page.locator('.noir-chip', { hasText: 'Local • Reliable • Fully Insured' })
      await expect(taglineChip).toBeVisible()

      const chipStyles = await taglineChip.evaluate((el) => {
        const computed = window.getComputedStyle(el)
        return {
          display: computed.display,
          backgroundColor: computed.backgroundColor,
          borderRadius: computed.borderRadius,
          paddingInline: computed.paddingInlineStart,
        }
      })

      expect(['inline-flex', 'flex']).toContain(chipStyles.display)
      expect(chipStyles.borderRadius).toBe('9999px')
      expect(parseFloat(chipStyles.paddingInline)).toBeGreaterThan(4)
    })
  })

  test.describe('Recent Work Section', () => {
    test('Recent Work section displays without Somerset Council logo', async ({ page }) => {
      await page.goto('/')
      
      const recentWorkHeading = page.getByRole('heading', { name: /Recent work/i })
      await expect(recentWorkHeading).toBeVisible()

      const recentWorkSection = recentWorkHeading.locator('xpath=ancestor::section[1]')

      const galleryImages = recentWorkSection.locator('img')
      await expect(galleryImages.first()).toBeVisible()

      const imageCount = await galleryImages.count()
      expect(imageCount).toBeGreaterThanOrEqual(4)

      for (let i = 0; i < imageCount; i++) {
        const src = normalizeImageSrc(await galleryImages.nth(i).getAttribute('src'))
        if (!src) continue
        expect(src).not.toContain('Council')
        expect(src.toLowerCase()).toMatch(/\.(jpg|jpeg|png|webp)$/)
      }
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
      
      const serviceImages = page.locator('main img')
      await expect(serviceImages.first()).toBeVisible()

      const imageCount = await serviceImages.count()
      expect(imageCount).toBeGreaterThan(0)

      for (let i = 0; i < Math.min(imageCount, 6); i++) {
        const normalized = normalizeImageSrc(await serviceImages.nth(i).getAttribute('src')).toLowerCase()
        if (!normalized) continue
        expect(normalized).toMatch(/\.(jpg|jpeg|png|webp)$/)
        expect(normalized).not.toContain('logo')
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
      
      const primaryHeading = page.getByRole('heading', { name: /Exterior cleaning, perfected/i })
      await expect(primaryHeading).toBeVisible()
      const servicesIntroSection = primaryHeading.locator('xpath=ancestor::section[1]')

      const serviceImages = servicesIntroSection.locator('img')
      await expect(serviceImages.first()).toBeVisible()

      const imageCount = await serviceImages.count()
      expect(imageCount).toBeGreaterThan(0)

      for (let i = 0; i < imageCount; i++) {
        const src = normalizeImageSrc(await serviceImages.nth(i).getAttribute('src')).toLowerCase()
        if (!src) continue
        expect(src).not.toContain('logo')
        expect(src).not.toContain('.psd')
      }
    })

    test('all service cards have appropriate real photos', async ({ page }) => {
      await page.goto('/')
      
      const servicesHeading = page.getByRole('heading', { name: /Our most-requested services/i })
      await expect(servicesHeading).toBeVisible()
      const servicesSection = servicesHeading.locator('xpath=ancestor::section[1]')

      const serviceImages = servicesSection.locator('img')
      await expect(serviceImages.first()).toBeVisible()

      const imageCount = await serviceImages.count()
      expect(imageCount).toBeGreaterThan(0)

      for (let i = 0; i < imageCount; i++) {
        const src = normalizeImageSrc(await serviceImages.nth(i).getAttribute('src')).toLowerCase()
        if (!src) continue
        expect(src).toMatch(/\.(jpg|jpeg|png|webp)$/)
        expect(src).not.toContain('logo')
        expect(src).not.toContain('placeholder')
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

      const aspectRatio = logoBox!.width / logoBox!.height
      expect(aspectRatio).toBeGreaterThan(0.5)
      expect(aspectRatio).toBeLessThan(6)
    })
  })
})
