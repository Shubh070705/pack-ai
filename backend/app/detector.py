
from collections import Counter
from io import BytesIO
import os
from pathlib import Path
import tempfile
from time import perf_counter
import base64

import cv2
from fastapi import HTTPException, UploadFile, status
from PIL import Image, UnidentifiedImageError
from ultralytics import YOLO

from .config import Settings
from .schemas import (
    DetectionClassSummary,
    DetectionItem,
    DetectionResponse,
    VideoDetectionResponse,
)

LABEL_MAP = {
    "couch": "Sofa",
    "chair": "Chair",
    "tv": "Television",
    "potted plant": "Plant",
    "dining table": "Table",
    "refrigerator": "Fridge",
    "bed": "Bed",
}

FRAME_SAMPLE_INTERVAL = 15
DETECTION_CONFIDENCE_THRESHOLD = 0.45
IMAGE_DUPLICATE_TOLERANCE = 30
VIDEO_DUPLICATE_IOU_THRESHOLD = 0.5


class YoloDetector:

    def __init__(self, settings: Settings):
        self.settings = settings
        self.model = YOLO(settings.yolo_model)

    async def detect(self, image_file: UploadFile) -> DetectionResponse:
        image_bytes = await image_file.read()
        self._validate_upload_bytes(
            file_bytes=image_bytes,
            file_kind="Image",
            max_size_mb=self.settings.max_upload_size_mb,
        )

        try:
            image = Image.open(BytesIO(image_bytes)).convert("RGB")
        except UnidentifiedImageError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported image format.",
            ) from exc

        start = perf_counter()
        result = self._predict(image)[0]
        inference_time_seconds = round(perf_counter() - start, 3)
        detections = self._collect_image_detections(result)
        detected_classes, object_counts = self._build_class_summaries(detections)

        annotated_image_base64 = None

        if len(detections) > 0:

            plotted = result.plot()

            annotated = Image.fromarray(plotted)

            buffer = BytesIO()

            annotated.save(buffer, format="PNG")

            annotated_image_base64 = base64.b64encode(
                buffer.getvalue()
            ).decode("utf-8")

        return DetectionResponse(
            filename=image_file.filename or "upload",
            image_width=image.width,
            image_height=image.height,
            total_detections=len(detections),
            inference_time_seconds=inference_time_seconds,
            detected_classes=detected_classes,
            object_counts=object_counts,
            annotated_image_base64=annotated_image_base64,
            detections=detections,
        )

    async def detect_video(
        self,
        video_file: UploadFile,
    ) -> VideoDetectionResponse:
        video_bytes = await video_file.read()
        self._validate_upload_bytes(
            file_bytes=video_bytes,
            file_kind="Video",
            max_size_mb=self.settings.max_video_upload_size_mb,
        )

        temp_path = self._write_temp_video(
            file_bytes=video_bytes,
            filename=video_file.filename,
        )

        cap = cv2.VideoCapture(temp_path)

        if not cap.isOpened():
            os.unlink(temp_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported or corrupted video file.",
            )

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        processed_frames = 0
        merged_detections: list[DetectionItem] = []
        frame_index = 0
        start = perf_counter()

        try:
            while True:
                ok, frame = cap.read()

                if not ok:
                    break

                frame_index += 1

                if frame_index % FRAME_SAMPLE_INTERVAL != 0:
                    continue

                processed_frames += 1
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                result = self._predict(rgb_frame)[0]

                for detection in self._collect_frame_detections(result):
                    self._merge_video_detection(
                        detections=merged_detections,
                        candidate=detection,
                    )
        finally:
            cap.release()
            os.unlink(temp_path)

        inference_time_seconds = round(perf_counter() - start, 3)

        if total_frames <= 0:
            total_frames = frame_index

        detected_classes, object_counts = self._build_class_summaries(
            merged_detections
        )

        return VideoDetectionResponse(
            filename=video_file.filename or "upload",
            total_frames=total_frames,
            processed_frames=processed_frames,
            inference_time_seconds=inference_time_seconds,
            detected_classes=detected_classes,
            object_counts=object_counts,
            detections=merged_detections,
        )

    def _validate_upload_bytes(
        self,
        file_bytes: bytes,
        file_kind: str,
        max_size_mb: int,
    ) -> None:
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty.",
            )

        max_bytes = max_size_mb * 1024 * 1024

        if len(file_bytes) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=(
                    f"{file_kind} exceeds "
                    f"{max_size_mb} MB limit."
                ),
            )

    def _predict(self, source):
        return self.model.predict(
            source=source,
            imgsz=960,
            conf=self.settings.confidence_threshold,
            iou=self.settings.iou_threshold,
            max_det=50,
            verbose=False,
        )

    def _collect_image_detections(self, result) -> list[DetectionItem]:
        detections: list[DetectionItem] = []

        for detection in self._collect_frame_detections(result):
            if self._has_image_duplicate(detections, detection):
                continue

            detections.append(detection)

        return detections

    def _collect_frame_detections(self, result) -> list[DetectionItem]:
        names = result.names
        detections: list[DetectionItem] = []

        for box in result.boxes:
            confidence = float(box.conf.item())

            if confidence < DETECTION_CONFIDENCE_THRESHOLD:
                continue

            cls_index = int(box.cls.item())
            raw_label = str(names[cls_index])
            label = LABEL_MAP.get(raw_label, raw_label.title())
            bbox = [round(float(v), 2) for v in box.xyxy[0].tolist()]

            detections.append(
                DetectionItem(
                    label=label,
                    confidence=round(confidence, 4),
                    bbox=bbox,
                )
            )

        return detections

    def _has_image_duplicate(
        self,
        detections: list[DetectionItem],
        candidate: DetectionItem,
    ) -> bool:
        for existing in detections:
            if existing.label != candidate.label:
                continue

            if self._bbox_close(existing.bbox, candidate.bbox):
                return True

        return False

    def _bbox_close(self, left: list[float], right: list[float]) -> bool:
        return all(
            abs(left[index] - right[index]) < IMAGE_DUPLICATE_TOLERANCE
            for index in range(4)
        )

    def _merge_video_detection(
        self,
        detections: list[DetectionItem],
        candidate: DetectionItem,
    ) -> None:
        for index, existing in enumerate(detections):
            if existing.label != candidate.label:
                continue

            if self._bbox_iou(existing.bbox, candidate.bbox) < VIDEO_DUPLICATE_IOU_THRESHOLD:
                continue

            if candidate.confidence > existing.confidence:
                detections[index] = candidate

            return

        detections.append(candidate)

    def _bbox_iou(self, left: list[float], right: list[float]) -> float:
        x_left = max(left[0], right[0])
        y_top = max(left[1], right[1])
        x_right = min(left[2], right[2])
        y_bottom = min(left[3], right[3])

        if x_right <= x_left or y_bottom <= y_top:
            return 0.0

        intersection = (x_right - x_left) * (y_bottom - y_top)
        left_area = (left[2] - left[0]) * (left[3] - left[1])
        right_area = (right[2] - right[0]) * (right[3] - right[1])
        union = left_area + right_area - intersection

        if union <= 0:
            return 0.0

        return intersection / union

    def _build_class_summaries(
        self,
        detections: list[DetectionItem],
    ) -> tuple[list[DetectionClassSummary], dict[str, int]]:
        counts = Counter()
        confidence_map: dict[str, list[float]] = {}

        for detection in detections:
            counts[detection.label] += 1
            confidence_map.setdefault(detection.label, []).append(
                detection.confidence
            )

        detected_classes = [
            DetectionClassSummary(
                label=label,
                count=count,
                average_confidence=round(
                    sum(confidence_map[label]) / len(confidence_map[label]),
                    4,
                ),
                top_confidence=round(max(confidence_map[label]), 4),
            )
            for label, count in sorted(counts.items())
        ]

        return detected_classes, dict(sorted(counts.items()))

    def _write_temp_video(
        self,
        file_bytes: bytes,
        filename: str | None,
    ) -> str:
        suffix = Path(filename or "upload.mp4").suffix or ".mp4"
        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        )

        try:
            temp_file.write(file_bytes)
            return temp_file.name
        finally:
            temp_file.close()
