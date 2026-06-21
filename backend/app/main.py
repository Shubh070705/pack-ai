from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .detector import YoloDetector
from .schemas import DetectionResponse, VideoDetectionResponse

settings = get_settings()
detector: YoloDetector | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global detector
    detector = YoloDetector(settings)
    yield
    detector = None


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "model": settings.yolo_model,
    }


@app.post("/detect", response_model=DetectionResponse)
async def detect_objects(file: UploadFile = File(...)) -> DetectionResponse:
    if detector is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is still loading. Please retry shortly.",
        )

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a valid image file.",
        )

    return await detector.detect(file)


@app.post("/detect-video", response_model=VideoDetectionResponse)
async def detect_video(file: UploadFile = File(...)) -> VideoDetectionResponse:
    if detector is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is still loading. Please retry shortly.",
        )

    if not file.content_type or not file.content_type.startswith("video/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please upload a valid video file.",
        )

    return await detector.detect_video(file)
