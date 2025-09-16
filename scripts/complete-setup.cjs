const fs = require('fs');
const { google } = require('googleapis');

/**
 * Complete Setup Script for Somerset Window Cleaning
 * Sets up both GA4 and PageSpeed Insights APIs
 */

class CompleteSetup {
  constructor() {
    this.serviceAccount = null;
    this.auth = null;
  }

  async loadServiceAccount() {
    try {
      this.serviceAccount = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'));
      this.auth = new google.auth.GoogleAuth({
        credentials: this.serviceAccount,
        scopes: [
          'https://www.googleapis.com/auth/analytics.edit',
          'https://www.googleapis.com/auth/analytics.provision',
          'https://www.googleapis.com/auth/cloud-platform'
        ]
      });
      return true;
    } catch (error) {
      console.log('⚠️  Service account not found or invalid');
      return false;
    }
  }

  async enableAPIs() {
    console.log('🔧 Enabling required Google APIs...');
    
    if (!this.auth) {
      console.log('❌ Authentication not available');
      return false;
    }

    try {
      const serviceUsage = google.serviceusage({
        version: 'v1',
        auth: this.auth
      });

      const projectId = this.serviceAccount.project_id;
      console.log(`📋 Project ID: ${projectId}`);

      // Enable Analytics Admin API
      console.log('🚀 Enabling Analytics Admin API...');
      await serviceUsage.services.enable({
        name: `projects/${projectId}/services/analyticsadmin.googleapis.com`
      });

      // Enable PageSpeed Insights API
      console.log('🚀 Enabling PageSpeed Insights API...');
      await serviceUsage.services.enable({
        name: `projects/${projectId}/services/pagespeedonline.googleapis.com`
      });

      console.log('✅ APIs enabled successfully!');
      return true;
    } catch (error) {
      console.log('❌ Failed to enable APIs:', error.message);
      return false;
    }
  }

  async createGA4Property() {
    console.log('🏗️  Creating GA4 property...');

    try {
      const analytics = google.analyticsadmin({
        version: 'v1beta',
        auth: this.auth
      });

      // List accounts
      const accounts = await analytics.accounts.list();
      if (!accounts.data.accounts || accounts.data.accounts.length === 0) {
        console.log('❌ No Google Analytics accounts found');
        return null;
      }

      const account = accounts.data.accounts[0];
      console.log(`✅ Using account: ${account.displayName}`);

      // Create property
      const property = await analytics.properties.create({
        requestBody: {
          parent: account.name,
          displayName: 'Somerset Window Cleaning Website',
          propertyType: 'PROPERTY_TYPE_GA4',
          timeZone: 'Europe/London',
          currencyCode: 'GBP',
          industryCategory: 'BUSINESS_AND_INDUSTRIAL_MARKETS'
        }
      });

      const propertyId = property.data.name.split('/')[1];
      console.log(`🎉 GA4 Property created: ${propertyId}`);

      // Create data stream
      const dataStream = await analytics.properties.dataStreams.create({
        parent: `properties/${propertyId}`,
        requestBody: {
          type: 'WEB_DATA_STREAM',
          displayName: 'Somerset Window Cleaning Web Stream',
          webStreamData: {
            defaultUri: 'https://somersetwindowcleaning.co.uk'
          }
        }
      });

      const measurementId = dataStream.data.webStreamData.measurementId;
      console.log(`📊 Measurement ID: ${measurementId}`);

      return { propertyId, measurementId };
    } catch (error) {
      console.log('❌ GA4 setup failed:', error.message);
      return null;
    }
  }

  async createPageSpeedAPIKey() {
    console.log('🔑 Creating PageSpeed Insights API key...');

    try {
      const apiKeys = google.apikeys({
        version: 'v2',
        auth: this.auth
      });

      const projectId = this.serviceAccount.project_id;

      const key = await apiKeys.projects.locations.keys.create({
        parent: `projects/${projectId}/locations/global`,
        requestBody: {
          displayName: 'Somerset Window Cleaning PageSpeed API Key',
          restrictions: {
            apiTargets: [{
              service: 'pagespeedonline.googleapis.com'
            }],
            browserKeyRestrictions: {
              allowedReferrers: [
                'https://somersetwindowcleaning.co.uk/*',
                'http://localhost:3000/*'
              ]
            }
          }
        }
      });

      const apiKey = key.data.keyString;
      console.log(`🔑 PageSpeed API Key created: ${apiKey.substring(0, 10)}...`);

      return apiKey;
    } catch (error) {
      console.log('❌ PageSpeed API key creation failed:', error.message);
      // Fallback: provide manual instructions
      console.log('📋 Manual PageSpeed API key creation:');
      console.log('1. Go to: https://console.developers.google.com/apis/credentials');
      console.log('2. Click "Create Credentials" → "API Key"');
      console.log('3. Restrict to PageSpeed Insights API');
      console.log('4. Add your domain restrictions');
      return null;
    }
  }

  async updateEnvironmentFiles(ga4Data, pageSpeedKey) {
    console.log('📝 Updating environment configuration...');

    // Update .env.local
    let envContent = fs.readFileSync('.env.local', 'utf8');
    
    if (ga4Data) {
      envContent = envContent.replace(
        'NEXT_PUBLIC_GA_MEASUREMENT_ID=G-PLACEHOLDER',
        `NEXT_PUBLIC_GA_MEASUREMENT_ID=${ga4Data.measurementId}`
      );
      envContent = envContent.replace(
        'NEXT_PUBLIC_GA_TRACKING_ENABLED=false',
        'NEXT_PUBLIC_GA_TRACKING_ENABLED=true'
      );
    }

    if (pageSpeedKey) {
      envContent = envContent.replace(
        'NEXT_PUBLIC_PAGESPEED_API_KEY=YOUR_PAGESPEED_API_KEY_HERE',
        `NEXT_PUBLIC_PAGESPEED_API_KEY=${pageSpeedKey}`
      );
    }

    fs.writeFileSync('.env.local', envContent);
    console.log('✅ .env.local updated');

    // Generate Vercel environment commands
    console.log('\n🚀 Vercel Environment Setup Commands:');
    if (ga4Data) {
      console.log(`npx vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production`);
      console.log(`# Enter: ${ga4Data.measurementId}`);
      console.log(`npx vercel env add NEXT_PUBLIC_GA_TRACKING_ENABLED production`);
      console.log(`# Enter: true`);
    }
    if (pageSpeedKey) {
      console.log(`npx vercel env add NEXT_PUBLIC_PAGESPEED_API_KEY production`);
      console.log(`# Enter: ${pageSpeedKey}`);
    }
  }

  async testPageSpeedAPI(apiKey) {
    console.log('🧪 Testing PageSpeed Insights API...');

    try {
      const testUrl = 'https://somersetwindowcleaning.co.uk';
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(testUrl)}&key=${apiKey}&strategy=mobile&category=performance`;

      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        const score = Math.round(data.lighthouseResult.categories.performance.score * 100);
        console.log(`✅ PageSpeed API working! Current mobile score: ${score}/100`);
        return true;
      } else {
        console.log('❌ PageSpeed API test failed');
        return false;
      }
    } catch (error) {
      console.log('❌ PageSpeed API test error:', error.message);
      return false;
    }
  }

  async run() {
    console.log('🚀 Starting complete setup for Somerset Window Cleaning...\n');

    // Step 1: Load service account
    const hasAuth = await this.loadServiceAccount();
    if (!hasAuth) {
      console.log('📋 Manual Setup Required:');
      console.log('1. GA4: Go to https://analytics.google.com');
      console.log('2. Create property "Somerset Window Cleaning"');
      console.log('3. Get Measurement ID and update .env.local');
      console.log('4. PageSpeed: Go to https://console.developers.google.com/apis/credentials');
      console.log('5. Create API key for PageSpeed Insights');
      return;
    }

    // Step 2: Enable APIs
    const apisEnabled = await this.enableAPIs();
    if (apisEnabled) {
      console.log('⏳ Waiting for API propagation (30 seconds)...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }

    // Step 3: Create GA4 property
    const ga4Data = await this.createGA4Property();

    // Step 4: Create PageSpeed API key
    const pageSpeedKey = await this.createPageSpeedAPIKey();

    // Step 5: Test PageSpeed API
    if (pageSpeedKey) {
      await this.testPageSpeedAPI(pageSpeedKey);
    }

    // Step 6: Update environment files
    await this.updateEnvironmentFiles(ga4Data, pageSpeedKey);

    // Final summary
    console.log('\n🎉 Setup Complete!');
    console.log('📊 Services configured:');
    if (ga4Data) {
      console.log(`   ✅ Google Analytics 4: ${ga4Data.measurementId}`);
    }
    if (pageSpeedKey) {
      console.log(`   ✅ PageSpeed Insights API: ${pageSpeedKey.substring(0, 10)}...`);
    }

    console.log('\n📚 Next steps:');
    console.log('1. Run: npm run build');
    console.log('2. Deploy: npx vercel --prod');
    console.log('3. Test analytics: Fill out contact form');
    console.log('4. Run performance audit: node scripts/performance-audit.cjs');
  }
}

// Manual setup instructions
console.log('🔧 Complete Setup for Analytics & Performance Monitoring');
console.log('═══════════════════════════════════════════════════════');
console.log('');

if (require.main === module) {
  const setup = new CompleteSetup();
  setup.run().catch(error => {
    console.error('❌ Setup failed:', error.message);
    console.log('\n📋 Fallback to manual setup:');
    console.log('GA4: https://analytics.google.com');
    console.log('PageSpeed API: https://console.developers.google.com/apis/credentials');
  });
}

module.exports = CompleteSetup;