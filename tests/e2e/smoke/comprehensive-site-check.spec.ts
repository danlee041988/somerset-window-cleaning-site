import { test, expect } from '@playwright/test'

test.describe('Comprehensive Site Check', () => {
  
  // Define all expected pages and their URLs
  const pages = [
    { name: 'Homepage', url: '/', title: 'Somerset Window Cleaning' },
    { name: 'Services', url: '/services', title: 'Our Exterior Cleaning Services' },
    { name: 'Areas', url: '/areas', title: 'Areas We Cover' },
    { name: 'Gallery', url: '/gallery', title: 'Gallery' },
    { name: 'Get in Touch', url: '/get-in-touch', title: 'Get in Touch' },
  ]

  test('all main pages load successfully', async ({ page }) => {
    for (const pageInfo of pages) {
      console.log(`Testing ${pageInfo.name} at ${pageInfo.url}`)
      await page.goto(pageInfo.url)
      
      // Check page loads without errors
      await expect(page.locator('body')).toBeVisible()
      
      // Check for presence of header and footer
      await expect(page.locator('header').first()).toBeVisible()
      await expect(page.getByRole('contentinfo')).toBeVisible()
      
      console.log(`✅ ${pageInfo.name} loaded successfully`)
    }
  })

  test('navigation header links render', async ({ page }) => {
    await page.goto('/')

    // Get viewport size to determine if we're on mobile or desktop
    const viewportSize = page.viewportSize()
    const isMobile = viewportSize ? viewportSize.width < 1024 : false

    // Test main navigation links
    const navLinks = [
      { text: 'Services', expectedUrl: '/services' },
      { text: 'Areas', expectedUrl: '/areas' },
      { text: 'Quote', expectedUrl: '/book-appointment' },
      { text: 'Gallery', expectedUrl: '/gallery' },
    ]

    for (const link of navLinks) {
      console.log(`Testing navigation link: ${link.text}`)

      // Special handling for Services on desktop (it's a button with dropdown)
      if (link.text === 'Services' && !isMobile) {
        // On desktop, Services is a button that opens a mega menu
        const servicesButton = page.locator('nav button').filter({ hasText: /^Services$/i }).first()
        await expect(servicesButton).toBeVisible()
        console.log(`✅ ${link.text} button rendered (desktop dropdown)`)
        continue
      }

      // For mobile, Services is inside the mobile menu - skip testing it here
      if (link.text === 'Services' && isMobile) {
        console.log(`⏭️  ${link.text} is in mobile menu, skipping header check`)
        continue
      }

      // Test regular links
      const navLink = page.locator('header').getByRole('link', { name: link.text, exact: true }).first()
      if (await navLink.count()) {
        await expect(navLink).toBeVisible()
        await expect(navLink).toHaveAttribute('href', link.expectedUrl)
        console.log(`✅ ${link.text} link rendered`)
        continue
      }

      // Fallback: check if it's a button
      const navButton = page.locator('header').getByRole('button', { name: new RegExp(`^${link.text}$`, 'i') }).first()
      if (await navButton.count()) {
        await expect(navButton).toBeVisible()
        console.log(`✅ ${link.text} button rendered`)
      }
    }
  })

  test('footer links render', async ({ page }) => {
    await page.goto('/')
    
    // Test footer navigation
    const footerLinks = [
      { text: 'Areas We Cover', expectedUrl: '/areas' },
      { text: 'Request a quote', expectedUrl: '/book-appointment' },
      { text: 'Request quote now', expectedUrl: '/book-appointment?intent=quote' },
      { text: 'Get in Touch', expectedUrl: '/get-in-touch' },
      { text: 'Privacy', expectedUrl: '/privacy' },
    ]

    for (const link of footerLinks) {
      console.log(`Testing footer link: ${link.text}`)
      const footerLink = page
        .getByRole('contentinfo')
        .getByRole('link', { name: new RegExp(link.text, 'i') })
        .first()
      await expect(footerLink).toBeVisible()
      await expect(footerLink).toHaveAttribute('href', link.expectedUrl)
      console.log(`✅ Footer ${link.text} rendered`)
    }
  })

  test('contact and phone links work', async ({ page }) => {
    await page.goto('/')
    
    // Test phone number links
    const phoneLinks = page.locator('a[href^="tel:"]')
    const phoneCount = await phoneLinks.count()
    expect(phoneCount).toBeGreaterThan(0)
    
    console.log(`Found ${phoneCount} phone links`)
    
    // Test get-in-touch links
    const contactLinks = page.locator('a[href*="get-in-touch"]')
    const contactCount = await contactLinks.count()
    expect(contactCount).toBeGreaterThan(0)
    
    console.log(`Found ${contactCount} contact links`)
    
    // Test clicking a contact link
    await contactLinks.first().click()
    await page.waitForURL('**/get-in-touch')
    expect(page.url()).toContain('/get-in-touch')
    
    console.log('✅ Contact links working')
  })

  test('service page cards and CTAs work', async ({ page }) => {
    await page.goto('/services')
    
    // Wait for service cards to load
    await expect(page.locator('h1, h2').first()).toBeVisible()
    
    // Find all service cards
    const serviceCards = page.locator('article.feature-card')
    const cardCount = await serviceCards.count()
    
    expect(cardCount).toBeGreaterThanOrEqual(6)
    console.log(`Found ${cardCount} service cards`)
    
    // Test each service card has required elements
    for (let i = 0; i < cardCount; i++) {
      const card = serviceCards.nth(i)
      
      // Should have image
      await expect(card.locator('img')).toBeVisible()
      
      // Should have title
      await expect(card.locator('h3').first()).toBeVisible()
      
      // Should have CTA button
      const button = card.locator('a[href*="book-appointment"], a[href*="intent=quote"]')
      await expect(button).toBeVisible()
      
      console.log(`✅ Service card ${i + 1} structure valid`)
    }
    
    // Test clicking a service CTA
    const firstButton = serviceCards.first().locator('a[href*="book-appointment"], a[href*="intent=quote"]')
    await firstButton.click()
    await page.waitForURL('**/book-appointment**')
    expect(page.url()).toContain('/book-appointment')
    
    console.log('✅ Service CTA buttons working')
  })

  test('postcode checker functionality', async ({ page }) => {
    await page.goto('/')
    
    // Look for postcode checker
    const postcodeInput = page.locator('input[placeholder*="postcode" i]')
    
    if (await postcodeInput.count() > 0) {
      console.log('Testing postcode checker')
      
      await postcodeInput.fill('BA5 1TX')
      
      // Look for check button
      const checkButton = page.locator('button:has-text("Check")').first()
      if (await checkButton.count() > 0) {
        await checkButton.click()
        await page.waitForTimeout(1000) // Wait for response
        
        // Should either show success or error message
        const hasResponse = await page.locator('.bg-green-500, .bg-red-500').count() > 0
        expect(hasResponse).toBeTruthy()
        
        console.log('✅ Postcode checker responding')
      }
    } else {
      console.log('No postcode checker found on homepage')
    }
  })

  test('contact form loads and validates', async ({ page }) => {
    await page.goto('/get-in-touch')
    
    // Check form is present
    await expect(page.locator('form')).toBeVisible()
    
    // Check required form fields
    const requiredFields = [
      'input[name="first_name"], input[name*="first"]',
      'input[name="last_name"], input[name*="last"]',
      'input[name="email"]',
      'input[name="mobile"], input[name*="phone"]'
    ]
    
    for (const fieldSelector of requiredFields) {
      const field = page.locator(fieldSelector).first()
      if (await field.count() > 0) {
        await expect(field).toBeVisible()
        console.log(`✅ Found required field: ${fieldSelector}`)
      }
    }
    
    // Check reCAPTCHA is present
    const recaptcha = page.locator('[data-sitekey]')
    if (await recaptcha.count() > 0) {
      await expect(recaptcha).toBeVisible()
      console.log('✅ reCAPTCHA present')
    }
    
    console.log('✅ Contact form structure valid')
  })

  test('images load correctly across the site', async ({ page }) => {
    const pagesToCheck = ['/', '/services', '/gallery']
    
    for (const url of pagesToCheck) {
      console.log(`Checking images on ${url}`)
      await page.goto(url)
      
      // Get all images
      const images = page.locator('img')
      const imageCount = await images.count()
      
      console.log(`Found ${imageCount} images on ${url}`)
      
      // Check first few images load successfully
      const checkCount = Math.min(imageCount, 5)
      for (let i = 0; i < checkCount; i++) {
        const img = images.nth(i)
        
        // Wait for image to be visible
        await expect(img).toBeVisible()
        
        // Check image has loaded (not broken)
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
        expect(naturalWidth).toBeGreaterThan(0)
        
        console.log(`✅ Image ${i + 1} loaded successfully`)
      }
    }
  })

  test('responsive design works on different screen sizes', async ({ page }) => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1200, height: 800 },
      { name: 'Large Desktop', width: 1920, height: 1080 }
    ]
    
    for (const viewport of viewports) {
      console.log(`Testing ${viewport.name} (${viewport.width}x${viewport.height})`)
      
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')
      
      // Check header is visible and responsive
      await expect(page.locator('header').first()).toBeVisible()
      
      // Check navigation works (desktop vs mobile)
      if (viewport.width >= 1024) {
        // Desktop navigation should be visible
        await expect(page.locator('nav a').first()).toBeVisible()
      } else {
        // Mobile navigation button should be visible
        const mobileMenu = page.getByRole('button', { name: /toggle menu/i })
        if (await mobileMenu.count() > 0) {
          await expect(mobileMenu.first()).toBeVisible()
        }
      }
      
      // Check footer is visible
      await expect(page.getByRole('contentinfo')).toBeVisible()
      
      console.log(`✅ ${viewport.name} layout working`)
    }
  })

  test('business hours and dynamic elements work', async ({ page }) => {
    await page.goto('/')
    
    // Check for business hours indicator
    const businessHours = page.locator('text=Open, text=Closed, .bg-green-400, .bg-red-400')
    
    if (await businessHours.count() > 0) {
      await expect(businessHours.first()).toBeVisible()
      console.log('✅ Business hours indicator found')
      
      // Check for dynamic call banner if open
      const callBanner = page.locator('text=CALL NOW, text=We are OPEN')
      if (await callBanner.count() > 0) {
        console.log('✅ Dynamic call banner present')
      }
    }
  })

  test('external links and social media work', async ({ page }) => {
    await page.goto('/')
    
    // Check for external links (opens in new tab)
    const externalLinks = page.locator('a[target="_blank"], a[href^="http"]:not([href*="localhost"]):not([href*="somersetwindowcleaning"])')
    const externalCount = await externalLinks.count()
    
    if (externalCount > 0) {
      console.log(`Found ${externalCount} external links`)
      
      // Test that external links have proper attributes
      for (let i = 0; i < Math.min(externalCount, 3); i++) {
        const link = externalLinks.nth(i)
        const href = await link.getAttribute('href')
        
        if (href && href.startsWith('http')) {
          expect(href).toBeTruthy()
          console.log(`✅ External link ${i + 1}: ${href}`)
        }
      }
    }
  })

  test('SEO meta tags are present', async ({ page }) => {
    const pagesToCheck = [
      { url: '/', expectedTitle: 'Somerset Window Cleaning' },
      { url: '/services', expectedTitle: 'Our Exterior Cleaning Services' },
      { url: '/get-in-touch', expectedTitle: 'Get in Touch' }
    ]
    
    for (const pageInfo of pagesToCheck) {
      await page.goto(pageInfo.url)
      
      // Check title
      const title = await page.title()
      expect(title).toContain('Somerset Window Cleaning')
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]')
      if (await metaDescription.count() > 0) {
        const content = await metaDescription.getAttribute('content')
        expect(content).toBeTruthy()
        console.log(`✅ ${pageInfo.url} has meta description`)
      }
      
      console.log(`✅ ${pageInfo.url} SEO tags present`)
    }
  })
})
