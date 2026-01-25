import type { ApiResponse } from "@/types/common";
import { axiosInstance } from "./axios";
import type { TagCategory, CategoryTagResponse } from "@/types/home";

// 카테고리별 태그 조회
export const getTagsByCategory = async (
  category: TagCategory,
): Promise<ApiResponse<CategoryTagResponse[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<CategoryTagResponse[]>>(
    `/api/home/categories/${category}/tags`,
  );
  return data;
};
