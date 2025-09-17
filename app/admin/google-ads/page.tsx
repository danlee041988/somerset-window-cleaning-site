/**
 * Google Ads Admin Dashboard Page
 * 
 * Comprehensive dashboard for managing Google Ads campaigns
 * Includes performance monitoring, optimization recommendations, and automation controls
 */

import { Metadata } from 'next'
import GoogleAdsDashboard from '@/components/GoogleAdsdashboard'

export const metadata: Metadata = {
  title: 'Google Ads Dashboard - Somerset Window Cleaning Admin',
  description: 'Manage and optimize Google Ads campaigns for Somerset Window Cleaning',
  robots: 'noindex, nofollow' // Admin pages should not be indexed
}

export default function GoogleAdsAdminPage() {
  return (
    <main className="min-h-screen bg-black">
      <GoogleAdsDashboard />
    </main>
  )
}