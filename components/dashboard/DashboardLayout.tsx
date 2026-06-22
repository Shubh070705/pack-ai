'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, BarChart3, Package, Settings, type LucideIcon } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { KPICards } from './KPICards'
import { AIScanner } from './AIScanner'
import { RecentJobs } from './RecentJobs'
import { AnalyticsDashboard } from './AnalyticsDashboard'
import { InventorySummary } from './InventorySummary'
import { ScanActivityPanel } from './ScanActivityPanel'

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

const comingSoonContent = {
  '/dashboard/inventory': {
    icon: Package,
    title: 'Inventory Coming Soon',
    description: 'A polished inventory workspace will appear here with generated item lists, quantities, and scan summaries.',
  },
  '/dashboard/reports': {
    icon: BarChart3,
    title: 'Reports Coming Soon',
    description: 'AI reports, scan trends, and export-ready insights will be available in this section soon.',
  },
  '/dashboard/settings': {
    icon: Settings,
    title: 'Settings Coming Soon',
    description: 'Workspace preferences, account controls, and detection configuration will live here.',
  },
}

function ComingSoonState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex min-h-[calc(100vh-160px)] items-center justify-center"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#1F2937] bg-[#111827] p-8 text-center shadow-2xl shadow-black/20 md:p-12">
        <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] shadow-xl shadow-blue-500/25">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-300">Coming Soon</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-[#9CA3AF]">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const comingSoon = comingSoonContent[pathname as keyof typeof comingSoonContent]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '0px' }}
        transition={{ duration: 0.3 }}
        className="hidden overflow-hidden border-r border-[#1F2937] lg:block"
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </motion.div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}>
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-72 overflow-y-auto border-r border-[#1F2937] bg-background"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-5 md:p-6">
            <motion.button
              type="button"
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#1F2937] bg-[#111827] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all hover:border-blue-400/40 hover:shadow-blue-500/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </motion.button>

            <AnimatePresence mode="wait">
              {comingSoon ? (
                <ComingSoonState
                  key={pathname}
                  icon={comingSoon.icon}
                  title={comingSoon.title}
                  description={comingSoon.description}
                />
              ) : (
                <motion.div
                  key={pathname}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <KPICards />

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                      <AIScanner />
                    </div>
                    <div className="xl:col-span-1">
                      <ScanActivityPanel />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="xl:col-span-2">
                      <RecentJobs />
                    </div>
                    <div className="xl:col-span-1">
                      <InventorySummary />
                    </div>
                  </div>

                  <AnalyticsDashboard />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
