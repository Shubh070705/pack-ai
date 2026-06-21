'use client'

import { motion } from 'framer-motion'
import { SectionContainer } from './SectionContainer'
import { GlassCard } from './GlassCard'
import { AnimatedHeading } from './AnimatedHeading'
import { Check } from 'lucide-react'

export function AIDetectionDemo() {
  const detectionItems = [
    { label: 'Sofa', status: 'detected' },
    { label: 'Dining Table', status: 'detected' },
    { label: 'Bed Frame', status: 'detected' },
    { label: 'Refrigerator', status: 'detected' },
    { label: 'Bookshelf', status: 'detected' },
  ]

  const inventory = [
    { item: 'Large Furniture', quantity: 8, weight: '2,400 lbs' },
    { item: 'Small Appliances', quantity: 12, weight: '600 lbs' },
    { item: 'Bedding & Linens', quantity: 45, weight: '180 lbs' },
    { item: 'Kitchenware', quantity: 130, weight: '520 lbs' },
    { item: 'Books & Media', quantity: 200, weight: '800 lbs' },
  ]

  return (
    <SectionContainer id="ai-demo">
      <div className="flex flex-col items-center gap-12">
        {/* Heading */}
        <div className="text-center max-w-2xl">
          <AnimatedHeading>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              See AI Detection in Action
            </h2>
          </AnimatedHeading>
          <AnimatedHeading delay={0.1}>
            <p className="text-lg text-gray-400">
              Watch how PackAI instantly analyzes household items and generates comprehensive inventory reports
            </p>
          </AnimatedHeading>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Left - Image with detection boxes */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="lg" className="p-0 overflow-hidden">
              <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 aspect-square flex items-center justify-center">
                {/* Simulated image placeholder */}
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900">
                  <svg
                    className="w-32 h-32 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>

                  {/* Detection boxes overlay */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute border-2 border-blue-400"
                      style={{
                        width: `${80 - i * 15}px`,
                        height: `${80 - i * 15}px`,
                        top: `${30 + i * 10}%`,
                        left: `${30 + i * 10}%`,
                      }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 0.6 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.span
                        className="absolute -top-6 left-0 text-xs font-semibold text-blue-300 bg-blue-500/20 px-2 py-1 rounded whitespace-nowrap"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                        viewport={{ once: true }}
                      >
                        Detected
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Detection items list */}
              <div className="p-6 border-t border-white/10">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">
                  Detected Items ({detectionItems.length})
                </h3>
                <div className="space-y-2">
                  {detectionItems.map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-300"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Check className="h-4 w-4 text-green-400" />
                      {item.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right - Generated inventory */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassCard variant="lg" className="h-full">
              <div className="flex flex-col gap-6 h-full">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Generated Inventory
                  </h3>
                  <p className="text-sm text-gray-400">
                    Automated analysis and categorization
                  </p>
                </div>

                {/* Inventory table */}
                <div className="overflow-hidden rounded-lg border border-white/10">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-white/5 border-b border-white/10">
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                      Category
                    </span>
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                      Qty
                    </span>
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                      Weight
                    </span>
                  </div>

                  {inventory.map((row, i) => (
                    <motion.div
                      key={i}
                      className="grid grid-cols-3 gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <span className="text-sm text-gray-300">{row.item}</span>
                      <span className="text-sm font-semibold text-blue-300">
                        {row.quantity}
                      </span>
                      <span className="text-sm text-gray-400">{row.weight}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Total Items</p>
                    <p className="text-xl font-bold text-blue-300">395</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Total Weight</p>
                    <p className="text-xl font-bold text-purple-300">4.5 tons</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  )
}
