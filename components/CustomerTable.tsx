'use client'

import { motion } from 'framer-motion'
import { SectionContainer } from './SectionContainer'
import { GlassCard } from './GlassCard'
import { AnimatedHeading } from './AnimatedHeading'
import { PackageSearch } from 'lucide-react'

const inventoryRows: Array<{
  item: string
  source: string
  count: number
  lastDetected: string
  status: string
}> = []

export function CustomerTable() {
  return (
    <SectionContainer>
      <div className="flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <AnimatedHeading>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Inventory Records
            </h2>
          </AnimatedHeading>
          <AnimatedHeading delay={0.1}>
            <p className="text-lg text-gray-400">
              Completed scans populate inventory records and operational reports
            </p>
          </AnimatedHeading>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <GlassCard variant="lg" className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Item
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Source
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Count
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Last Detected
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryRows.length ? (
                    inventoryRows.map((row, i) => (
                      <motion.tr
                        key={row.item}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-white">{row.item}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{row.source}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{row.count}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{row.lastDetected}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-xs font-semibold text-green-300">
                            {row.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-sm text-gray-400">
                        <div className="flex items-center gap-3">
                          <PackageSearch className="h-5 w-5 text-blue-300" />
                          Inventory records will appear after completed scans.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </SectionContainer>
  )
}
