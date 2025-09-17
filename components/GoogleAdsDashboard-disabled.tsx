"use client"

// GoogleAdsDashboard temporarily disabled due to missing dependencies
// To enable: install shadcn/ui components and rename this file back to GoogleAdsDashboard.tsx

export default function GoogleAdsDashboard() {
  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold">Google Ads Dashboard</h2>
      <p className="text-white/70">
        Dashboard temporarily disabled - requires shadcn/ui components to be installed.
      </p>
      <div className="mt-4 p-4 bg-white/10 rounded-lg">
        <h3 className="font-semibold mb-2">To enable Google Ads Dashboard:</h3>
        <ol className="text-sm text-white/80 space-y-1">
          <li>1. Install shadcn/ui: <code className="bg-black/30 px-1 rounded">npx shadcn-ui@latest init</code></li>
          <li>2. Add required components: Card, Badge, Button, Tabs</li>
          <li>3. Rename this file back to GoogleAdsDashboard.tsx</li>
        </ol>
      </div>
    </div>
  )
}