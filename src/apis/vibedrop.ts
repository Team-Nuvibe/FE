import type { ApiResponse } from "@/types/common";
import type { ImageResponse } from "@/types/image";
import { axiosInstance } from "./axios";

export const postPresignedUrl = async (
  tag: string,
  originalFileName: string,
): Promise<ApiResponse<ImageResponse>> => {
  const { data } = await axiosInstance.post<ApiResponse<ImageResponse>>(
    "/api/images/presigned-url",
    { originalFileName },
    {
      params: { tag },
    },
  );
  return data;
};
