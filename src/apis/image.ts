import type { ImageDetailResponse } from "@/types/image";
import { axiosInstance } from "./axios";
import type { ApiResponse } from "@/types/common";

// 이미지 상세정보 조회
export const getImageDetail = async (
  imageId: number,
): Promise<ApiResponse<ImageDetailResponse>> => {
  const { data } = await axiosInstance.get<ApiResponse<ImageDetailResponse>>(
    `/api/images/${imageId}`,
  );
  return data;
};
