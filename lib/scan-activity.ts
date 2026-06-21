'use client'

import { useEffect, useMemo, useState } from 'react'

export type ScanActivityKind = 'image' | 'video' | 'camera'

interface DetectionClassSummary {
  label: string
  count: number
  average_confidence: number
  top_confidence: number
}

interface ScanActivityInput {
  kind: ScanActivityKind
  filename: string
  totalDetections: number
  inferenceTimeSeconds: number
  detectedClasses: DetectionClassSummary[]
  objectCounts: Record<string, number>
  totalFrames?: number
  processedFrames?: number
}

export interface ScanActivity extends ScanActivityInput {
  id: string
  createdAt: string
}

export interface ScanActivitySummary {
  todaysScans: number
  imagesProcessed: number
  videosProcessed: number
  averageDetectionTimeSeconds: number | null
  inventoryCounts: Record<string, number>
}

const STORAGE_KEY = 'packai.scanActivity'
const ACTIVITY_EVENT = 'packai:scan-activity-updated'
const MAX_ACTIVITY_ITEMS = 50

const emptySummary: ScanActivitySummary = {
  todaysScans: 0,
  imagesProcessed: 0,
  videosProcessed: 0,
  averageDetectionTimeSeconds: null,
  inventoryCounts: {},
}

const isBrowser = () => typeof window !== 'undefined'

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const readScanActivities = (): ScanActivity[] => {
  if (!isBrowser()) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

const writeScanActivities = (activities: ScanActivity[]) => {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(activities.slice(0, MAX_ACTIVITY_ITEMS)))
  window.dispatchEvent(new Event(ACTIVITY_EVENT))
}

export const recordScanActivity = (input: ScanActivityInput) => {
  const activity: ScanActivity = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
  }

  writeScanActivities([activity, ...readScanActivities()])
}

export const buildScanActivitySummary = (activities: ScanActivity[]): ScanActivitySummary => {
  if (!activities.length) {
    return emptySummary
  }

  const today = new Date().toDateString()
  const todaysActivities = activities.filter((activity) => {
    return new Date(activity.createdAt).toDateString() === today
  })
  const timedActivities = activities.filter((activity) => activity.inferenceTimeSeconds > 0)
  const totalDetectionTime = timedActivities.reduce(
    (sum, activity) => sum + activity.inferenceTimeSeconds,
    0
  )
  const inventoryCounts = activities.reduce<Record<string, number>>((counts, activity) => {
    for (const [label, count] of Object.entries(activity.objectCounts)) {
      counts[label] = (counts[label] ?? 0) + count
    }

    return counts
  }, {})

  return {
    todaysScans: todaysActivities.length,
    imagesProcessed: activities.filter((activity) => activity.kind === 'image').length,
    videosProcessed: activities.filter((activity) => activity.kind === 'video').length,
    averageDetectionTimeSeconds: timedActivities.length
      ? totalDetectionTime / timedActivities.length
      : null,
    inventoryCounts,
  }
}

export const useScanActivities = () => {
  const [activities, setActivities] = useState<ScanActivity[]>([])

  useEffect(() => {
    const syncActivities = () => {
      setActivities(readScanActivities())
    }

    syncActivities()
    window.addEventListener(ACTIVITY_EVENT, syncActivities)
    window.addEventListener('storage', syncActivities)

    return () => {
      window.removeEventListener(ACTIVITY_EVENT, syncActivities)
      window.removeEventListener('storage', syncActivities)
    }
  }, [])

  return activities
}

export const useScanActivitySummary = () => {
  const activities = useScanActivities()

  return useMemo(() => buildScanActivitySummary(activities), [activities])
}

export const formatRelativeScanTime = (createdAt: string) => {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))

  if (elapsedSeconds < 60) {
    return 'Just now'
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} min ago`
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) {
    return `${elapsedHours} hr ago`
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(createdAt))
}
