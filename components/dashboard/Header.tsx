'use client'

import { motion } from 'framer-motion'
import { Menu, Search, Bell, ChevronDown } from 'lucide-react'
import { useScanActivities } from '@/lib/scan-activity'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const activities = useScanActivities()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 border-b border-white/10 bg-background/85 backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-5 py-3 md:px-6">
        <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-white transition">
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden max-w-md flex-1 items-center md:mx-auto md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.045] py-2 pl-10 pr-4 text-white placeholder-gray-500 transition focus:border-blue-500/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="relative text-gray-400 hover:text-white transition">
            <Bell className="w-6 h-6" />
            {activities.length ? (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-400" />
            ) : null}
          </button>

          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-sm font-semibold text-white">
              A
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">Workspace</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
