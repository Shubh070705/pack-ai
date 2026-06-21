from pydantic import BaseModel


class DetectionItem(BaseModel):
    label: str
    confidence: float
    bbox: list[float]


class DetectionClassSummary(BaseModel):
    label: str
    count: int
    average_confidence: float
    top_confidence: float


class DetectionResponse(BaseModel):
    filename: str
    image_width: int
    image_height: int
    total_detections: int
    inference_time_seconds: float
    detected_classes: list[DetectionClassSummary]
    object_counts: dict[str, int]
    annotated_image_base64: str | None = None
    detections: list[DetectionItem]


class VideoDetectionResponse(BaseModel):
    filename: str
    total_frames: int
    processed_frames: int
    inference_time_seconds: float
    detected_classes: list[DetectionClassSummary]
    object_counts: dict[str, int]
    detections: list[DetectionItem]
