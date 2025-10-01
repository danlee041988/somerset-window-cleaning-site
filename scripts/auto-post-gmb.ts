#!/usr/bin/env tsx

/**
 * Automated Google Business Profile Posts
 * Run this weekly to keep your GMB profile active
 *
 * Usage:
 *   npx tsx scripts/auto-post-gmb.ts --template=beforeAfter --location="Glastonbury"
 *   npx tsx scripts/auto-post-gmb.ts --template=serviceHighlight --service="Gutter Clearing"
 */

import { postToGMB, postTemplates } from '../lib/google-business-profile'

const args = process.argv.slice(2)
const template = args.find((arg) => arg.startsWith('--template='))?.split('=')[1]
const location = args.find((arg) => arg.startsWith('--location='))?.split('=')[1]
const service = args.find((arg) => arg.startsWith('--service='))?.split('=')[1]
const photoPath = args.find((arg) => arg.startsWith('--photo='))?.split('=')[1]

async function main() {
  console.log('🚀 Somerset Window Cleaning - Auto GMB Post\n')

  if (!template) {
    console.log('❌ Template required\n')
    console.log('Available templates:')
    console.log('  • beforeAfter    - Before/after job photos')
    console.log('  • testimonial    - Customer review highlight')
    console.log('  • seasonalOffer  - Special promotion')
    console.log('  • serviceHighlight - Feature a specific service')
    console.log('\nExample:')
    console.log('  npx tsx scripts/auto-post-gmb.ts --template=beforeAfter --location="Wells"')
    return
  }

  let postData: any

  switch (template) {
    case 'beforeAfter':
      if (!location) {
        console.log('❌ --location required for beforeAfter template')
        return
      }
      postData = postTemplates.beforeAfter(location)
      break

    case 'serviceHighlight':
      if (!service) {
        console.log('❌ --service required for serviceHighlight template')
        return
      }
      postData = postTemplates.serviceHighlight(
        service,
        'helps protect your home from water damage and maintains your property value'
      )
      break

    case 'testimonial':
      postData = postTemplates.testimonial(
        'Sarah M.',
        'Fantastic service! Windows are sparkling and the team was so professional.'
      )
      break

    case 'seasonalOffer':
      postData = postTemplates.seasonalOffer('Window Cleaning', '10%')
      break

    default:
      console.log(`❌ Unknown template: ${template}`)
      return
  }

  // Add photo if provided
  if (photoPath) {
    postData.photos = [photoPath]
  }

  console.log('📝 Post content:')
  console.log(`   ${postData.summary}\n`)

  if (process.env.DRY_RUN === 'true') {
    console.log('🔍 DRY RUN - Not actually posting')
    return
  }

  try {
    console.log('📤 Posting to Google Business Profile...')
    const result = await postToGMB(postData)
    console.log('✅ Post created successfully!')
    console.log(`   Post ID: ${result.name}`)
  } catch (error: any) {
    console.error('❌ Failed to post:')
    console.error(error.message)

    if (error.message.includes('credentials')) {
      console.log('\n💡 Setup required:')
      console.log('   1. Run: ./scripts/enable-gmb-and-places-apis.sh')
      console.log('   2. Add credentials to .env.local')
      console.log('   3. Try again')
    }
  }
}

main()
