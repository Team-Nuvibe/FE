import { useEffect, useRef, useState } from "react";
import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import IconAdjustment from "@/assets/icons/icon_quickdrop_adjustment.svg?react";
import IconAdjustmentActive from "@/assets/icons/icon_quickdrop_adjustment_active.svg?react";
import IconRotation from "@/assets/icons/icon_quickdrop_rotation.svg?react";
import IconRotationActive from "@/assets/icons/icon_quickdrop_rotation_active.svg?react";
import IconCut from "@/assets/icons/icon_quickdrop_cut.svg?react";
import IconCutActive from "@/assets/icons/icon_quickdrop_cut_active.svg?react";
import IconBrightness from "@/assets/icons/icon_brightness.svg?react";
import IconBrightnessActive from "@/assets/icons/icon_brightness_active.svg?react";
import IconContrast from "@/assets/icons/icon_contrast.svg?react";
import IconContrastActive from "@/assets/icons/icon_contrast_active.svg?react";
import IconSaturation from "@/assets/icons/icon_saturation.svg?react";
import IconSaturationActive from "@/assets/icons/icon_saturation_active.svg?react";
import IconStructure from "@/assets/icons/icon_structure.svg?react";
import IconStructureActive from "@/assets/icons/icon_structure_active.svg?react";
import IconTemperature from "@/assets/icons/icon_temperature.svg?react";
import IconTemperatureActive from "@/assets/icons/icon_temperature_active.svg?react";
import IconExposure from "@/assets/icons/icon_exposure.svg?react";
import IconExposureActive from "@/assets/icons/icon_exposure_active.svg?react";
import { useNavigate } from "react-router-dom";

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
    }
  ) => void;
}

export const ImageEditor = ({
  file,
  initialState,
  onNext,
}: ImageEditorProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editState, setEditState] = useState({
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
  const [activeAdjustmentTool, setActiveAdjustmentTool] =
    useState("brightness");
  const [adjustmentLevels, setAdjustmentLevels] = useState<{
    brightness: number;
    contrast: number;
    structure: number;
    temperature: number;
    saturation: number;
    exposure: number;
  }>({
    brightness: 0,
    contrast: 0,
    structure: 0,
    temperature: 0,
    saturation: 0,
    exposure: 0,
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();

  const tools = [
    {
      id: "adjustment",
      icon: IconAdjustment,
      activeIcon: IconAdjustmentActive,
    },
    {
      id: "cut",
      icon: IconCut,
      activeIcon: IconCutActive,
    },
    {
      id: "rotation",
      icon: IconRotation,
      activeIcon: IconRotationActive,
    },
  ];

  const adjustmentTools = [
    {
      id: "brightness",
      icon: IconBrightness,
      activeIcon: IconBrightnessActive,
      label: "밝기",
    },
    {
      id: "contrast",
      icon: IconContrast,
      activeIcon: IconContrastActive,
      label: "대비",
    },
    {
      id: "structure",
      icon: IconStructure,
      activeIcon: IconStructureActive,
      label: "구조",
    },
    {
      id: "temperature",
      icon: IconTemperature,
      activeIcon: IconTemperatureActive,
      label: "온도",
    },
    {
      id: "saturation",
      icon: IconSaturation,
      activeIcon: IconSaturationActive,
      label: "채도",
    },

    {
      id: "exposure",
      icon: IconExposure,
      activeIcon: IconExposureActive,
      label: "노출",
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
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const MAX_SIZE = 1280;

    const targetRatio = 3 / 4;
    const imgRatio = imgWidth / imgHeight;

    let sx, sy, sWidth, sHeight;

    if (imgRatio > targetRatio) {
      // 원본이 더 가로로 김
      sWidth = imgHeight * targetRatio;
      sHeight = imgHeight;
      sx = (imgWidth - sWidth) / 2;
      sy = 0;
    } else {
      // 원본이 더 세로로 김
      sWidth = imgWidth;
      sHeight = imgWidth / targetRatio;
      sx = 0;
      sy = (imgHeight - sHeight) / 2;
    }

    // 크기 최적화
    // 출력 캔버스 크기 계산 (리사이징 적용)
    let dWidth = sWidth;
    let dHeight = sHeight;

    if (dWidth > MAX_SIZE || dHeight > MAX_SIZE) {
      if (dWidth > dHeight) {
        // 가로가 긴 경우 (비율상 여기에 걸릴 일은 적지만 안전장치)
        dHeight = (dHeight * MAX_SIZE) / dWidth;
        dWidth = MAX_SIZE;
      } else {
        // 세로가 긴 경우 (3:4 비율이므로 주로 여기에 해당)
        dWidth = (dWidth * MAX_SIZE) / dHeight;
        dHeight = MAX_SIZE;
      }
    }

    canvas.width = dWidth;
    canvas.height = dHeight;

    if (ctx) {
      ctx.filter = getFilterStyle(adjustmentLevels);
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);
      const exportType = file.type === "image/heic" ? "image/jpeg" : file.type;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onNext(blob, adjustmentLevels);
          } else {
            console.error("이미지 내보내기 실패");
          }
        },
        exportType,
        0.9
      );
    }
  };

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  useEffect(() => {
    setAdjustmentLevels(initialState);
  }, [initialState]);

  return (
    <div className="flex flex-col h-dvh">
      {/* 헤더 & 툴바 */}
      <div className="flex-none">
        <header className="flex justify-between items-center pt-2 pb-6 px-4 tracking-tight">
          <IconXbuttonGray3
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="H2 text-white">바이브 드랍</h2>
          <p
            className="ST2 text-white cursor-pointer"
            onClick={() => handleExportImage()}
          >
            다음
          </p>
        </header>
        <div className="flex justify-center gap-2 pb-5">
          {tools.map((tool) => (
            <button key={tool.id} onClick={() => setActiveTool(tool.id)}>
              {activeTool === tool.id ? <tool.activeIcon /> : <tool.icon />}
            </button>
          ))}
        </div>
      </div>
      {/* 이미지 */}
      <div className="flex-1 min-h-0 flex justify-center items-center px-4 pb-[53px]">
        {activeTool === "adjustment" && (
          <img
            src={previewUrl!}
            ref={imageRef}
            alt="Preview"
            className="max-w-full max-h-full aspect-[3/4] object-cover object-center"
            style={{ filter: getFilterStyle(adjustmentLevels) }}
          />
        )}
      </div>
      {/* 세부 조정 툴바 */}
      <div className="flex flex-col z-10 pb-11">
        <div className="relative h-[15px] flex justify-center items-center">
          <input
            type="range"
            min={-50}
            max={50}
            value={
              adjustmentLevels[
                activeAdjustmentTool as keyof typeof adjustmentLevels
              ]
            }
            onChange={(e) =>
              setAdjustmentLevels({
                ...adjustmentLevels,
                [activeAdjustmentTool]: Number(e.target.value),
              })
            }
            className="w-[345px] h-[1px] appearance-none bg-gray-700 rounded-[10px] accent-white cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-100
          [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-[15px] [&::-moz-range-thumb]:w-[15px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-100 cursor-pointer z-10"
          />
          <div className="absolute top-[4.5px] w-[6px] h-[6px] bg-gray-700 rounded-full" />
        </div>
        <div className="flex gap-5 pt-[21px] overflow-x-auto scrollbar-hide">
          {adjustmentTools.map((tool) => (
            <div
              className={`flex flex-col gap-[10px] items-center ST2 ${
                tool.id === "brightness" && `pl-6`
              } ${tool.id === "exposure" && `pr-6`}`}
            >
              <p className="text-[12px]">{tool.label}</p>
              <button
                key={tool.id}
                onClick={() => setActiveAdjustmentTool(tool.id)}
              >
                {activeAdjustmentTool === tool.id ? (
                  <tool.activeIcon />
                ) : (
                  <tool.icon />
                )}
              </button>
              <div
                className={`w-[8px] h-[8px] rounded-full ${
                  adjustmentLevels[tool.id as keyof typeof adjustmentLevels] ===
                  0
                    ? `opacity-0`
                    : `bg-white`
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
