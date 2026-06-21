'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  X,
  LayoutDashboard,
  BarChart3,
  Settings,
  Package,
  ImageIcon,
  Video,
  Camera,
  ClipboardList,
} from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', badge: null },
    { label: 'Image Scan', icon: ImageIcon, href: '/dashboard/image-scan', badge: null },
    { label: 'Video Scan', icon: Video, href: '/dashboard/video-scan', badge: null },
    { label: 'Live Scan', icon: Camera, href: '/dashboard/live-scan', badge: null },
    { label: 'Inventory', icon: Package, href: '/dashboard/inventory', badge: null },
    { label: 'Reports', icon: BarChart3, href: '/dashboard/reports', badge: null },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings', badge: null },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex h-full flex-col bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10">
            <ClipboardList className="h-5 w-5 text-blue-300" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">PackAI</h1>
            <p className="text-xs text-gray-400">Developed by Shubh07</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <motion.div key={item.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <Link
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 group ${
                  active
                    ? 'border border-blue-500/30 bg-blue-500/10 text-blue-200'
                    : 'text-gray-300 hover:bg-white/5 border border-transparent hover:border-white/10'
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

      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-gray-500">Developed by Shubh07</p>
      </div>
    </div>
  )
}
