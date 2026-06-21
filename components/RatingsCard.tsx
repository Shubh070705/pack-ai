'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { GlassCard } from './GlassCard'

export function RatingsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <GlassCard className="flex items-center gap-4 w-fit">
        <div className="flex gap-1">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Production-ready scanning</span>
          <span className="text-xs text-gray-400">Powered by completed detection results</span>
        </div>
      </GlassCard>
    </motion.div>
  )
}
