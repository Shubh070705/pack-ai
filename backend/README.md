# PackAI FastAPI Backend

This backend adds image upload and YOLO11-based object detection for the PackAI Next.js app.

## Endpoints

- `GET /health` returns service status and the configured model name.
- `POST /detect` accepts a multipart image upload under the `file` field and returns detected object counts as JSON.

## Response shape

```json
{
  "filename": "living-room.jpg",
  "image_width": 1920,
  "image_height": 1080,
  "total_detections": 4,
  "inference_time_seconds": 0.287,
  "detected_classes": [
    {
      "label": "chair",
      "count": 2,
      "average_confidence": 0.9012,
      "top_confidence": 0.9214
    }
  ],
  "object_counts": {
    "chair": 2,
    "couch": 1,
    "tv": 1
  },
  "annotated_image_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "detections": [
    {
      "label": "chair",
      "confidence": 0.9214,
      "bbox": [125.2, 280.5, 411.8, 878.4]
    }
  ]
}
```

## Local setup

1. Create a Python virtual environment inside `backend/`.
2. Install dependencies from `requirements.txt`.
3. Copy `.env.example` to `.env` if you want to customize the model or thresholds.
4. Start the API:

```bash
uvicorn app.main:app --reload --app-dir backend
```

The first YOLO run may download model weights for `yolo11m.pt` if they are not already present on your machine.

## Example request

```bash
curl -X POST http://127.0.0.1:8000/detect \
  -F "file=@/absolute/path/to/image.jpg"
```
