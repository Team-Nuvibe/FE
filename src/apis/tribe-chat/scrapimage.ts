import type {
  ScrapImageToggleResponse,
  ScrapedImageListResponse,
} from "@/types/tribeChat";
import { axiosInstance } from "../axios";
import type { ApiResponse } from "@/types/common";

// 이미지 스크랩 토글
// 기존 스크랩 존재 시 삭제, 부재 시 새로운 스크랩 생성
export const toggleImageScrap = async (
  chatId: number,
): Promise<ApiResponse<ScrapImageToggleResponse>> => {
  const { data } = await axiosInstance.post<
    ApiResponse<ScrapImageToggleResponse>
  >(`/api/scrapedImage/chat/${chatId}`);
  return data;
};

// 스크랩 이미지 전체 목록 조회
// 최신순 전체 조회 또는 태그를 필터링해서 조회 (커서 스크랩 기능)
export const getAllScrapedImages = async (
  imageTag?: string,
  cursorCreatedAt?: string,
  cursorId?: number,
  size: number = 24,
): Promise<ApiResponse<ScrapedImageListResponse>> => {
  const params = new URLSearchParams();

  if (imageTag) {
    params.append("imageTag", imageTag);
  }
  if (cursorCreatedAt) {
    params.append("cursorCreatedAt", cursorCreatedAt);
  }
  if (cursorId !== undefined && cursorId !== null) {
    params.append("cursorId", cursorId.toString());
  }
  params.append("size", size.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/api/scrapedImage?${queryString}`
    : `/api/scrapedImage`;

  const { data } =
    await axiosInstance.get<ApiResponse<ScrapedImageListResponse>>(url);
  return data;
};

// 해당 트라이브 챗 내 스크랩 이미지 목록 조회
// 최신순으로 조회 (커서 스크랩 기능)
export const getTribeScrapedImages = async (
  tribeId: number,
  imageTag?: string,
  cursorCreatedAt?: string,
  cursorId?: number,
  size: number = 24,
): Promise<ApiResponse<ScrapedImageListResponse>> => {
  const params = new URLSearchParams();

  if (imageTag) {
    params.append("imageTag", imageTag);
  }
  if (cursorCreatedAt) {
    params.append("cursorCreatedAt", cursorCreatedAt);
  }
  if (cursorId !== undefined && cursorId !== null) {
    params.append("cursorId", cursorId.toString());
  }
  params.append("size", size.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/api/scrapedImage/tribe/${tribeId}?${queryString}`
    : `/api/scrapedImage/tribe/${tribeId}`;

  const { data } =
    await axiosInstance.get<ApiResponse<ScrapedImageListResponse>>(url);
  return data;
};
