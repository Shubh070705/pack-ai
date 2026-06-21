'use client'

import { motion } from 'framer-motion'
import { Boxes, PackageSearch } from 'lucide-react'
import { useScanActivitySummary } from '@/lib/scan-activity'

export function InventorySummary() {
  const summary = useScanActivitySummary()
  const inventoryItems = Object.entries(summary.inventoryCounts)
    .sort(([, leftCount], [, rightCount]) => rightCount - leftCount)
    .slice(0, 8)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.045]"
    >
      <div className="border-b border-white/10 p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Boxes className="h-5 w-5 text-blue-300" />
          Inventory Summary
        </h2>
        <p className="mt-1 text-xs text-gray-400">Detected object totals from completed scans</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {inventoryItems.length ? (
            inventoryItems.map(([label, count]) => (
              <motion.div
                key={label}
                variants={item}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/10 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <PackageSearch className="h-4 w-4 text-blue-300" />
                  </div>
                  <span className="truncate text-sm font-medium text-white">{label}</span>
                </div>
                <span className="text-lg font-semibold text-white">{count}</span>
              </motion.div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 p-5 text-sm text-gray-400">
              Inventory totals will appear after completed detections return object counts.
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
