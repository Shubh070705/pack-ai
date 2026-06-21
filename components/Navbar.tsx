'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8"
      style={{
        left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1280px',
      }}
    >
      <div className="glass rounded-full px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-400 to-blue-500">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">
              PackAI
            </span>
          </motion.div>

          {/* Nav items - hidden on mobile */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#dashboard"
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              Dashboard
            </a>
            <a
              href="#analytics"
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              Analytics
            </a>
            <a
              href="#pricing"
              className="text-sm text-gray-300 transition-colors hover:text-white"
            >
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden px-4 py-1.5 text-sm text-gray-300 transition-colors hover:text-white sm:block">
              Sign In
            </button>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-1.5 rounded-full text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
