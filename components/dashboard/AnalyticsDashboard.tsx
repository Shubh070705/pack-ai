'use client'

import { motion } from 'framer-motion'
import { BarChart3, Camera, ImageIcon, Timer, Video } from 'lucide-react'
import { useScanActivities, useScanActivitySummary } from '@/lib/scan-activity'

export function AnalyticsDashboard() {
  const activities = useScanActivities()
  const summary = useScanActivitySummary()
  const totalObjects = activities.reduce((sum, activity) => sum + activity.totalDetections, 0)
  const liveScans = activities.filter((activity) => activity.kind === 'camera').length
  const totalProcessedFrames = activities.reduce(
    (sum, activity) => sum + (activity.processedFrames ?? 0),
    0
  )
  const reportItems = [
    {
      label: 'Image Scans',
      value: summary.imagesProcessed.toString(),
      icon: ImageIcon,
    },
    {
      label: 'Video Scans',
      value: summary.videosProcessed.toString(),
      icon: Video,
    },
    {
      label: 'Live Scans',
      value: liveScans.toString(),
      icon: Camera,
    },
    {
      label: 'Objects Detected',
      value: totalObjects.toString(),
      icon: BarChart3,
    },
    {
      label: 'Processed Frames',
      value: totalProcessedFrames.toString(),
      icon: Video,
    },
    {
      label: 'Average Detection Time',
      value:
        summary.averageDetectionTimeSeconds === null
          ? '--'
          : `${summary.averageDetectionTimeSeconds.toFixed(2)}s`,
      icon: Timer,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.section variants={container} initial="hidden" animate="show" className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Reports</h2>
        <p className="mt-1 text-sm text-gray-400">Operational totals from completed detection results</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reportItems.map((reportItem) => {
          const Icon = reportItem.icon

          return (
            <motion.div
              key={reportItem.label}
              variants={item}
              className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <Icon className="h-5 w-5 text-blue-300" />
              </div>
              <p className="text-sm text-gray-400">{reportItem.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{reportItem.value}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
