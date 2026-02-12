import { useEffect, useRef, useState } from "react";
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
import type { EditState, ImageAdjustmentLevels } from "@/types/vibedrop";

interface ImageEditorProps {
  file: File;
  initialState: ImageAdjustmentLevels;
  onNext: (blob: Blob, adjustmentLevels: ImageAdjustmentLevels) => void;
}

export const ImageEditor = ({
  file,
  initialState,
  onNext,
}: ImageEditorProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({
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
  const [imageOriginalSize, setImageOriginalSize] = useState({
    width: 0,
    height: 0,
  });

  const [fillColor, setFillColor] = useState(50);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<
    { width: number; height: number } | undefined
  >(undefined);

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

  // 여백 색상 계산 함수 (0: 어두움 #212224, 100: 밝음 #FAFAFA)
  const getFillColorRGB = (value: number) => {
    const ratio = value / 100;
    const r = Math.round(33 + (250 - 33) * ratio);
    const g = Math.round(34 + (250 - 34) * ratio);
    const b = Math.round(36 + (250 - 36) * ratio);
    return { r, g, b };
  };

  // 이미지 조정 스타일 계산
  const getFilterStyle = (levels: ImageAdjustmentLevels) => {
    const exposureFactor = 1 + (levels.exposure / 50) * 0.5;
    const brightnessFactor = 1 + (levels.brightness / 50) * 0.2;
    const finalBrightness = brightnessFactor * exposureFactor * 100;
    return `brightness(${
      finalBrightness > 100
        ? (finalBrightness - 100) * 2 + 100
        : (finalBrightness - 100) * 1.8 + 100
    }%) contrast(${100 + levels.contrast / 2 + levels.structure / 2}%) sepia(${
      levels.temperature > 0 ? levels.temperature : 0
    }%) hue-rotate(${
      levels.temperature < 0 ? levels.temperature * -0.8 : 0
    }deg) saturate(${100 + levels.saturation * 2}%)`.trim();
  };

  const getRotatedFitZoom = (
    width: number,
    height: number,
    rotation: number,
  ) => {
    if (width === 0 || height === 0) return 1;

    const imageRatio = width / height;
    const targetRatio = 3 / 4;

    // 1. zoom=1일 때의 기준 치수 계산 (Unrotated)
    // react-easy-crop은 이미지가 크롭 영역보다 '넓으면' 높이를 맞추고, '좁으면' 너비를 맞춤 (cover 기준)
    let w_zoom1, h_zoom1;

    if (imageRatio > targetRatio) {
      // 이미지 비율이 타겟보다 큼 (더 넓적함) -> Zoom 1일 때 높이가 맞음
      // 타겟(크롭) 높이를 1.333 (1 / 0.75)으로 정규화했을 때
      h_zoom1 = 1 / targetRatio;
      w_zoom1 = h_zoom1 * imageRatio;
    } else {
      // 이미지 비율이 타겟보다 작음 (더 길쭉함) -> Zoom 1일 때 너비가 맞음
      // 타겟(크롭) 너비를 1로 정규화했을 때
      w_zoom1 = 1;
      h_zoom1 = w_zoom1 / imageRatio;
    }

    // 2. 회전 적용 (크기 스왑)
    const isRotated = rotation % 180 !== 0;
    const w_rotated = isRotated ? h_zoom1 : w_zoom1;
    const h_rotated = isRotated ? w_zoom1 : h_zoom1;

    // 3. 3:4 영역(1 x 1.333) 안에 전체(contain)가 들어가기 위한 줌 계산
    // 가로가 1 안에, 세로가 1.333 안에 들어와야 함
    const zoomW = 1 / w_rotated;
    const zoomH = 1 / targetRatio / h_rotated;

    return Math.min(zoomW, zoomH);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const currentFitZoom = getRotatedFitZoom(
    imageOriginalSize.width,
    imageOriginalSize.height,
    editState.rotation.angle,
  );

  // 이미지 내보내기 핸들러
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

      // 여백 색상 채우기
      const { r, g, b } = getFillColorRGB(fillColor);
      cropCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
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

  // 이미지 편집 적용 핸들러
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
      const { r, g, b } = getFillColorRGB(fillColor);
      cropCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
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

  const handleCropChange = (newCrop: EditState["crop"]) => {
    // 부동소수점 오차 정규화 (threshold: 0.1 픽셀 미만)
    const threshold = 0.1;
    const normalizedCrop = {
      ...newCrop,
      x: Math.abs(newCrop.x) < threshold ? 0 : newCrop.x,
      y: Math.abs(newCrop.y) < threshold ? 0 : newCrop.y,
    };

    // original 모드에서 zoom이 fitZoom에 매우 가까울 때 정규화
    if (cropMode === "original" && Math.abs(newCrop.zoom - fitZoom) < 0.01) {
      setEditState((prev) => ({
        ...prev,
        crop: { ...normalizedCrop, zoom: fitZoom },
      }));
    } else {
      setEditState((prev) => ({
        ...prev,
        crop: normalizedCrop,
      }));
    }
  };

  const handleToolChange = (toolId: string) => {
    if (activeTool === "crop" && toolId !== "crop") {
      handleApplyEdit();
    }

    if (toolId === "rotation") {
      setEditState((prev) => ({
        ...prev,
        crop: { ...prev.crop, zoom: 1, x: 0, y: 0 },
      }));
    }

    setActiveTool(toolId);
  };

  // 원본 버튼 핸들러
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

    setCropMode("fixedratio");
    setFillColor(50);
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
      setImageOriginalSize({ width, height });
      const imageRatio = width / height;
      setIsWideImage(imageRatio > 3 / 4);

      // // fitZoom 계산 (이미지가 3:4 프레임 안에 딱 맞게 들어가는 줌 레벨)
      // // react-easy-crop에서 objectFit="cover"일 때(즉 꽉 채울 때) 기준
      // const TARGET_ASPECT = 3 / 4;
      // let fit = 1;
      // if (imageRatio > TARGET_ASPECT) {
      //   // 이미지가 더 넓음 -> 높이가 맞음, 너비가 잘림
      //   // 전체 너비를 보려면 축소해야 함
      //   fit = TARGET_ASPECT / imageRatio;
      // } else {
      //   // 이미지가 더 높음 -> 너비가 맞음, 높이가 잘림
      //   // 전체 높이를 보려면 축소해야 함
      //   fit = imageRatio / TARGET_ASPECT;
      // }
      const fit = getRotatedFitZoom(width, height, 0);
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

  console.log(editState.crop);
  console.log(fitZoom, currentFitZoom);

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
            backgroundColor: (() => {
              const { r, g, b } = getFillColorRGB(fillColor);
              return `rgb(${r}, ${g}, ${b})`;
            })(),
          }}
        >
          {/* Dummy Image for Layout Sizing */}
          <img
            src={previewUrl!}
            alt=""
            className="pointer-events-none aspect-[3/4] h-auto max-h-full w-auto max-w-full object-contain opacity-0"
            aria-hidden="true"
          />

          <div className="absolute inset-0 h-full w-full" ref={containerRef}>
            <CropperView
              image={previewUrl!}
              crop={editState.crop}
              adjustment={editState.adjustment}
              rotation={editState.rotation.angle}
              cropSize={containerSize}
              flipHorizontal={editState.rotation.flipHorizontal}
              onCropChange={handleCropChange}
              isWideImage={isWideImage}
              readOnly={activeTool !== "crop" && activeTool !== "rotation"}
              cropMode={activeTool === "rotation" ? "original" : cropMode}
              restrictPosition={
                activeTool === "rotation" || cropMode === "fixedratio"
              }
              minZoom={
                activeTool === "rotation"
                  ? 1 // 회전 탭이면 줌 1로 고정 (축소 불가)
                  : cropMode === "original"
                    ? currentFitZoom / 2
                    : 1
              }
              maxZoom={
                activeTool === "rotation"
                  ? 1 // 회전 탭이면 줌 1로 고정 (확대 불가)
                  : cropMode === "original"
                    ? currentFitZoom
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
          onRotationChange={(angle) => {
            setEditState((prev) => ({
              ...prev,
              crop: {
                ...prev.crop,
                zoom: 1,
                x: 0,
                y: 0,
              },
              rotation: { ...prev.rotation, angle },
            }));
          }}
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
