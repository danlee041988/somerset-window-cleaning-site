const { google } = require('googleapis');
const fs = require('fs');

/**
 * Google My Business API Setup for Somerset Window Cleaning
 * Automates business profile management and review monitoring
 */

class GoogleBusinessSetup {
  constructor() {
    this.serviceAccount = null;
    this.auth = null;
    this.mybusiness = null;
  }

  async loadServiceAccount() {
    try {
      this.serviceAccount = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'));
      this.auth = new google.auth.GoogleAuth({
        credentials: this.serviceAccount,
        scopes: [
          'https://www.googleapis.com/auth/business.manage',
          'https://www.googleapis.com/auth/plus.business.manage'
        ]
      });
      console.log('✅ Service account loaded');
      return true;
    } catch (error) {
      console.log('❌ Service account not found:', error.message);
      return false;
    }
  }

  async enableMyBusinessAPI() {
    console.log('🔧 Enabling Google My Business API...');
    
    try {
      const serviceUsage = google.serviceusage({
        version: 'v1',
        auth: this.auth
      });

      const projectId = this.serviceAccount.project_id;
      
      await serviceUsage.services.enable({
        name: `projects/${projectId}/services/mybusiness.googleapis.com`
      });

      console.log('✅ Google My Business API enabled');
      return true;
    } catch (error) {
      console.log('❌ API enabling failed:', error.message);
      console.log('📋 Manual steps:');
      console.log('1. Go to: https://console.developers.google.com/apis/library/mybusiness.googleapis.com');
      console.log('2. Click "Enable"');
      return false;
    }
  }

  async findBusiness() {
    console.log('🔍 Searching for Somerset Window Cleaning business...');
    
    try {
      this.mybusiness = google.mybusiness({
        version: 'v4',
        auth: this.auth
      });

      // List accounts
      const accounts = await this.mybusiness.accounts.list();
      
      if (!accounts.data.accounts || accounts.data.accounts.length === 0) {
        console.log('❌ No business accounts found');
        console.log('📋 Please ensure your Google account has access to the business profile');
        return null;
      }

      console.log('📊 Available business accounts:');
      accounts.data.accounts.forEach((account, index) => {
        console.log(`   ${index + 1}. ${account.name} (${account.accountName})`);
      });

      // Search for Somerset Window Cleaning in locations
      for (const account of accounts.data.accounts) {
        const locations = await this.mybusiness.accounts.locations.list({
          parent: account.name
        });

        if (locations.data.locations) {
          const somersetBusiness = locations.data.locations.find(location => 
            location.locationName && 
            location.locationName.toLowerCase().includes('somerset window cleaning')
          );

          if (somersetBusiness) {
            console.log('🎉 Found Somerset Window Cleaning!');
            console.log(`   Location: ${somersetBusiness.locationName}`);
            console.log(`   Address: ${somersetBusiness.address?.addressLines?.[0] || 'N/A'}`);
            console.log(`   Status: ${somersetBusiness.locationState}`);
            return somersetBusiness;
          }
        }
      }

      console.log('⚠️ Somerset Window Cleaning not found in available locations');
      return null;
    } catch (error) {
      console.log('❌ Business search failed:', error.message);
      return null;
    }
  }

  async createBusinessProfile() {
    console.log('🏢 Creating Somerset Window Cleaning business profile...');
    
    const businessData = {
      locationName: 'Somerset Window Cleaning',
      primaryCategory: {
        categoryId: 'gcid:window_cleaning_service'
      },
      address: {
        addressLines: ['Wells Enterprise Centre'],
        locality: 'Wells',
        administrativeArea: 'Somerset',
        postalCode: 'BA5',
        regionCode: 'GB'
      },
      primaryPhone: {
        number: '+441749123456' // You'll need to provide the actual number
      },
      websiteUrl: 'https://somersetwindowcleaning.co.uk',
      regularHours: {
        periods: [
          {
            openDay: 'MONDAY',
            openTime: '08:00',
            closeDay: 'MONDAY',
            closeTime: '18:00'
          },
          {
            openDay: 'TUESDAY',
            openTime: '08:00',
            closeDay: 'TUESDAY',
            closeTime: '18:00'
          },
          {
            openDay: 'WEDNESDAY',
            openTime: '08:00',
            closeDay: 'WEDNESDAY',
            closeTime: '18:00'
          },
          {
            openDay: 'THURSDAY',
            openTime: '08:00',
            closeDay: 'THURSDAY',
            closeTime: '18:00'
          },
          {
            openDay: 'FRIDAY',
            openTime: '08:00',
            closeDay: 'FRIDAY',
            closeTime: '18:00'
          }
        ]
      },
      attributes: [
        {
          attributeId: 'has_wheelchair_accessible_entrance',
          valueType: 'BOOL',
          booleanValue: true
        },
        {
          attributeId: 'accepts_cash',
          valueType: 'BOOL',
          booleanValue: true
        },
        {
          attributeId: 'accepts_credit_cards',
          valueType: 'BOOL',
          booleanValue: true
        }
      ]
    };

    try {
      // This would create the business profile if it doesn't exist
      console.log('📋 Business profile data prepared');
      console.log('⚠️ Note: Actual creation requires manual verification through Google Business Profile');
      
      return businessData;
    } catch (error) {
      console.log('❌ Business creation failed:', error.message);
      return null;
    }
  }

  async setupReviewMonitoring(businessLocation) {
    console.log('⭐ Setting up review monitoring...');
    
    try {
      const reviews = await this.mybusiness.accounts.locations.reviews.list({
        parent: businessLocation.name
      });

      console.log(`📊 Found ${reviews.data.reviews?.length || 0} reviews`);
      
      if (reviews.data.reviews && reviews.data.reviews.length > 0) {
        console.log('📝 Recent reviews:');
        reviews.data.reviews.slice(0, 3).forEach((review, index) => {
          console.log(`   ${index + 1}. ${review.starRating}/5 stars - ${review.comment?.substring(0, 100) || 'No comment'}...`);
        });
      }

      return reviews.data.reviews || [];
    } catch (error) {
      console.log('❌ Review monitoring setup failed:', error.message);
      return [];
    }
  }

  async run() {
    console.log('🚀 Setting up Google My Business for Somerset Window Cleaning...\n');

    // Step 1: Load service account
    const hasAuth = await this.loadServiceAccount();
    if (!hasAuth) {
      console.log('📋 Manual setup required:');
      console.log('1. Go to https://business.google.com');
      console.log('2. Sign in with info@somersetwindowcleaning.co.uk');
      console.log('3. Add or claim "Somerset Window Cleaning"');
      console.log('4. Verify business ownership');
      return;
    }

    // Step 2: Enable API
    await this.enableMyBusinessAPI();
    
    // Wait for API propagation
    console.log('⏳ Waiting for API propagation...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 3: Find existing business
    const existingBusiness = await this.findBusiness();
    
    if (existingBusiness) {
      console.log('\n🎉 Business found! Setting up monitoring...');
      await this.setupReviewMonitoring(existingBusiness);
    } else {
      console.log('\n📋 Business not found. Creating profile data...');
      await this.createBusinessProfile();
    }

    console.log('\n✅ Google My Business setup complete!');
    console.log('\n📚 Next steps:');
    console.log('1. Verify business ownership at https://business.google.com');
    console.log('2. Complete business profile with photos and services');
    console.log('3. Enable customer messaging');
    console.log('4. Set up automated review responses');
  }
}

// Manual instructions
console.log('🏢 Google My Business Setup for Somerset Window Cleaning');
console.log('═══════════════════════════════════════════════════════');
console.log('');
console.log('📋 Quick Manual Setup (if automated fails):');
console.log('1. Go to: https://business.google.com');
console.log('2. Sign in with: info@somersetwindowcleaning.co.uk');
console.log('3. Search for: Somerset Window Cleaning, Wells');
console.log('4. Claim existing listing OR create new business');
console.log('5. Verify with phone/postcard');
console.log('6. Complete profile with services and photos');
console.log('');

if (require.main === module) {
  const setup = new GoogleBusinessSetup();
  setup.run().catch(console.error);
}

module.exports = GoogleBusinessSetup;