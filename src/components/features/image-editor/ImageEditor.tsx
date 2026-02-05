import { useEffect, useState } from "react";
import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import IconAdjustment from "@/assets/icons/icon_quickdrop_adjustment.svg?react";
import IconAdjustmentActive from "@/assets/icons/icon_quickdrop_adjustment_active.svg?react";
import IconRotation from "@/assets/icons/icon_quickdrop_rotation.svg?react";
import IconRotationActive from "@/assets/icons/icon_quickdrop_rotation_active.svg?react";
import IconCrop from "@/assets/icons/icon_quickdrop_crop.svg?react";
import IconCropActive from "@/assets/icons/icon_quickdrop_crop_active.svg?react";
import IconReset from "@/assets/icons/icon_reset.svg?react";
import { useNavigate } from "react-router-dom";
import { AdjustmentToolbar } from "./AdjustmentToolbar";
import { CropperView } from "./CropperView";
import { CropToolbar } from "./CropToolbar";
import { RotationToolbar } from "./RotationToolbar";
import { set } from "zod";

interface ImageEditorProps {
  file: File;
  initialState: {
    brightness: number;
    contrast: number;
    structure: number;
    temperature: number;
    saturation: number;
    exposure: number;
  };

  onNext: (
    blob: Blob,
    adjustmentLevels: {
      brightness: number;
      contrast: number;
      structure: number;
      temperature: number;
      saturation: number;
      exposure: number;
    },
  ) => void;
}

interface EditStateProps {}

export const ImageEditor = ({
  file,
  initialState,
  onNext,
}: ImageEditorProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [editState, setEditState] = useState<{
    adjustment: {
      brightness: number;
      contrast: number;
      structure: number;
      temperature: number;
      saturation: number;
      exposure: number;
    };
    crop: {
      x: number;
      y: number;
      zoom: number;
      croppedAreaPixels: any;
    };
    rotation: {
      angle: number;
      flipHorizontal: boolean;
      flipVertical: boolean;
    };
  }>({
    adjustment: {
      brightness: 0,
      contrast: 0,
      structure: 0,
      temperature: 0,
      saturation: 0,
      exposure: 0,
    },
    crop: {
      x: 0,
      y: 0,
      zoom: 1,
      croppedAreaPixels: null,
    },
    rotation: {
      angle: 0,
      flipHorizontal: false,
      flipVertical: false,
    },
  });

  const [activeTool, setActiveTool] = useState("adjustment");
  const [isWideImage, setIsWideImage] = useState(false);
  const [fitZoom, setFitZoom] = useState(1);
  const [cropMode, setCropMode] = useState<"original" | "fixedratio">(
    "fixedratio",
  );
  const [fillColor, setFillColor] = useState(0);

  const navigate = useNavigate();

  const tools = [
    {
      id: "adjustment",
      icon: IconAdjustment,
      activeIcon: IconAdjustmentActive,
    },
    {
      id: "crop",
      icon: IconCrop,
      activeIcon: IconCropActive,
    },
    {
      id: "rotation",
      icon: IconRotation,
      activeIcon: IconRotationActive,
    },
  ];

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

  const handleExportImage = () => {
    if (!previewUrl || !editState.crop.croppedAreaPixels) return;

    const img = new Image();
    img.src = previewUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const { width: originalWidth, height: originalHeight } = img;
      const { angle: rotation, flipHorizontal } = editState.rotation;
      const { croppedAreaPixels } = editState.crop;

      // 1. 회전된 이미지의 바운딩 박스 크기 계산
      const radian = (rotation * Math.PI) / 180;
      const bBoxWidth =
        Math.abs(Math.cos(radian) * originalWidth) +
        Math.abs(Math.sin(radian) * originalHeight);
      const bBoxHeight =
        Math.abs(Math.sin(radian) * originalWidth) +
        Math.abs(Math.cos(radian) * originalHeight);

      // 2. 임시 캔버스 생성 (회전/반전 적용 전체 이미지 그리기용)
      canvas.width = bBoxWidth;
      canvas.height = bBoxHeight;

      // 3. 캔버스 변환 및 이미지 그리기
      ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
      ctx.rotate(radian);
      ctx.scale(flipHorizontal ? -1 : 1, 1);
      ctx.translate(-originalWidth / 2, -originalHeight / 2);

      // 필터 적용
      ctx.filter = getFilterStyle(editState.adjustment);
      ctx.drawImage(img, 0, 0);

      // 4. 크롭된 영역 추출
      // 캔버스 사이즈는 croppedAreaPixels의 크기로 설정
      const cropWidth = croppedAreaPixels.width;
      const cropHeight = croppedAreaPixels.height;
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext("2d");

      if (!cropCtx) return;

      // 배경을 색으로 채움 (여백)
      const hex = Math.round(fillColor).toString(16).padStart(2, "0");
      cropCtx.fillStyle = `#${hex}${hex}${hex}`;
      cropCtx.fillRect(0, 0, cropWidth, cropHeight);

      // 원본 이미지가 그려진 임시 캔버스(canvas)를 cropCanvas에 그림
      // croppedAreaPixels.x, y가 음수일 수 있으므로(여백 포함시),
      // 그 역수만큼 이동하여 그림.
      cropCtx.drawImage(canvas, -croppedAreaPixels.x, -croppedAreaPixels.y);

      // 5. 최종 리사이징을 위한 캔버스 생성 (MAX_SIZE 1280)
      const MAX_SIZE = 1280;
      let dWidth = croppedAreaPixels.width;
      let dHeight = croppedAreaPixels.height;

      if (dWidth > MAX_SIZE || dHeight > MAX_SIZE) {
        if (dWidth > dHeight) {
          dHeight = (dHeight * MAX_SIZE) / dWidth;
          dWidth = MAX_SIZE;
        } else {
          dWidth = (dWidth * MAX_SIZE) / dHeight;
          dHeight = MAX_SIZE;
        }
      }

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = dWidth;
      outputCanvas.height = dHeight;
      const outputCtx = outputCanvas.getContext("2d");

      if (!outputCtx) return;

      // 리사이징하여 최종 캔버스에 그리기
      outputCtx.drawImage(
        cropCanvas,
        0,
        0,
        cropWidth,
        cropHeight,
        0,
        0,
        dWidth,
        dHeight,
      );

      // 6. Blob export
      const exportType = file.type === "image/heic" ? "image/jpeg" : file.type;
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            onNext(blob, editState.adjustment);
          } else {
            console.error("이미지 내보내기 실패");
          }
        },
        exportType,
        0.9,
      );
    };
  };

  const handleApplyEdit = () => {
    if (!previewUrl || !editState.crop.croppedAreaPixels) return;

    const img = new Image();
    img.src = previewUrl;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const { width: originalWidth, height: originalHeight } = img;
      const { angle: rotation, flipHorizontal } = editState.rotation;
      const { croppedAreaPixels } = editState.crop;

      const radian = (rotation * Math.PI) / 180;
      const bBoxWidth =
        Math.abs(Math.cos(radian) * originalWidth) +
        Math.abs(Math.sin(radian) * originalHeight);
      const bBoxHeight =
        Math.abs(Math.sin(radian) * originalWidth) +
        Math.abs(Math.cos(radian) * originalHeight);

      const canvas = document.createElement("canvas");
      canvas.width = bBoxWidth;
      canvas.height = bBoxHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // 회전 및 스케일 변환
      ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
      ctx.rotate(radian);
      ctx.scale(flipHorizontal ? -1 : 1, 1);
      ctx.translate(-originalWidth / 2, -originalHeight / 2);

      // 원본 그리기 (필터 없음)
      ctx.drawImage(img, 0, 0);

      // 크롭 캔버스 생성
      const cropWidth = croppedAreaPixels.width;
      const cropHeight = croppedAreaPixels.height;
      const cropCanvas = document.createElement("canvas");
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      const cropCtx = cropCanvas.getContext("2d");

      if (!cropCtx) return;

      // 배경을 색으로 채움
      const hex = Math.round(fillColor).toString(16).padStart(2, "0");
      cropCtx.fillStyle = `#${hex}${hex}${hex}`;
      cropCtx.fillRect(0, 0, cropWidth, cropHeight);

      // 회전된 이미지를 크롭 영역만큼 그리기
      cropCtx.drawImage(canvas, -croppedAreaPixels.x, -croppedAreaPixels.y);

      const exportType = file.type === "image/heic" ? "image/jpeg" : file.type;

      cropCanvas.toBlob((blob) => {
        if (!blob) return;

        const newUrl = URL.createObjectURL(blob);
        setPreviewUrl(newUrl);

        // 새 이미지 기준 정보 업데이트
        const imageRatio = cropWidth / cropHeight;
        setIsWideImage(imageRatio > 3 / 4);

        const TARGET_ASPECT = 3 / 4;
        let fit = 1;
        if (imageRatio > TARGET_ASPECT) {
          fit = TARGET_ASPECT / imageRatio;
        } else {
          fit = imageRatio / TARGET_ASPECT;
        }
        setFitZoom(fit);

        // 상태 초기화
        setEditState((prev) => ({
          ...prev,
          crop: {
            x: 0,
            y: 0,
            zoom: 1,
            croppedAreaPixels: null,
          },
          rotation: {
            angle: 0,
            flipHorizontal: false,
            flipVertical: false,
          },
        }));
      }, exportType);
    };
  };

  const handleToolChange = (toolId: string) => {
    if (
      (activeTool === "crop" && toolId !== "crop") ||
      (activeTool === "rotation" && toolId !== "rotation")
    ) {
      handleApplyEdit();
    }
    setActiveTool(toolId);
  };

  const handleReset = () => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const imageRatio = width / height;
      setIsWideImage(imageRatio > 3 / 4);

      const TARGET_ASPECT = 3 / 4;
      let fit = 1;
      if (imageRatio > TARGET_ASPECT) {
        fit = TARGET_ASPECT / imageRatio;
      } else {
        fit = imageRatio / TARGET_ASPECT;
      }
      setFitZoom(fit);
    };

    setEditState({
      adjustment: initialState,
      crop: {
        x: 0,
        y: 0,
        zoom: 1,
        croppedAreaPixels: null,
      },
      rotation: {
        angle: 0,
        flipHorizontal: false,
        flipVertical: false,
      },
    });

    setCropMode("fixedratio");
    setFillColor(0);
    // setActiveTool("adjustment");
  };

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    const img = new Image();
    img.src = objectUrl;
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const imageRatio = width / height;
      setIsWideImage(imageRatio > 3 / 4);

      // fitZoom 계산 (이미지가 3:4 프레임 안에 딱 맞게 들어가는 줌 레벨)
      // react-easy-crop에서 objectFit="cover"일 때(즉 꽉 채울 때) 기준
      const TARGET_ASPECT = 3 / 4;
      let fit = 1;
      if (imageRatio > TARGET_ASPECT) {
        // 이미지가 더 넓음 -> 높이가 맞음, 너비가 잘림
        // 전체 너비를 보려면 축소해야 함
        fit = TARGET_ASPECT / imageRatio;
      } else {
        // 이미지가 더 높음 -> 너비가 맞음, 높이가 잘림
        // 전체 높이를 보려면 축소해야 함
        fit = imageRatio / TARGET_ASPECT;
      }
      setFitZoom(fit);
    };

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  useEffect(() => {
    setEditState((prev) => ({
      ...prev,
      adjustment: initialState,
    }));
  }, [initialState]);

  return (
    <div className="flex h-dvh flex-col">
      {/* 헤더 & 툴바 */}
      <div className="flex-none">
        <header className="flex items-center justify-between px-4 pt-2 pb-6 tracking-tight">
          <IconXbuttonGray3
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="H2 text-white">바이브 드랍</h2>
          <p
            className="ST2 cursor-pointer text-white"
            onClick={() => handleExportImage()}
          >
            다음
          </p>
        </header>
        <div className="flex justify-between gap-2 px-9">
          <div className="flex gap-2">
            {tools.map((tool) => (
              <button key={tool.id} onClick={() => handleToolChange(tool.id)}>
                {activeTool === tool.id ? <tool.activeIcon /> : <tool.icon />}
              </button>
            ))}
          </div>
          <button onClick={handleReset}>
            <IconReset className="" />
          </button>
        </div>
      </div>
      {/* 이미지 */}
      <div className="mx-9 mt-5 mb-8 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div
          className="relative flex aspect-[3/4] h-auto max-h-full w-auto max-w-full items-center justify-center overflow-hidden transition-colors duration-100"
          style={{
            backgroundColor: `rgb(${fillColor}, ${fillColor}, ${fillColor})`,
          }}
        >
          {/* Dummy Image for Layout Sizing */}
          <img
            src={previewUrl!}
            alt=""
            className="pointer-events-none aspect-[3/4] h-auto max-h-full w-auto max-w-full object-contain opacity-0"
            aria-hidden="true"
          />

          <div className="absolute inset-0 h-full w-full">
            <CropperView
              image={previewUrl!}
              crop={editState.crop}
              adjustment={editState.adjustment}
              rotation={editState.rotation.angle}
              flipHorizontal={editState.rotation.flipHorizontal}
              onCropChange={(newCrop) =>
                setEditState((prev) => ({ ...prev, crop: newCrop }))
              }
              isWideImage={isWideImage}
              readOnly={activeTool !== "crop" && activeTool !== "rotation"}
              cropMode={activeTool === "rotation" ? "original" : cropMode}
              restrictPosition={
                activeTool === "rotation" ? false : cropMode === "fixedratio"
              }
              minZoom={
                activeTool === "rotation" || cropMode === "original"
                  ? fitZoom / 2
                  : 1
              }
              maxZoom={
                activeTool === "rotation" || cropMode === "original"
                  ? fitZoom
                  : 3
              }
            />
          </div>
        </div>
      </div>
      {/* 세부 조정 툴바 */}
      {activeTool === "adjustment" && (
        <AdjustmentToolbar
          levels={editState.adjustment}
          onChange={(newLevels) =>
            setEditState((prev) => ({
              ...prev,
              adjustment: newLevels,
            }))
          }
        />
      )}
      {activeTool === "crop" && (
        <CropToolbar
          cropMode={cropMode}
          onModeChange={(mode) => {
            setCropMode(mode);
            setEditState((prev) => ({
              ...prev,
              crop: {
                x: 0,
                y: 0,
                zoom: mode === "original" ? fitZoom : 1, // original이면 fitZoom으로 시작
                croppedAreaPixels: null,
              },
            }));
          }}
          onColorChange={(color) => setFillColor(color)}
        />
      )}
      {activeTool === "rotation" && (
        <RotationToolbar
          rotation={editState.rotation.angle}
          isFlipped={editState.rotation.flipHorizontal}
          onRotationChange={(angle) =>
            setEditState((prev) => ({
              ...prev,
              rotation: { ...prev.rotation, angle },
            }))
          }
          onFlipChange={(isFlipped) =>
            setEditState((prev) => ({
              ...prev,
              rotation: { ...prev.rotation, flipHorizontal: isFlipped },
            }))
          }
        />
      )}
    </div>
  );
};
