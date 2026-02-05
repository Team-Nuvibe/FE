import { useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";

interface CropState {
  x: number;
  y: number;
  zoom: number;
  croppedAreaPixels: Area | null;
}

interface CropperViewProps {
  image: string;
  crop: CropState;
  adjustment: {
    brightness: number;
    contrast: number;
    structure: number;
    temperature: number;
    saturation: number;
    exposure: number;
  };
  rotation?: number;
  flipHorizontal?: boolean;
  isWideImage: boolean;
  readOnly?: boolean;
  onCropChange: (crop: CropState) => void;
  cropMode?: "original" | "fixedratio";
  minZoom?: number;
  maxZoom?: number;
  restrictPosition?: boolean;
}

export const CropperView = ({
  image,
  crop,
  adjustment,
  rotation = 0,
  flipHorizontal = false,
  readOnly = false,
  onCropChange,
  cropMode = "fixedratio",
  minZoom = 1,
  maxZoom = 3,
  restrictPosition,
}: CropperViewProps) => {
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      onCropChange({
        ...crop,
        croppedAreaPixels,
      });
    },
    [onCropChange, crop],
  );

  const getFilterStyle = (levels: {
    brightness: number;
    contrast: number;
    structure: number;
    temperature: number;
    saturation: number;
    exposure: number;
  }) => {
    const exposureFactor = 1 + (levels.exposure / 50) * 0.5;
    const brightnessFactor = 1 + (levels.brightness / 50) * 0.2;
    const finalBrightness = brightnessFactor * exposureFactor * 100;
    return `brightness(${
      finalBrightness > 100
        ? (finalBrightness - 100) * 2 + 100
        : (finalBrightness - 100) * 4 + 100
    }%) contrast(${100 + levels.contrast / 2 + levels.structure / 2}%) sepia(${
      levels.temperature > 0 ? levels.temperature : 0
    }%) hue-rotate(${
      levels.temperature < 0 ? levels.temperature * -0.8 : 0
    }deg) saturate(${100 + levels.saturation * 2}%)`.trim();
  };

  return (
    <div
      className={`relative h-full w-full ${
        readOnly ? "pointer-events-none" : ""
      }`}
    >
      <Cropper
        image={image}
        crop={{ x: crop.x, y: crop.y }}
        zoom={crop.zoom}
        rotation={rotation}
        aspect={3 / 4}
        onCropChange={(newCrop) => onCropChange({ ...crop, ...newCrop })}
        onZoomChange={(newZoom) => onCropChange({ ...crop, zoom: newZoom })}
        onCropComplete={onCropComplete}
        objectFit="cover"
        restrictPosition={restrictPosition ?? (cropMode === "fixedratio")}
        minZoom={minZoom}
        maxZoom={maxZoom}
        showGrid={!readOnly}
        style={{
          mediaStyle: {
            filter: getFilterStyle(adjustment),
            // objectFit: cover 사용 시 width/height 오버라이드 불필요하거나,
            // 커버 동작을 위해 auto/auto로 두는 편이 나음. 기존 로직 제거.
            maxWidth: "none",
            maxHeight: "none",
          },
          cropAreaStyle: {
            border: readOnly ? "none" : undefined,
          },
        }}
        transform={[
          `translate(${crop.x}px, ${crop.y}px)`,
          `rotate(${rotation}deg)`,
          `scale(${crop.zoom})`,
          flipHorizontal ? "scaleX(-1)" : "",
        ].join(" ")}
      />
    </div>
  );
};
