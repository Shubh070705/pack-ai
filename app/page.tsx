'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Camera,
  FileText,
  Gauge,
  ImageIcon,
  PackageCheck,
  Play,
  Sparkles,
  Video,
} from 'lucide-react'

const features = [
  {
    icon: ImageIcon,
    title: 'Image Detection',
    description: 'Upload item photos and identify furniture, appliances, cartons, and more.',
  },
  {
    icon: Video,
    title: 'Video Detection',
    description: 'Analyze moving walkthrough videos to capture inventory at scale.',
  },
  {
    icon: Camera,
    title: 'Live Camera Detection',
    description: 'Use a live camera feed for real-time household item scanning.',
  },
  {
    icon: PackageCheck,
    title: 'Inventory Generation',
    description: 'Turn detections into clean, structured inventory summaries.',
  },
  {
    icon: FileText,
    title: 'AI Reports',
    description: 'Review AI-ready insights for faster decisions and better handoffs.',
  },
  {
    icon: Gauge,
    title: 'Fast Processing',
    description: 'Move from scan to result quickly with a focused detection workflow.',
  },
]

export default function Page() {
  return (
    <main className="flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-[#1F2937] bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-1 shadow-lg shadow-blue-500/20">
              <img
                src="/logo.png"
                alt="NEXTGEN logo"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="block text-xl font-bold tracking-tight text-white">NEXTGEN</span>
              <span className="block truncate text-xs font-medium uppercase tracking-[0.22em] text-[#9CA3AF]">
                AI Powered Inventory Detection
              </span>
            </div>
          </Link>

          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-shadow hover:shadow-blue-500/30"
            >
              Start Demo
            </motion.button>
          </Link>
        </div>
      </header>

      <section className="relative flex-1">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#1F2937] bg-[#111827]/80 px-4 py-2 text-sm text-[#9CA3AF]">
              <Sparkles className="h-4 w-4 text-blue-300" />
              AI Powered Inventory Detection Platform
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-7xl">NEXTGEN</h1>
            <p className="mt-5 text-xl font-medium text-blue-200 md:text-2xl">
              AI Powered Inventory Detection Platform
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#9CA3AF] md:text-lg">
              Detect furniture, appliances, cartons and household items from images, videos or live camera using AI.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] px-8 py-3.5 font-semibold text-white shadow-xl shadow-blue-500/20 transition-shadow hover:shadow-blue-500/30 sm:w-auto"
                >
                  <Play className="h-5 w-5 fill-white" />
                  Start Demo
                </motion.button>
              </Link>
              <a href="#features">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-[#1F2937] bg-[#111827] px-8 py-3.5 font-semibold text-white shadow-lg transition-all hover:border-blue-400/40 hover:shadow-blue-500/10 sm:w-auto"
                >
                  Learn More
                </motion.button>
              </a>
            </div>
          </motion.div>

          <motion.div
            id="features"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="grid gap-5 pt-16 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 + index * 0.04 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group rounded-3xl border border-[#1F2937] bg-[#111827] p-6 shadow-lg shadow-black/10 transition-shadow hover:shadow-blue-500/10"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] shadow-lg shadow-blue-500/20">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F9FAFB]">{feature.title}</h3>
                  <p className="mt-2 leading-7 text-[#9CA3AF]">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.18 }}
            className="grid gap-5 pt-12 md:grid-cols-4"
          >
            {[
              { label: "Today's Scans", value: 'From live usage' },
              { label: 'Images Processed', value: 'From uploads' },
              { label: 'Videos Processed', value: 'From uploads' },
              { label: 'Average Detection Time', value: 'From backend results' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-[#1F2937] bg-[#111827]/80 p-5">
                <p className="mb-1 text-sm text-[#9CA3AF]">{metric.label}</p>
                <p className="text-sm font-semibold text-blue-300">{metric.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[#1F2937] bg-background py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-[#9CA3AF]">
          <p>© 2026 NEXTGEN</p>
        </div>
      </footer>
    </main>
  )
}
