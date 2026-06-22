'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X,
  BarChart3,
  Settings,
  Package,
  ImageIcon,
  Video,
  Camera,
  Play,
} from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { label: 'Start Demo', icon: Play, href: '/dashboard', badge: null },
    { label: 'Image Scan', icon: ImageIcon, href: '/dashboard/image-scan', badge: null },
    { label: 'Video Scan', icon: Video, href: '/dashboard/video-scan', badge: null },
    { label: 'Live Scan', icon: Camera, href: '/dashboard/live-scan', badge: null },
    { label: 'Inventory', icon: Package, href: '/dashboard/inventory', badge: null },
    { label: 'Reports', icon: BarChart3, href: '/dashboard/reports', badge: null },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings', badge: null },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col bg-background/95 backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-[#1F2937] p-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-300/30 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-1 shadow-lg shadow-blue-500/25">
            <img
              src="/logo.png"
              alt="NEXTGEN logo"
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-white">NEXTGEN</h1>
            <p className="mt-0.5 text-[11px] font-medium uppercase leading-4 tracking-[0.16em] text-[#9CA3AF]">
              AI Powered Inventory Detection
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 transition hover:text-white lg:hidden">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link
                href={item.href}
                className={`group flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 ${
                  active
                    ? 'border-blue-400/40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white shadow-lg shadow-blue-500/20'
                    : 'border-transparent text-gray-300 hover:border-[#1F2937] hover:bg-[#111827]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && <span className="rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300">{item.badge}</span>}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      <div className="border-t border-[#1F2937] p-4">
        <p className="text-xs text-[#9CA3AF]">© 2026 NEXTGEN</p>
      </div>
    </motion.div>
  )
}
