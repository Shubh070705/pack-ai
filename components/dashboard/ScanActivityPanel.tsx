'use client'

import { motion } from 'framer-motion'
import { Activity, Camera, CheckCircle, ImageIcon, Video } from 'lucide-react'
import { formatRelativeScanTime, ScanActivity, useScanActivities } from '@/lib/scan-activity'

export function ScanActivityPanel() {
  const activities = useScanActivities()
  const recentActivities = activities.slice(0, 6)

  const getActivityIcon = (activity: ScanActivity) => {
    switch (activity.kind) {
      case 'image':
        return ImageIcon
      case 'video':
        return Video
      case 'camera':
        return Camera
    }
  }

  const getActivityTitle = (activity: ScanActivity) => {
    const label = activity.kind === 'camera' ? 'Live scan' : `${activity.kind} scan`
    return `${label.charAt(0).toUpperCase()}${label.slice(1)} completed`
  }

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
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.045]"
    >
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Activity className="h-5 w-5 text-blue-300" />
            Recent Scan Activity
          </h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-gray-300">
            {recentActivities.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {recentActivities.length ? (
            recentActivities.map((activity) => {
              const Icon = getActivityIcon(activity)

              return (
                <motion.div
                  key={activity.id}
                  variants={item}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/10 p-4 transition-colors duration-200 hover:border-white/20"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Icon className="h-4 w-4 text-blue-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{getActivityTitle(activity)}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                      {activity.filename} · {activity.totalDetections} objects · {activity.inferenceTimeSeconds.toFixed(2)}s
                    </p>
                    <p className="mt-2 text-xs text-gray-500">{formatRelativeScanTime(activity.createdAt)}</p>
                  </div>
                  <CheckCircle className="mt-1 h-4 w-4 text-emerald-400" />
                </motion.div>
              )
            })
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 p-5 text-sm text-gray-400">
              Completed scans will appear here after image, video, or live camera detection runs.
            </div>
          )}
        </motion.div>
      </div>

      <div className="border-t border-white/10 p-4 text-xs text-gray-500">
        Activity is recorded locally from completed detection responses.
      </div>
    </motion.div>
  )
}
