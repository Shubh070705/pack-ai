'use client'

import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <GlassCard className="h-full hover:glass-lg transition-all duration-300">
        <div className="flex flex-col gap-4">
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20"
            whileHover={{ scale: 1.1 }}
          >
            <Icon className="w-6 h-6 text-blue-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
