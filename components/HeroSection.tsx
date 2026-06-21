'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { RatingsCard } from './RatingsCard'
import { GlassCard } from './GlassCard'

export function HeroSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="min-h-screen flex items-center pt-24 md:pt-32 lg:pt-40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-12 lg:gap-20 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
            {/* Badge */}
            <motion.div variants={item}>
              <span className="glass px-4 py-2 rounded-full text-sm font-medium text-blue-300 inline-block">
                🚀 AI-Powered Inventory Solution
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={item}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Transform Your
                <span className="text-gradient"> Moving Business</span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.div variants={item}>
              <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                Revolutionize your packing operations with AI-powered household inventory detection. Automate, track, and optimize every move with PackAI.
              </p>
            </motion.div>

            {/* Ratings */}
            <motion.div variants={item}>
              <RatingsCard />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30"
              >
                Open Dashboard
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              {/* Dashboard preview */}
              <GlassCard variant="lg" className="rounded-2xl overflow-hidden p-0">
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 md:p-8">
                  {/* Dashboard header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-gray-400">PackAI Dashboard</span>
                  </div>

                  {/* Dashboard content */}
                  <div className="space-y-4">
                    {/* Sidebar + main content area */}
                    <div className="flex gap-4">
                      {/* Sidebar */}
                      <div className="hidden sm:flex flex-col gap-2 w-24">
                        <div className="h-2 bg-blue-500/30 rounded w-full" />
                        <div className="h-2 bg-gray-600/50 rounded w-4/5" />
                        <div className="h-2 bg-gray-600/50 rounded w-3/5" />
                        <div className="h-2 bg-gray-600/50 rounded w-4/5" />
                      </div>

                      {/* Main content */}
                      <div className="flex-1 space-y-3">
                        {/* Stats row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-slate-800/50 p-3 rounded-lg border border-slate-700"
                            >
                              <div className="h-2 bg-gray-600 rounded mb-2 w-3/4" />
                              <div className="h-3 bg-blue-500/20 rounded w-1/2" />
                            </div>
                          ))}
                        </div>

                        {/* Chart placeholder */}
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                          <div className="h-32 flex items-end gap-1">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-blue-500/40 to-blue-400/20 rounded-t"
                                style={{
                                  height: `${Math.random() * 80 + 20}%`,
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Table placeholder */}
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-2 py-2 border-b border-slate-700/50">
                              <div className="h-2 bg-gray-600 rounded flex-1" />
                              <div className="h-2 bg-gray-600 rounded w-1/4" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Floating accent */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
