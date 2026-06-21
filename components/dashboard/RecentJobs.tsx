'use client'

import { motion } from 'framer-motion'
import { Camera, CheckCircle, Clock, ImageIcon, Package, Video } from 'lucide-react'
import { formatRelativeScanTime, ScanActivity, useScanActivities } from '@/lib/scan-activity'

export function RecentJobs() {
  const activities = useScanActivities()

  const getScanIcon = (activity: ScanActivity) => {
    switch (activity.kind) {
      case 'image':
        return ImageIcon
      case 'video':
        return Video
      case 'camera':
        return Camera
    }
  }

  const getScanLabel = (activity: ScanActivity) => {
    switch (activity.kind) {
      case 'image':
        return 'Image Scan'
      case 'video':
        return 'Video Scan'
      case 'camera':
        return 'Live Scan'
    }
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.045]"
    >
      <div className="border-b border-white/10 p-5">
        <h2 className="text-xl font-semibold text-white">Scan History</h2>
        <p className="mt-1 text-sm text-gray-400">Completed detections from this workstation</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-5 py-4 text-left text-sm font-medium text-gray-400">Source</th>
              <th className="px-5 py-4 text-left text-sm font-medium text-gray-400">File</th>
              <th className="px-5 py-4 text-left text-sm font-medium text-gray-400">Objects</th>
              <th className="px-5 py-4 text-left text-sm font-medium text-gray-400">Detection Time</th>
              <th className="px-5 py-4 text-left text-sm font-medium text-gray-400">Completed</th>
              <th className="px-5 py-4 text-left text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <motion.tbody variants={container} initial="hidden" animate="show">
            {activities.length ? (
              activities.slice(0, 8).map((activity) => {
                const ScanIcon = getScanIcon(activity)

                return (
                  <motion.tr
                    key={activity.id}
                    variants={item}
                    className="border-b border-white/5 transition-colors duration-200 hover:bg-white/5"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-white">
                        <ScanIcon className="h-4 w-4 text-blue-300" />
                        {getScanLabel(activity)}
                      </div>
                    </td>
                    <td className="max-w-[240px] truncate px-5 py-4 text-sm text-gray-300">
                      {activity.filename}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-white">
                        <Package className="h-4 w-4 text-gray-400" />
                        {activity.totalDetections}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {activity.inferenceTimeSeconds.toFixed(2)}s
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {formatRelativeScanTime(activity.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        <CheckCircle className="h-3 w-3" />
                        Complete
                      </span>
                    </td>
                  </motion.tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-sm text-gray-400">
                  No scan history yet. Run an image, video, or live scan to populate this table.
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>
    </motion.div>
  )
}
