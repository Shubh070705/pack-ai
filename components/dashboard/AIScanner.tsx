'use client'

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Sparkles,
  CheckCircle,
  X,
  Image as ImageIcon,
  AlertCircle,
  Clock3,
  Boxes,
  ScanSearch,
  Film,
  Camera,
  Square,
  Play,
} from 'lucide-react'
import { recordScanActivity } from '@/lib/scan-activity'

type ScannerPhase = 'idle' | 'preview' | 'uploading' | 'processing' | 'results'
type SourceKind = 'image' | 'video' | 'camera'

interface DetectionItem {
  label: string
  confidence: number
  bbox: number[]
}

interface DetectionClassSummary {
  label: string
  count: number
  average_confidence: number
  top_confidence: number
}

interface DetectionResponse {
  filename: string
  image_width: number
  image_height: number
  total_detections: number
  inference_time_seconds: number
  detected_classes: DetectionClassSummary[]
  object_counts: Record<string, number>
  annotated_image_base64: string | null
  detections: DetectionItem[]
}

interface VideoDetectionResponse {
  filename: string
  total_frames: number
  processed_frames: number
  inference_time_seconds: number
  detected_classes: DetectionClassSummary[]
  object_counts: Record<string, number>
  detections: DetectionItem[]
}

interface ErrorResponsePayload {
  detail?: string
}

interface SelectedMedia {
  file: File
  kind: Exclude<SourceKind, 'camera'>
  previewUrl: string
}

interface UploadOption {
  label: string
  kind: SourceKind
  description: string
  color: string
  icon: typeof Upload
}

const ACCEPTED_IMAGE_FILE_TYPES = ['image/jpeg', 'image/png']
const ACCEPTED_VIDEO_FILE_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_FILE_SIZE_BYTES = 100 * 1024 * 1024
const REQUEST_TIMEOUT_MS = 60_000
const CAMERA_SCAN_INTERVAL_MS = 1_000

const uploadOptions: UploadOption[] = [
  {
    label: 'Upload Image',
    kind: 'image',
    description: 'JPG, JPEG, PNG up to 10 MB',
    color: 'from-blue-500 to-blue-600',
    icon: Upload,
  },
  {
    label: 'Upload Video',
    kind: 'video',
    description: 'MP4, MOV, AVI up to 100 MB',
    color: 'from-cyan-500 to-indigo-600',
    icon: Film,
  },
  {
    label: 'Live Camera',
    kind: 'camera',
    description: 'Use your webcam for live inventory scanning',
    color: 'from-emerald-500 to-teal-600',
    icon: Camera,
  },
]

const emptyDetectionResponse = (): DetectionResponse => ({
  filename: 'camera-frame.jpg',
  image_width: 0,
  image_height: 0,
  total_detections: 0,
  inference_time_seconds: 0,
  detected_classes: [],
  object_counts: {},
  annotated_image_base64: null,
  detections: [],
})

const calculateBboxIoU = (left: number[], right: number[]) => {
  const xLeft = Math.max(left[0], right[0])
  const yTop = Math.max(left[1], right[1])
  const xRight = Math.min(left[2], right[2])
  const yBottom = Math.min(left[3], right[3])

  if (xRight <= xLeft || yBottom <= yTop) {
    return 0
  }

  const intersection = (xRight - xLeft) * (yBottom - yTop)
  const leftArea = (left[2] - left[0]) * (left[3] - left[1])
  const rightArea = (right[2] - right[0]) * (right[3] - right[1])
  const union = leftArea + rightArea - intersection

  return union > 0 ? intersection / union : 0
}

const buildDetectionResponseFromInventory = (
  detections: DetectionItem[],
  base?: DetectionResponse | null
): DetectionResponse => {
  const confidenceMap = new Map<string, number[]>()
  const objectCounts: Record<string, number> = {}

  for (const detection of detections) {
    objectCounts[detection.label] = (objectCounts[detection.label] ?? 0) + 1
    confidenceMap.set(detection.label, [
      ...(confidenceMap.get(detection.label) ?? []),
      detection.confidence,
    ])
  }

  const detectedClasses = Object.entries(objectCounts)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, count]) => {
      const confidences = confidenceMap.get(label) ?? []

      return {
        label,
        count,
        average_confidence:
          confidences.length > 0
            ? Number((confidences.reduce((sum, value) => sum + value, 0) / confidences.length).toFixed(4))
            : 0,
        top_confidence:
          confidences.length > 0
            ? Number(Math.max(...confidences).toFixed(4))
            : 0,
      }
    })

  return {
    filename: base?.filename ?? 'camera-session.jpg',
    image_width: base?.image_width ?? 0,
    image_height: base?.image_height ?? 0,
    total_detections: detections.length,
    inference_time_seconds: base?.inference_time_seconds ?? 0,
    detected_classes: detectedClasses,
    object_counts: objectCounts,
    annotated_image_base64: base?.annotated_image_base64 ?? null,
    detections,
  }
}

export function AIScanner() {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const liveVideoRef = useRef<HTMLVideoElement | null>(null)
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)
  const cameraIntervalRef = useRef<number | null>(null)
  const cameraRequestInFlightRef = useRef(false)
  const resolveLiveVideoRef = useRef<((video: HTMLVideoElement) => void) | null>(null)

  const [phase, setPhase] = useState<ScannerPhase>('idle')
  const [sourceKind, setSourceKind] = useState<SourceKind | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null)
  const [imageResults, setImageResults] = useState<DetectionResponse | null>(null)
  const [videoResults, setVideoResults] = useState<VideoDetectionResponse | null>(null)
  const [cameraLiveResults, setCameraLiveResults] = useState<DetectionResponse | null>(null)
  const [cameraSessionInventory, setCameraSessionInventory] = useState<DetectionResponse>(emptyDetectionResponse)
  const [cameraPreviewSrc, setCameraPreviewSrc] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false)
  const [cameraScanning, setCameraScanning] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isImageSelection = sourceKind === 'image'
  const isVideoSelection = sourceKind === 'video'
  const isCameraSelection = sourceKind === 'camera'

  const annotatedImageSrc = useMemo(() => {
    if (!imageResults?.annotated_image_base64) {
      return null
    }

    return `data:image/png;base64,${imageResults.annotated_image_base64}`
  }, [imageResults?.annotated_image_base64])

  const imagePreviewSrc = isImageSelection ? selectedMedia?.previewUrl : annotatedImageSrc
  const finalPreviewSrc = isCameraSelection ? annotatedImageSrc ?? cameraPreviewSrc : imagePreviewSrc

  const mergeCameraInventory = (frameResult: DetectionResponse) => {
    setCameraSessionInventory((currentInventory) => {
      const mergedDetections = [...currentInventory.detections]

      for (const candidate of frameResult.detections) {
        const existingIndex = mergedDetections.findIndex((existing) => {
          return (
            existing.label === candidate.label &&
            calculateBboxIoU(existing.bbox, candidate.bbox) > 0.5
          )
        })

        if (existingIndex === -1) {
          mergedDetections.push(candidate)
          continue
        }

        if (candidate.confidence > mergedDetections[existingIndex].confidence) {
          mergedDetections[existingIndex] = candidate
        }
      }

      return buildDetectionResponseFromInventory(mergedDetections, frameResult)
    })
  }

  const setLiveVideoElement = (video: HTMLVideoElement | null) => {
    liveVideoRef.current = video

    if (video && resolveLiveVideoRef.current) {
      resolveLiveVideoRef.current(video)
      resolveLiveVideoRef.current = null
    }
  }

  const waitForLiveVideoElement = async () => {
    if (liveVideoRef.current) {
      return liveVideoRef.current
    }

    return new Promise<HTMLVideoElement>((resolve) => {
      resolveLiveVideoRef.current = resolve
    })
  }

  useEffect(() => {
    return () => {
      stopCameraLoop()
      stopCameraStream()

      if (selectedMedia?.previewUrl) {
        URL.revokeObjectURL(selectedMedia.previewUrl)
      }
    }
  }, [selectedMedia?.previewUrl])

  useEffect(() => {
    let cancelled = false

    const startCamera = async () => {
      if (!isCameraOpen) {
        stopCameraLoop()
        stopCameraStream()
        return
      }

      try {
        stopCameraLoop()
        stopCameraStream()

        if (selectedMedia?.previewUrl) {
          URL.revokeObjectURL(selectedMedia.previewUrl)
        }

        setSourceKind('camera')
        setSelectedMedia(null)
        setImageResults(null)
        setVideoResults(null)
        setCameraLiveResults(null)
        setCameraSessionInventory(emptyDetectionResponse())
        setCameraPreviewSrc(null)
        setUploadProgress(0)
        setErrorMessage(null)
        setPhase('preview')

        console.log('STEP 1 Camera requested')

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })

        if (cancelled) {
          for (const track of stream.getTracks()) {
            track.stop()
          }

          return
        }

        console.log('STEP 2 Stream received', stream)
        cameraStreamRef.current = stream

        const video = await waitForLiveVideoElement()

        if (cancelled) {
          return
        }

        console.log('STEP 3 Video ref found', video)

        video.srcObject = stream
        console.log('STEP 4 srcObject attached', video.srcObject)

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => {
            console.log('STEP 5 Metadata loaded', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              readyState: video.readyState,
            })
            resolve()
          }

          video.onerror = () => {
            reject(new Error('STEP 5 failed: video metadata could not load.'))
          }
        })

        if (cancelled) {
          return
        }

        try {
          await video.play()
          console.log('STEP 6 Video playing')
          setCameraPermissionGranted(true)
        } catch (error) {
          console.error('STEP 6 Video play failed:', error)

          const message =
            error instanceof Error
              ? error.message
              : 'STEP 6 failed: video.play() threw an unknown error.'

          throw new Error(message, { cause: error })
        } finally {
          video.onloadedmetadata = null
          video.onerror = null
        }
      } catch (error) {
        console.error('Unable to start live camera preview:', error)

        stopCameraStream()

        const message =
          error instanceof Error
            ? error.message
            : 'Camera access was denied or unavailable. Please allow webcam permission and try again.'

        setErrorMessage(message)
        setPhase('idle')
        setSourceKind(null)
        setIsCameraOpen(false)
        setCameraPermissionGranted(false)
      }
    }

    void startCamera()

    return () => {
      cancelled = true
    }
  }, [isCameraOpen])

  const stopCameraLoop = () => {
    if (cameraIntervalRef.current !== null) {
      window.clearInterval(cameraIntervalRef.current)
      cameraIntervalRef.current = null
    }

    cameraRequestInFlightRef.current = false
    setCameraScanning(false)
  }

  const stopCameraStream = () => {
    if (!cameraStreamRef.current) {
      return
    }

    for (const track of cameraStreamRef.current.getTracks()) {
      track.stop()
    }

    cameraStreamRef.current = null

    if (liveVideoRef.current) {
      liveVideoRef.current.srcObject = null
    }

    setCameraPermissionGranted(false)
  }

  const resetScanner = () => {
    setIsCameraOpen(false)
    stopCameraLoop()
    stopCameraStream()

    if (selectedMedia?.previewUrl) {
      URL.revokeObjectURL(selectedMedia.previewUrl)
    }

    setPhase('idle')
    setSourceKind(null)
    setUploadProgress(0)
    setSelectedMedia(null)
    setImageResults(null)
    setVideoResults(null)
    setCameraLiveResults(null)
    setCameraSessionInventory(emptyDetectionResponse())
    setCameraPreviewSrc(null)
    setErrorMessage(null)

    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }

    if (videoInputRef.current) {
      videoInputRef.current.value = ''
    }
  }

  const validateFile = (file: File, kind: Exclude<SourceKind, 'camera'>): string | null => {
    if (kind === 'image') {
      if (!ACCEPTED_IMAGE_FILE_TYPES.includes(file.type)) {
        return 'Please upload a JPG, JPEG, or PNG image.'
      }

      if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
        return 'Image must be 10 MB or smaller.'
      }

      return null
    }

    if (!ACCEPTED_VIDEO_FILE_TYPES.includes(file.type)) {
      return 'Please upload an MP4, MOV, or AVI video.'
    }

    if (file.size > MAX_VIDEO_FILE_SIZE_BYTES) {
      return 'Video must be 100 MB or smaller.'
    }

    return null
  }

  const openFilePicker = (kind: Exclude<SourceKind, 'camera'>) => {
    setErrorMessage(null)

    if (kind === 'image') {
      imageInputRef.current?.click()
      return
    }

    videoInputRef.current?.click()
  }

  const parseErrorDetail = (payload: unknown, fallback: string) => {
    const errorPayload =
      payload && typeof payload === 'object' ? (payload as ErrorResponsePayload) : undefined

    return typeof errorPayload?.detail === 'string' ? errorPayload.detail : fallback
  }

  const uploadWithProgress = async (
    file: File,
    endpoint: string,
    processingLabel: string
  ): Promise<DetectionResponse | VideoDetectionResponse> => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')

    if (!apiBaseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is missing. Add it to your frontend environment.')
    }

    const formData = new FormData()
    formData.append('file', file)

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      const timeoutId = window.setTimeout(() => {
        request.abort()
        reject(new Error('timeout'))
      }, REQUEST_TIMEOUT_MS)

      request.open('POST', `${apiBaseUrl}${endpoint}`)
      request.responseType = 'json'

      request.upload.onprogress = (event) => {
        if (!event.lengthComputable) {
          return
        }

        const percent = Math.min(100, Math.round((event.loaded / event.total) * 100))
        setUploadProgress(percent)
      }

      request.onloadstart = () => {
        setPhase('uploading')
      }

      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
          setPhase('processing')
        }
      }

      request.onerror = () => {
        window.clearTimeout(timeoutId)
        reject(new Error('network'))
      }

      request.onabort = () => {
        window.clearTimeout(timeoutId)
        reject(new Error('timeout'))
      }

      request.onload = () => {
        window.clearTimeout(timeoutId)
        let payload: unknown = request.response

        if (!payload) {
          try {
            payload = JSON.parse(request.responseText || '{}')
          } catch {
            payload = {}
          }
        }

        if (request.status >= 200 && request.status < 300) {
          resolve(payload as DetectionResponse | VideoDetectionResponse)
          return
        }

        reject(
          new Error(
            parseErrorDetail(payload, `The AI service could not process this ${processingLabel}.`)
          )
        )
      }

      request.send(formData)
    })
  }

  const detectCameraFrame = async (blob: Blob): Promise<DetectionResponse> => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '')

    if (!apiBaseUrl) {
      throw new Error('NEXT_PUBLIC_API_BASE_URL is missing. Add it to your frontend environment.')
    }

    const formData = new FormData()
    formData.append('file', blob, 'camera-frame.jpg')

    const response = await fetch(`${apiBaseUrl}/detect`, {
      method: 'POST',
      body: formData,
    })

    let payload: unknown

    try {
      payload = await response.json()
    } catch {
      payload = {}
    }

    if (!response.ok) {
      throw new Error(parseErrorDetail(payload, 'The AI service could not process this camera frame.'))
    }

    return payload as DetectionResponse
  }

  const captureAndDetectFrame = async () => {
    if (
      cameraRequestInFlightRef.current ||
      !liveVideoRef.current ||
      !captureCanvasRef.current ||
      liveVideoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      console.log('STEP 7 Capturing frames skipped', {
        requestInFlight: cameraRequestInFlightRef.current,
        hasVideoRef: Boolean(liveVideoRef.current),
        hasCanvasRef: Boolean(captureCanvasRef.current),
        readyState: liveVideoRef.current?.readyState,
      })
      return
    }

    console.log('STEP 7 Capturing frames')

    const videoElement = liveVideoRef.current
    const canvas = captureCanvasRef.current
    const width = videoElement.videoWidth
    const height = videoElement.videoHeight

    if (!width || !height) {
      console.log('STEP 7 Capturing frames failed: video dimensions are not ready', {
        width,
        height,
      })
      return
    }

    cameraRequestInFlightRef.current = true

    try {
      canvas.width = width
      canvas.height = height

      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('Unable to read the live camera frame.')
      }

      context.drawImage(videoElement, 0, 0, width, height)

      const previewDataUrl = canvas.toDataURL('image/jpeg', 0.85)
      setCameraPreviewSrc(previewDataUrl)

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.85)
      })

      if (!blob) {
        throw new Error('Unable to capture a camera frame.')
      }

      const response = await detectCameraFrame(blob)
      setCameraLiveResults(response)
      mergeCameraInventory(response)
    } catch (error) {
      console.error('STEP 7 Capturing frames failed:', error)
      stopCameraLoop()

      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          setErrorMessage('Backend appears offline. Check that the FastAPI server is running and reachable.')
          return
        }

        setErrorMessage(error.message)
        return
      }

      setErrorMessage('Live camera scanning failed. Please try again.')
    } finally {
      cameraRequestInFlightRef.current = false
    }
  }

  const startCameraLoop = async () => {
    if (!cameraPermissionGranted) {
      setErrorMessage('Camera permission is required before starting the live scanner.')
      return
    }

    if (cameraScanning) {
      return
    }

    setErrorMessage(null)
    setCameraScanning(true)

    await captureAndDetectFrame()

    cameraIntervalRef.current = window.setInterval(() => {
      void captureAndDetectFrame()
    }, CAMERA_SCAN_INTERVAL_MS)
  }

  const openLiveCamera = () => {
    setIsCameraOpen(true)
  }

  const finishCameraScan = () => {
    setIsCameraOpen(false)
    stopCameraLoop()
    stopCameraStream()
    recordScanActivity({
      kind: 'camera',
      filename: cameraSessionInventory.filename,
      totalDetections: cameraSessionInventory.total_detections,
      inferenceTimeSeconds: cameraSessionInventory.inference_time_seconds,
      detectedClasses: cameraSessionInventory.detected_classes,
      objectCounts: cameraSessionInventory.object_counts,
    })
    setImageResults(cameraSessionInventory)
    setVideoResults(null)
    setPhase('results')
  }

  const handleFileChange =
    (kind: Exclude<SourceKind, 'camera'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }

      const validationError = validateFile(file, kind)

      if (validationError) {
        if (selectedMedia?.previewUrl) {
          URL.revokeObjectURL(selectedMedia.previewUrl)
        }

        setErrorMessage(validationError)
        setPhase('idle')
        setSourceKind(null)
        setSelectedMedia(null)
        setImageResults(null)
        setVideoResults(null)
        setCameraLiveResults(null)
        setCameraSessionInventory(emptyDetectionResponse())
        setUploadProgress(0)
        event.target.value = ''
        return
      }

      stopCameraLoop()
      setIsCameraOpen(false)
      stopCameraStream()

      if (selectedMedia?.previewUrl) {
        URL.revokeObjectURL(selectedMedia.previewUrl)
      }

      setSelectedMedia({
        file,
        kind,
        previewUrl: URL.createObjectURL(file),
      })
      setSourceKind(kind)
      setImageResults(null)
      setVideoResults(null)
      setCameraLiveResults(null)
      setCameraSessionInventory(emptyDetectionResponse())
      setCameraPreviewSrc(null)
      setUploadProgress(0)
      setErrorMessage(null)
      setPhase('preview')
    }

  const uploadSelectedMedia = async () => {
    if (!selectedMedia) {
      setErrorMessage('Choose an image or video before starting AI detection.')
      return
    }

    setUploadProgress(0)
    setErrorMessage(null)

    try {
      const response = await uploadWithProgress(
        selectedMedia.file,
        selectedMedia.kind === 'image' ? '/detect' : '/detect-video',
        selectedMedia.kind
      )

      setUploadProgress(100)
      setPhase('results')

      if (selectedMedia.kind === 'image') {
        const imageResponse = response as DetectionResponse
        setImageResults(imageResponse)
        setVideoResults(null)
        recordScanActivity({
          kind: 'image',
          filename: imageResponse.filename,
          totalDetections: imageResponse.total_detections,
          inferenceTimeSeconds: imageResponse.inference_time_seconds,
          detectedClasses: imageResponse.detected_classes,
          objectCounts: imageResponse.object_counts,
        })

        if (imageResponse.total_detections === 0) {
          setErrorMessage('No objects were detected in this image. Try a clearer photo or different angle.')
        }

        return
      }

      const videoResponse = response as VideoDetectionResponse
      setVideoResults(videoResponse)
      setImageResults(null)
      recordScanActivity({
        kind: 'video',
        filename: videoResponse.filename,
        totalDetections: videoResponse.detections.length,
        inferenceTimeSeconds: videoResponse.inference_time_seconds,
        detectedClasses: videoResponse.detected_classes,
        objectCounts: videoResponse.object_counts,
        totalFrames: videoResponse.total_frames,
        processedFrames: videoResponse.processed_frames,
      })

      if (videoResponse.detections.length === 0) {
        setErrorMessage('No objects were detected in this video. Try a clearer clip or slower camera movement.')
      }
    } catch (error) {
      setPhase('preview')
      setUploadProgress(0)

      if (error instanceof Error) {
        if (error.message === 'network') {
          setErrorMessage('Backend appears offline. Check that the FastAPI server is running and reachable.')
          return
        }

        if (error.message === 'timeout') {
          setErrorMessage(
            selectedMedia.kind === 'image'
              ? 'AI detection timed out. Please try again with a smaller or clearer image.'
              : 'Video analysis timed out. Please try again with a shorter or smaller video.'
          )
          return
        }

        setErrorMessage(error.message)
        return
      }

      setErrorMessage('Something went wrong during upload. Please try again.')
    }
  }

  const selectedFileSizeLabel = selectedMedia
    ? `${(selectedMedia.file.size / (1024 * 1024)).toFixed(2)} MB`
    : null

  const topConfidence = imageResults?.detections.length
    ? `${Math.round(Math.max(...imageResults.detections.map((detection) => detection.confidence)) * 100)}%`
    : videoResults?.detections.length
      ? `${Math.round(Math.max(...videoResults.detections.map((detection) => detection.confidence)) * 100)}%`
      : cameraLiveResults?.detections.length
        ? `${Math.round(Math.max(...cameraLiveResults.detections.map((detection) => detection.confidence)) * 100)}%`
        : '--'

  const resultClasses = imageResults?.detected_classes ?? videoResults?.detected_classes ?? []
  const resultDetections = imageResults?.detections ?? videoResults?.detections ?? []
  const resultObjectCounts = imageResults?.object_counts ?? videoResults?.object_counts ?? {}
  const objectCountEntries = Object.entries(resultObjectCounts)
  const liveObjectCountEntries = Object.entries(cameraLiveResults?.object_counts ?? {})
  const sessionObjectCountEntries = Object.entries(cameraSessionInventory.object_counts)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-white/10 bg-white/[0.045] p-5 md:p-6"
    >
      <input
        ref={imageInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange('image')}
      />

      <input
        ref={videoInputRef}
        type="file"
        accept=".mp4,.mov,.avi,video/mp4,video/quicktime,video/x-msvideo"
        className="hidden"
        onChange={handleFileChange('video')}
      />

      <canvas ref={captureCanvasRef} className="hidden" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
            <Sparkles className="w-6 h-6 text-blue-400" />
            AI Scanner
          </h2>
          <p className="mt-1 text-sm text-gray-400">Run image, video, and live inventory detection</p>
        </div>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <p className="text-sm leading-relaxed">{errorMessage}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {phase === 'idle' ? (
          <motion.div
            key="upload-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {uploadOptions.map((option, index) => {
              const Icon = option.icon

              return (
                <motion.button
                  key={option.kind}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  onClick={() => {
                    if (option.kind === 'camera') {
                      openLiveCamera()
                      return
                    }

                    openFilePicker(option.kind)
                  }}
                  className={`group relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br ${option.color} hover:shadow-2xl`}
                >
                  <div className="absolute inset-0 bg-white/10 transform group-hover:scale-110 transition-transform duration-300" />

                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-medium text-white text-sm">{option.label}</span>
                    <span className="text-xs text-blue-100/80">{option.description}</span>
                  </div>
                </motion.button>
              )
            })}
          </motion.div>
        ) : isCameraSelection && phase !== 'results' ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Live camera ready</p>
                <p className="text-gray-400 text-sm mt-1">
                  {cameraScanning
                    ? 'Scanning one frame every second and refreshing live object counts'
                    : 'Start the live scanner when you are ready'}
                </p>
              </div>
              <button
                onClick={resetScanner}
                className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <Camera className="h-4 w-4 text-emerald-300" />
                  <p className="text-sm font-medium text-white">Live Camera Feed</p>
                </div>
                <div className="relative w-full h-[420px] overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  <video
                    ref={setLiveVideoElement}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 border border-white/5" />
                  {cameraScanning ? (
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Scanning live
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <p className="text-gray-400 text-sm mb-2">Current Frame</p>
                    <p className="text-3xl font-bold text-white">{cameraLiveResults?.total_detections ?? 0}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                    <p className="text-gray-400 text-sm mb-2">Inventory So Far</p>
                    <p className="text-3xl font-bold text-white">{cameraSessionInventory.total_detections}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <p className="mb-3 text-sm text-gray-400">Current Frame</p>
                  {liveObjectCountEntries.length ? (
                    <div className="grid gap-3">
                      {liveObjectCountEntries.map(([label, count]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-lg border border-white/8 bg-black/10 px-4 py-3"
                        >
                          <span className="font-medium text-white">{label}</span>
                          <span className="text-lg font-semibold text-emerald-300">{count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {cameraScanning
                        ? 'Waiting for detected objects from the latest frame.'
                        : 'Start the live scanner to view current object counts.'}
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <p className="mb-3 text-sm text-gray-400">Inventory So Far</p>
                  {sessionObjectCountEntries.length ? (
                    <div className="grid gap-3">
                      {sessionObjectCountEntries.map(([label, count]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between rounded-lg border border-white/8 bg-black/10 px-4 py-3"
                        >
                          <span className="font-medium text-white">{label}</span>
                          <span className="text-lg font-semibold text-emerald-300">{count}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {cameraScanning
                        ? 'Unique detected objects will stay here for this scan.'
                        : 'Start the live scanner to build an inventory.'}
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <p className="mb-3 text-sm text-gray-400">Current Detections</p>
                  {cameraLiveResults?.detections.length ? (
                    <div className="grid gap-3">
                      {cameraLiveResults.detections.map((detection, index) => (
                        <div
                          key={`${detection.label}-${index}`}
                          className="flex items-center justify-between rounded-lg border border-white/8 bg-black/10 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-white">{detection.label}</p>
                            <p className="text-xs text-gray-400">
                              Bounding Box: {detection.bbox.map((value) => value.toFixed(0)).join(', ')}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-blue-300">
                            {Math.round(detection.confidence * 100)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {cameraScanning
                        ? 'No objects detected in the latest frame yet.'
                        : 'The current frame results will appear here once scanning starts.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => void startCameraLoop()}
                disabled={cameraScanning || !cameraPermissionGranted}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Camera
                </span>
              </button>
              <button
                onClick={stopCameraLoop}
                disabled={!cameraScanning}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Stop Camera
                </span>
              </button>
              <button
                onClick={finishCameraScan}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Finish Scan
              </button>
            </div>
          </motion.div>
        ) : phase === 'preview' && selectedMedia ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {selectedMedia.kind === 'image' ? 'Image ready for scanning' : 'Video ready for scanning'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedMedia.kind === 'image'
                    ? 'Review the preview, then start AI detection'
                    : 'Review the clip, then start video detection'}
                </p>
              </div>
              <button
                onClick={resetScanner}
                className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <div className="aspect-[16/10] w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                {selectedMedia.kind === 'image' ? (
                  <img
                    src={selectedMedia.previewUrl}
                    alt="Selected upload preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={selectedMedia.previewUrl}
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                  />
                )}
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{selectedMedia.file.name}</p>
                  <p className="text-xs text-gray-400">{selectedFileSizeLabel}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openFilePicker(selectedMedia.kind)}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => void uploadSelectedMedia()}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Run AI Detection
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : phase === 'uploading' || phase === 'processing' ? (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">
                  {phase === 'uploading'
                    ? selectedMedia?.kind === 'video'
                      ? 'Uploading video...'
                      : 'Uploading image...'
                    : selectedMedia?.kind === 'video'
                      ? 'Analyzing Video...'
                      : 'AI is analyzing your image...'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {phase === 'uploading'
                    ? selectedMedia?.kind === 'video'
                      ? 'Sending the video to the detection API'
                      : 'Sending the image to the detection API'
                    : selectedMedia?.kind === 'video'
                      ? 'Sampling frames and running YOLO inference'
                      : 'The model is running inference and preparing results'}
                </p>
              </div>
              <button
                onClick={resetScanner}
                className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {phase === 'uploading' ? 'Upload Progress' : 'Inference Status'}
                </span>
                <span className="text-sm font-medium text-blue-400">
                  {phase === 'uploading' ? `${uploadProgress}%` : 'Processing'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: phase === 'uploading' ? `${uploadProgress}%` : '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="relative h-48 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              {selectedMedia?.kind === 'image' && imagePreviewSrc ? (
                <img
                  src={imagePreviewSrc}
                  alt="Current upload preview"
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
              ) : null}

              {selectedMedia?.kind === 'video' && selectedMedia.previewUrl ? (
                <video
                  src={selectedMedia.previewUrl}
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : null}

              <div className="absolute inset-0 bg-slate-950/60" />
              <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
                <p className="text-white font-medium">
                  {selectedMedia?.kind === 'video' ? 'Analyzing Video...' : 'Analyzing content...'}
                </p>
                <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
              </motion.div>

              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ y: [0, 100] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full" />
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Scan Complete</p>
                  <p className="text-gray-400 text-sm">Upload another file to continue</p>
                </div>
              </div>
              <button
                onClick={resetScanner}
                className="px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition"
              >
                New Scan
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  {isVideoSelection ? (
                    <Film className="h-4 w-4 text-blue-300" />
                  ) : isCameraSelection ? (
                    <Camera className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-blue-300" />
                  )}
                  <p className="text-sm font-medium text-white">
                    {isVideoSelection
                      ? 'Uploaded Video Preview'
                      : isCameraSelection
                        ? 'Final Camera Snapshot'
                        : imageResults?.annotated_image_base64
                          ? 'Annotated Detection Preview'
                          : 'Uploaded Image Preview'}
                  </p>
                </div>
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  {isVideoSelection && selectedMedia?.previewUrl ? (
                    <video
                      src={selectedMedia.previewUrl}
                      className="h-full w-full object-cover"
                      controls
                      preload="metadata"
                    />
                  ) : finalPreviewSrc ? (
                    <img
                      src={finalPreviewSrc}
                      alt="Detection result preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      No preview available
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <p className="text-gray-400 text-sm mb-2">
                    {isVideoSelection ? 'Total Frames' : 'Total Objects'}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {isVideoSelection ? (videoResults?.total_frames ?? 0) : (imageResults?.total_detections ?? 0)}
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <p className="text-gray-400 text-sm mb-2">Inference Time</p>
                  <p className="text-3xl font-bold text-white">
                    {imageResults
                      ? `${imageResults.inference_time_seconds.toFixed(2)}s`
                      : videoResults
                        ? `${videoResults.inference_time_seconds.toFixed(2)}s`
                        : '--'}
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <p className="text-gray-400 text-sm mb-2">
                    {isVideoSelection ? 'Processed Frames' : 'Detected Classes'}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {isVideoSelection ? (videoResults?.processed_frames ?? 0) : resultClasses.length}
                  </p>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                  <p className="text-gray-400 text-sm mb-2">
                    {isVideoSelection ? 'Detected Classes' : 'Top Confidence'}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {isVideoSelection ? resultClasses.length : topConfidence}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="mb-3 text-sm text-gray-400">Object Counts</p>
              {objectCountEntries.length ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {objectCountEntries.map(([label, count]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-white/8 bg-black/10 px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-400">{label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{count}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  {isVideoSelection
                    ? 'No object counts available for this video.'
                    : isCameraSelection
                      ? 'No object counts available for the final camera scan.'
                      : 'No object counts available for this image.'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {resultClasses.map((detectedClass, index) => (
                <motion.div
                  key={detectedClass.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-lg border border-white/10 bg-white/5 p-5 backdrop-blur-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-blue-300/80">Detected Class</p>
                      <h3 className="mt-1 text-lg font-semibold text-white">{detectedClass.label}</h3>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-300">
                      <Boxes className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/8 bg-black/10 p-3">
                      <p className="text-xs text-gray-400">Object Count</p>
                      <p className="mt-1 text-2xl font-bold text-white">{detectedClass.count}</p>
                    </div>
                    <div className="rounded-lg border border-white/8 bg-black/10 p-3">
                      <p className="text-xs text-gray-400">Top Confidence</p>
                      <p className="mt-1 text-2xl font-bold text-white">
                        {Math.round(detectedClass.top_confidence * 100)}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/8 bg-black/10 p-3">
                      <p className="text-xs text-gray-400">Average Confidence</p>
                      <p className="mt-1 text-lg font-semibold text-blue-300">
                        {Math.round(detectedClass.average_confidence * 100)}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/8 bg-black/10 p-3">
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-400">Detected</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="mb-3 text-sm text-gray-400">Detection Details</p>
              {resultDetections.length ? (
                <div className="grid gap-3">
                  {resultDetections.map((detection, index) => (
                    <div
                      key={`${detection.label}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-white/8 bg-black/10 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-500/10 p-2 text-purple-300">
                          <ScanSearch className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{detection.label}</p>
                          <p className="text-xs text-gray-400">
                            Bounding Box: {detection.bbox.map((value) => value.toFixed(0)).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-300">
                        <Clock3 className="h-4 w-4" />
                        {Math.round(detection.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  {isVideoSelection
                    ? 'No object details available for this video.'
                    : isCameraSelection
                      ? 'No object details available for the final camera scan.'
                      : 'No object details available for this image.'}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
