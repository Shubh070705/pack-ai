'use client'

import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'

interface KPICardProps {
  number: string
  label: string
  description: string
  delay?: number
}

export function KPICard({
  number,
  label,
  description,
  delay = 0,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <GlassCard className="text-center p-8 h-full flex flex-col justify-between">
        <div>
          <motion.h3
            className="text-4xl md:text-5xl font-bold text-gradient mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            viewport={{ once: true }}
          >
            {number}
          </motion.h3>
          <p className="text-lg font-semibold text-white mb-2">{label}</p>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </GlassCard>
    </motion.div>
  )
}
