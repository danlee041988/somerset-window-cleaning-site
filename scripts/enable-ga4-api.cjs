const { google } = require('googleapis');
const fs = require('fs');

/**
 * Enable Google Analytics Admin API
 * This script helps enable the required APIs for GA4 setup
 */

async function enableGA4API() {
  console.log('🔧 Enabling Google Analytics Admin API...');
  
  try {
    // Load service account
    const serviceAccount = JSON.parse(fs.readFileSync('./service-account-key.json', 'utf8'));
    const projectId = serviceAccount.project_id;
    
    console.log(`📋 Project ID: ${projectId}`);
    
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const serviceUsage = google.serviceusage({
      version: 'v1',
      auth: auth
    });

    // Enable Analytics Admin API
    console.log('🚀 Enabling Analytics Admin API...');
    
    const enableResult = await serviceUsage.services.enable({
      name: `projects/${projectId}/services/analyticsadmin.googleapis.com`
    });
    
    console.log('✅ Analytics Admin API enabled successfully!');
    
    // Also enable Analytics Reporting API (useful for data retrieval)
    console.log('🚀 Enabling Analytics Reporting API...');
    
    await serviceUsage.services.enable({
      name: `projects/${projectId}/services/analyticsreporting.googleapis.com`
    });
    
    console.log('✅ Analytics Reporting API enabled successfully!');
    
    console.log('\n⏳ Please wait 2-3 minutes for the APIs to propagate...');
    console.log('Then run: node scripts/setup-ga4.cjs');
    
  } catch (error) {
    if (error.message.includes('does not have permission')) {
      console.log('❌ Service account needs additional permissions');
      console.log('📝 Please add these roles to your service account:');
      console.log('   • Service Usage Admin');
      console.log('   • Analytics Admin');
      console.log('   • Project Editor (or Owner)');
      console.log('\n🌐 Go to: https://console.cloud.google.com/iam-admin/iam');
      console.log(`   Find: ${serviceAccount.client_email}`);
      console.log('   Add the roles above');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Manual instructions
console.log('🔧 Google Analytics Admin API Setup');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('📋 Manual Steps (if automated script fails):');
console.log('');
console.log('1. 🌐 Go to: https://console.developers.google.com/apis/api/analyticsadmin.googleapis.com/overview?project=874485656128');
console.log('2. 🔘 Click "Enable" button');
console.log('3. ⏳ Wait 2-3 minutes for propagation');
console.log('4. 🚀 Run: node scripts/setup-ga4.cjs');
console.log('');
console.log('🔑 Required Service Account Permissions:');
console.log('   • Analytics Admin');
console.log('   • Service Usage Admin');
console.log('   • Project Editor');
console.log('');
console.log('🌐 Grant permissions at: https://console.cloud.google.com/iam-admin/iam');
console.log('');

if (require.main === module) {
  enableGA4API().catch(console.error);
}