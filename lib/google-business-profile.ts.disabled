/**
 * Google Business Profile (GMB) API Integration
 * Automates posts, review responses, and insights tracking
 */

import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'

// Initialize GMB API client
function getGMBClient() {
  const credentialsPath = process.env.GOOGLE_CLOUD_CREDENTIALS

  if (!credentialsPath) {
    throw new Error('GOOGLE_CLOUD_CREDENTIALS not set in environment')
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/plus.business.manage',
    ],
  })

  return google.mybusinessbusinessinformation({
    version: 'v1',
    auth,
  })
}

// Get your business account and location
export async function getBusinessLocation() {
  const client = getGMBClient()

  // List accounts
  const accountsResponse = await client.accounts.list({})
  const accounts = accountsResponse.data.accounts || []

  if (accounts.length === 0) {
    throw new Error('No Google Business accounts found')
  }

  // Use first account (or you can filter by name)
  const account = accounts[0]

  // List locations for this account
  const locationsResponse = await client.accounts.locations.list({
    parent: account.name!,
  })

  const locations = locationsResponse.data.locations || []

  if (locations.length === 0) {
    throw new Error('No business locations found')
  }

  return locations[0] // Return first location
}

/**
 * Post an update to Google Business Profile
 *
 * @example
 * await postToGMB({
 *   summary: "Before & After: Windows sparkling clean in Glastonbury!",
 *   photos: ["/path/to/before.jpg", "/path/to/after.jpg"],
 *   callToAction: {
 *     type: "BOOK",
 *     url: "https://somersetwindowcleaning.co.uk/book-appointment"
 *   }
 * })
 */
export async function postToGMB(post: {
  summary: string
  photos?: string[]
  callToAction?: {
    type: 'BOOK' | 'ORDER' | 'SHOP' | 'LEARN_MORE' | 'SIGN_UP' | 'CALL'
    url?: string
  }
}) {
  const location = await getBusinessLocation()

  const localPostsApi = google.mybusinessbusinessinformation({
    version: 'v1',
    auth: await getGMBClient().context._options.auth,
  })

  // Upload photos first if provided
  const mediaItems: any[] = []

  if (post.photos && post.photos.length > 0) {
    for (const photoPath of post.photos) {
      const photoData = fs.readFileSync(photoPath)
      const photoBase64 = photoData.toString('base64')

      const mediaItem = {
        mediaFormat: 'PHOTO',
        sourceUrl: `data:image/jpeg;base64,${photoBase64}`,
      }

      mediaItems.push(mediaItem)
    }
  }

  // Create the post
  const postData: any = {
    languageCode: 'en-GB',
    summary: post.summary,
    topicType: 'STANDARD',
  }

  if (mediaItems.length > 0) {
    postData.media = mediaItems
  }

  if (post.callToAction) {
    postData.callToAction = {
      actionType: post.callToAction.type,
      url: post.callToAction.url,
    }
  }

  const response = await localPostsApi.accounts.locations.localPosts.create({
    parent: location.name!,
    requestBody: postData,
  })

  return response.data
}

/**
 * Get all reviews for your business
 */
export async function getReviews() {
  const location = await getBusinessLocation()

  const client = google.mybusinessbusinessinformation({
    version: 'v1',
    auth: await getGMBClient().context._options.auth,
  })

  const response = await client.accounts.locations.reviews.list({
    parent: location.name!,
  })

  return response.data.reviews || []
}

/**
 * Reply to a review
 *
 * @example
 * await replyToReview(reviewName, "Thanks for the 5 stars! We love serving customers in Glastonbury.")
 */
export async function replyToReview(reviewName: string, comment: string) {
  const client = google.mybusinessbusinessinformation({
    version: 'v1',
    auth: await getGMBClient().context._options.auth,
  })

  const response = await client.accounts.locations.reviews.updateReply({
    name: reviewName,
    requestBody: {
      comment,
    },
  })

  return response.data
}

/**
 * Get business insights (views, searches, actions)
 */
export async function getInsights(startDate: string, endDate: string) {
  const location = await getBusinessLocation()

  // Note: Insights API requires separate authentication
  // This is a simplified version

  return {
    message: 'Insights require additional setup via Google Analytics',
    location: location.name,
  }
}

/**
 * Update business hours
 *
 * @example
 * await updateBusinessHours({
 *   MONDAY: { open: "09:00", close: "16:00" },
 *   TUESDAY: { open: "09:00", close: "16:00" },
 *   // ... etc
 * })
 */
export async function updateBusinessHours(hours: Record<string, { open: string; close: string }>) {
  const location = await getBusinessLocation()

  const client = getGMBClient()

  const regularHours = {
    periods: Object.entries(hours).map(([day, time]) => ({
      openDay: day,
      openTime: time.open,
      closeDay: day,
      closeTime: time.close,
    })),
  }

  const response = await client.accounts.locations.patch({
    name: location.name!,
    updateMask: 'regularHours',
    requestBody: {
      regularHours,
    },
  })

  return response.data
}

/**
 * Quick post templates for common updates
 */
export const postTemplates = {
  beforeAfter: (location: string) => ({
    summary: `✨ Before & After: Crystal-clear windows in ${location}! Our pure water system leaves no streaks. Book your clean today! 🪟`,
    callToAction: {
      type: 'BOOK' as const,
      url: 'https://somersetwindowcleaning.co.uk/book-appointment',
    },
  }),

  testimonial: (customerName: string, quote: string) => ({
    summary: `⭐⭐⭐⭐⭐ "${quote}" - ${customerName}. Thank you for trusting Somerset Window Cleaning!`,
    callToAction: {
      type: 'BOOK' as const,
      url: 'https://somersetwindowcleaning.co.uk/book-appointment',
    },
  }),

  seasonalOffer: (service: string, discount: string) => ({
    summary: `🎉 Special Offer: ${discount} off ${service} this month! Limited slots available. Book now to secure your discount.`,
    callToAction: {
      type: 'BOOK' as const,
      url: 'https://somersetwindowcleaning.co.uk/book-appointment',
    },
  }),

  serviceHighlight: (service: string, benefit: string) => ({
    summary: `Did you know? Our ${service} service ${benefit}. Professional, reliable, and fully insured. Serving Somerset since 2019.`,
    callToAction: {
      type: 'LEARN_MORE' as const,
      url: 'https://somersetwindowcleaning.co.uk/services',
    },
  }),
}
