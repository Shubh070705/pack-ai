'use client'

import { motion } from 'framer-motion'
import { CalendarCheck, ImageIcon, Video, Clock } from 'lucide-react'
import { useScanActivitySummary } from '@/lib/scan-activity'

export function KPICards() {
  const summary = useScanActivitySummary()
  const averageDetectionTime =
    summary.averageDetectionTimeSeconds === null
      ? '--'
      : `${summary.averageDetectionTimeSeconds.toFixed(2)}s`

  const cards = [
    {
      title: "Today's Scans",
      value: summary.todaysScans.toString(),
      detail: 'Completed in this browser session',
      icon: CalendarCheck,
    },
    {
      title: 'Images Processed',
      value: summary.imagesProcessed.toString(),
      detail: 'Successful image scans',
      icon: ImageIcon,
    },
    {
      title: 'Videos Processed',
      value: summary.videosProcessed.toString(),
      detail: 'Successful video scans',
      icon: Video,
    },
    {
      title: 'Average Detection Time',
      value: averageDetectionTime,
      detail: 'From backend inference results',
      icon: Clock,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon

        return (
          <motion.div
            key={index}
            variants={item}
            className="rounded-lg border border-white/10 bg-white/[0.045] p-5 transition-colors duration-200 hover:border-white/20"
          >
            <div className="mb-5 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Icon className="h-5 w-5 text-blue-300" />
              </div>
            </div>
            <p className="mb-2 text-sm text-gray-400">{card.title}</p>
            <h3 className="text-3xl font-semibold text-white">{card.value}</h3>
            <p className="mt-2 text-xs text-gray-500">{card.detail}</p>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
