#!/usr/bin/env node

/**
 * Direct Sentry Test Script
 * Triggers errors programmatically to verify Sentry integration
 */

import * as Sentry from '@sentry/nextjs'

// Initialize Sentry with production settings
Sentry.init({
  dsn: 'https://61a44df383982d33b9a3b59cb97a985a@o4510113669709824.ingest.de.sentry.io/4510113676591184',
  environment: 'test-script',
  tracesSampleRate: 1.0,
  debug: true, // Enable debug logging to see what's happening
})

console.log('🧪 Testing Sentry Integration\n')
console.log('📡 DSN: https://61a44df383982d33b9a3b59cb97a985a@o4510113669709824.ingest.de.sentry.io/4510113676591184')
console.log('🔧 Environment: test-script\n')

// Test 1: Capture a simple message
console.log('📤 Test 1: Sending test message...')
Sentry.captureMessage('Test message from Somerset Window Cleaning - Script Test', 'info')

// Test 2: Capture a manual exception
console.log('📤 Test 2: Sending test exception...')
Sentry.captureException(new Error('Test error from Somerset Window Cleaning - Direct Script'))

// Test 3: Capture with custom context
console.log('📤 Test 3: Sending error with context...')
Sentry.withScope((scope) => {
  scope.setTag('test-type', 'automated-script')
  scope.setUser({ username: 'test-user' })
  scope.setContext('test-context', {
    script: 'test-sentry.mjs',
    timestamp: new Date().toISOString(),
    project: 'Somerset Window Cleaning Website',
  })
  Sentry.captureException(new Error('Test error with full context'))
})

// Flush events and wait for confirmation
console.log('\n⏳ Flushing events to Sentry...')
await Sentry.close(2000)

console.log('✅ All test events sent!')
console.log('\n🔍 Check Sentry dashboard:')
console.log('   https://somerset-window-cleaning.sentry.io/issues/')
console.log('\n💡 You should see 3 new events appear within seconds')
