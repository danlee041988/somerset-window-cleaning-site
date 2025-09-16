/**
 * Google Domain Verification Script
 * Helps verify domain ownership for Google Business Profile
 */

const fs = require('fs');
const path = require('path');

class DomainVerification {
  constructor() {
    this.publicDir = path.join(process.cwd(), 'public');
  }

  // Create Google Site Verification file
  createGoogleVerification(verificationCode) {
    console.log('🔍 Creating Google domain verification file...');
    
    const fileName = `google${verificationCode}.html`;
    const filePath = path.join(this.publicDir, fileName);
    const content = `google-site-verification: google${verificationCode}.html`;
    
    try {
      if (!fs.existsSync(this.publicDir)) {
        fs.mkdirSync(this.publicDir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Created verification file: /public/${fileName}`);
      console.log(`🌐 Access at: https://somersetwindowcleaning.co.uk/${fileName}`);
      return true;
    } catch (error) {
      console.error('❌ Error creating verification file:', error.message);
      return false;
    }
  }

  // Add verification meta tag to layout
  addMetaVerification(verificationCode) {
    console.log('🏷️ Adding meta verification tag...');
    
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    
    try {
      let layoutContent = fs.readFileSync(layoutPath, 'utf8');
      
      // Check if verification already exists
      if (layoutContent.includes('google-site-verification')) {
        console.log('⚠️ Google verification meta tag already exists');
        return true;
      }
      
      // Add meta tag to head
      const metaTag = `    <meta name="google-site-verification" content="${verificationCode}" />`;
      
      // Find the head section and add meta tag
      layoutContent = layoutContent.replace(
        '      <head>',
        `      <head>\n${metaTag}`
      );
      
      fs.writeFileSync(layoutPath, layoutContent);
      console.log('✅ Added verification meta tag to layout.tsx');
      return true;
    } catch (error) {
      console.error('❌ Error adding meta tag:', error.message);
      return false;
    }
  }

  // Generate robots.txt with sitemap
  updateRobotsTxt() {
    console.log('🤖 Updating robots.txt for better indexing...');
    
    const robotsPath = path.join(this.publicDir, 'robots.txt');
    const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://somersetwindowcleaning.co.uk/sitemap.xml

# Business-specific
Allow: /services/*
Allow: /areas/*
Allow: /get-in-touch
Allow: /compare-services

# Optimize crawling
Crawl-delay: 1`;

    try {
      fs.writeFileSync(robotsPath, robotsContent);
      console.log('✅ Updated robots.txt');
      return true;
    } catch (error) {
      console.error('❌ Error updating robots.txt:', error.message);
      return false;
    }
  }

  // Create sitemap.xml for better indexing
  createSitemap() {
    console.log('🗺️ Creating sitemap.xml...');
    
    const sitemapPath = path.join(this.publicDir, 'sitemap.xml');
    const baseUrl = 'https://somersetwindowcleaning.co.uk';
    
    const urls = [
      { url: '', priority: '1.0', changefreq: 'weekly' },
      { url: '/services', priority: '0.9', changefreq: 'weekly' },
      { url: '/services/window-cleaning', priority: '0.9', changefreq: 'monthly' },
      { url: '/services/gutter-clearing', priority: '0.9', changefreq: 'monthly' },
      { url: '/services/conservatory-roof-cleaning', priority: '0.8', changefreq: 'monthly' },
      { url: '/services/solar-panel-cleaning', priority: '0.8', changefreq: 'monthly' },
      { url: '/get-in-touch', priority: '0.9', changefreq: 'monthly' },
      { url: '/areas/wells-ba5', priority: '0.8', changefreq: 'monthly' },
      { url: '/compare-services', priority: '0.7', changefreq: 'monthly' }
    ];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    try {
      fs.writeFileSync(sitemapPath, sitemapContent);
      console.log('✅ Created sitemap.xml');
      return true;
    } catch (error) {
      console.error('❌ Error creating sitemap:', error.message);
      return false;
    }
  }

  // Complete verification setup
  async setupDomainVerification(verificationCode) {
    console.log('🚀 Setting up Google domain verification for Somerset Window Cleaning...\n');
    
    if (!verificationCode) {
      console.log('❌ Verification code required');
      console.log('📋 Steps to get verification code:');
      console.log('1. Go to https://business.google.com');
      console.log('2. Add or claim your business');
      console.log('3. When asked to verify ownership, choose "HTML file upload"');
      console.log('4. Copy the verification code (looks like: abcd1234efgh5678)');
      console.log('5. Run: node scripts/verify-domain-ownership.cjs YOUR_CODE');
      return;
    }

    const results = {
      fileCreated: this.createGoogleVerification(verificationCode),
      metaAdded: this.addMetaVerification(verificationCode),
      robotsUpdated: this.updateRobotsTxt(),
      sitemapCreated: this.createSitemap()
    };

    console.log('\n📊 Verification Setup Results:');
    console.log(`   HTML File: ${results.fileCreated ? '✅' : '❌'}`);
    console.log(`   Meta Tag: ${results.metaAdded ? '✅' : '❌'}`);
    console.log(`   Robots.txt: ${results.robotsUpdated ? '✅' : '❌'}`);
    console.log(`   Sitemap: ${results.sitemapCreated ? '✅' : '❌'}`);

    if (Object.values(results).every(r => r)) {
      console.log('\n🎉 Domain verification setup complete!');
      console.log('\n📚 Next steps:');
      console.log('1. Deploy to Vercel: npx vercel --prod');
      console.log('2. Go back to Google Business Profile');
      console.log('3. Click "Verify" to confirm domain ownership');
      console.log('4. Wait 24-48 hours for full verification');
    } else {
      console.log('\n⚠️ Some steps failed. Please check errors above.');
    }
  }
}

// Command line usage
if (require.main === module) {
  const verificationCode = process.argv[2];
  const verifier = new DomainVerification();
  verifier.setupDomainVerification(verificationCode);
}

module.exports = DomainVerification;