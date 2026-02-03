import type { ApiResponse } from "@/types/common";
import { axiosInstance } from "./axios";

export const getFindTags = async (
  category: string,
): Promise<ApiResponse<string[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<string[]>>(
    `/api/tags/find`,
    {
      params: { category },
    },
  );
  return data;
};
