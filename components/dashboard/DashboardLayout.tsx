'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { KPICards } from './KPICards'
import { AIScanner } from './AIScanner'
import { RecentJobs } from './RecentJobs'
import { AnalyticsDashboard } from './AnalyticsDashboard'
import { InventorySummary } from './InventorySummary'
import { ScanActivityPanel } from './ScanActivityPanel'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-[#090d18]">
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '0px' }}
        transition={{ duration: 0.3 }}
        className="hidden overflow-hidden border-r border-white/10 lg:block"
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
            className="w-72 h-full bg-background border-r border-white/10 overflow-y-auto"
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-5 md:p-6">
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
          </div>
        </main>
      </div>
    </div>
  )
}
