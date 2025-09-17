const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');

/**
 * Google Analytics 4 Setup Script
 * Automates GA4 property creation and configuration for Somerset Window Cleaning
 */

class GA4Setup {
  constructor() {
    this.analytics = null;
    this.auth = null;
  }

  async authenticate() {
    console.log('🔐 Setting up Google Analytics Admin API authentication...');
    
    // Use service account if available, otherwise OAuth
    try {
      const serviceAccount = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'));
      this.auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: [
          'https://www.googleapis.com/auth/analytics.edit',
          'https://www.googleapis.com/auth/analytics.provision'
        ]
      });
      console.log('✅ Using service account authentication');
    } catch (error) {
      console.log('⚠️  Service account not found, using OAuth...');
      await this.setupOAuth();
    }

    this.analytics = google.analyticsadmin({
      version: 'v1beta',
      auth: this.auth
    });
  }

  async setupOAuth() {
    // OAuth setup for manual authentication
    const oauth2Client = new google.auth.OAuth2(
      'YOUR_CLIENT_ID', // You'll need to create OAuth credentials
      'YOUR_CLIENT_SECRET',
      'urn:ietf:wg:oauth:2.0:oob'
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/analytics.edit',
        'https://www.googleapis.com/auth/analytics.provision'
      ]
    });

    console.log('🌐 Open this URL in your browser:', authUrl);
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const code = await new Promise(resolve => {
      rl.question('Enter the authorization code: ', resolve);
    });
    
    rl.close();

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    this.auth = oauth2Client;
  }

  async createGA4Property() {
    console.log('🏗️  Creating GA4 property for Somerset Window Cleaning...');

    try {
      // First, we need an account - let's list existing accounts
      const accounts = await this.analytics.accounts.list();
      
      if (!accounts.data.accounts || accounts.data.accounts.length === 0) {
        console.log('❌ No Google Analytics accounts found. Please create one first at analytics.google.com');
        return null;
      }

      console.log('📊 Available Google Analytics accounts:');
      accounts.data.accounts.forEach((account, index) => {
        console.log(`   ${index + 1}. ${account.displayName} (${account.name})`);
      });

      // Use the first account (or you can modify this to select)
      const selectedAccount = accounts.data.accounts[0];
      console.log(`✅ Using account: ${selectedAccount.displayName}`);

      // Create GA4 property
      const property = await this.analytics.properties.create({
        requestBody: {
          parent: selectedAccount.name,
          displayName: 'Somerset Window Cleaning Website',
          propertyType: 'PROPERTY_TYPE_GA4',
          timeZone: 'Europe/London',
          currencyCode: 'GBP',
          industryCategory: 'BUSINESS_AND_INDUSTRIAL_MARKETS'
        }
      });

      console.log('🎉 GA4 Property created successfully!');
      console.log(`   Property ID: ${property.data.name.split('/')[1]}`);
      console.log(`   Display Name: ${property.data.displayName}`);

      return property.data;
    } catch (error) {
      console.error('❌ Error creating GA4 property:', error.message);
      return null;
    }
  }

  async createDataStream(propertyId) {
    console.log('🌊 Creating web data stream...');

    try {
      const dataStream = await this.analytics.properties.dataStreams.create({
        parent: `properties/${propertyId}`,
        requestBody: {
          type: 'WEB_DATA_STREAM',
          displayName: 'Somerset Window Cleaning Web Stream',
          webStreamData: {
            defaultUri: 'https://somersetwindowcleaning.co.uk',
            measurementId: '' // Will be auto-generated
          }
        }
      });

      console.log('🎉 Web data stream created successfully!');
      console.log(`   Stream ID: ${dataStream.data.name.split('/')[3]}`);
      console.log(`   Measurement ID: ${dataStream.data.webStreamData.measurementId}`);

      return dataStream.data;
    } catch (error) {
      console.error('❌ Error creating data stream:', error.message);
      return null;
    }
  }

  async setupEventTracking(propertyId) {
    console.log('📊 Setting up custom events for form tracking...');

    const customEvents = [
      {
        eventName: 'form_start',
        customName: 'Contact Form Started',
        countingMethod: 'ONCE_PER_SESSION'
      },
      {
        eventName: 'form_submit',
        customName: 'Contact Form Submitted',
        countingMethod: 'ONCE_PER_SESSION'
      },
      {
        eventName: 'form_error',
        customName: 'Contact Form Error',
        countingMethod: 'STANDARD'
      },
      {
        eventName: 'recaptcha_complete',
        customName: 'reCAPTCHA Completed',
        countingMethod: 'ONCE_PER_SESSION'
      }
    ];

    try {
      for (const event of customEvents) {
        await this.analytics.properties.customMetrics.create({
          parent: `properties/${propertyId}`,
          requestBody: {
            displayName: event.customName,
            measurementUnit: 'STANDARD',
            scope: 'EVENT'
          }
        });
        console.log(`✅ Created custom metric: ${event.customName}`);
      }
    } catch (error) {
      console.log('⚠️  Note: Custom metrics may require GA4 360 or may already exist');
    }
  }

  async generateEnvConfig(measurementId) {
    console.log('📝 Generating environment configuration...');

    const envConfig = `
# Google Analytics 4 Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=${measurementId}
NEXT_PUBLIC_GA_TRACKING_ENABLED=true
`;

    fs.appendFileSync('.env.local', envConfig);
    console.log('✅ Added GA4 configuration to .env.local');

    // Also update Vercel environment
    console.log('🚀 To add to Vercel, run:');
    console.log(`npx vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production`);
    console.log(`Then enter: ${measurementId}`);
  }

  async run() {
    console.log('🚀 Starting Google Analytics 4 setup for Somerset Window Cleaning...\n');

    try {
      await this.authenticate();
      
      const property = await this.createGA4Property();
      if (!property) return;

      const propertyId = property.name.split('/')[1];
      
      const dataStream = await this.createDataStream(propertyId);
      if (!dataStream) return;

      await this.setupEventTracking(propertyId);
      
      const measurementId = dataStream.webStreamData.measurementId;
      await this.generateEnvConfig(measurementId);

      console.log('\n🎉 GA4 Setup Complete!');
      console.log('📋 Summary:');
      console.log(`   Property ID: ${propertyId}`);
      console.log(`   Measurement ID: ${measurementId}`);
      console.log(`   Domain: https://somersetwindowcleaning.co.uk`);
      console.log('\n📚 Next steps:');
      console.log('1. Add the measurement ID to Vercel environment variables');
      console.log('2. Install GA4 tracking code in your Next.js app');
      console.log('3. Set up form event tracking');
      console.log('4. Configure conversion goals in GA4 dashboard');

    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      console.log('\n💡 Alternative: Manual setup at https://analytics.google.com');
    }
  }
}

// Run the setup
if (require.main === module) {
  const setup = new GA4Setup();
  setup.run().catch(console.error);
}

module.exports = GA4Setup;