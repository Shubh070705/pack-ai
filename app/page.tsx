'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <main className="w-full min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 font-semibold text-white">P</div>
            <div>
              <span className="block text-xl font-semibold">PackAI</span>
              <span className="block text-xs text-gray-500">Developed by Shubh07</span>
            </div>
          </div>
          <Link href="/dashboard">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-20">
        <div className="space-y-8">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-semibold text-white">
              AI-Powered Inventory Solution for Packers & Movers
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Transform your moving business with PackAI. Detect, catalog, and manage household inventories with AI-powered accuracy. Save time, reduce errors, and scale operations effortlessly.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/dashboard">
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                  Open Dashboard
                </button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            {[
              { title: 'AI Detection', description: 'Advanced computer vision to identify items automatically' },
              { title: 'Real-Time Scanning', description: 'Process images and videos instantly with live camera support' },
              { title: 'Smart Analytics', description: 'Track trends, generate reports, and optimize operations' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 pt-12 md:grid-cols-4">
            {[
              { label: "Today's Scans", value: 'From live usage' },
              { label: 'Images Processed', value: 'From uploads' },
              { label: 'Videos Processed', value: 'From uploads' },
              { label: 'Average Detection Time', value: 'From backend results' },
            ].map((metric, i) => (
              <div key={i} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <p className="mb-1 text-sm text-gray-400">{metric.label}</p>
                <p className="text-sm font-medium text-blue-300">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-background py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>Developed by Shubh07</p>
        </div>
      </footer>
    </main>
  )
}
