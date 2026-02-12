export interface ImageAdjustmentLevels {
  brightness: number;
  contrast: number;
  structure: number;
  temperature: number;
  saturation: number;
  exposure: number;
}

export interface EditState {
  adjustment: ImageAdjustmentLevels;
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
}
