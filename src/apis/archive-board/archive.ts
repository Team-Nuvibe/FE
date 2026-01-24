import type {
  ArchiveBoardDetail,
  ArchiveBoardItem,
  ArchiveImagesResponse,
  CreatedArchiveBoard,
  VibeToneTagsResponse,
} from "@/types/archive";
import { axiosInstance } from "../axios";
import type { ApiResponse } from "@/types/common";

// 아카이브 목록 조회
export const getArchiveList = async (
  keyword?: string,
): Promise<ApiResponse<ArchiveBoardItem[]>> => {
  const { data } = await axiosInstance.get<ApiResponse<ArchiveBoardItem[]>>(
    "/api/archive",
    {
      params: {
        keyword,
      },
    },
  );
  return data;
};

// 아카이브 보드 생성
export const createArchiveBoard = async (
  name: string,
): Promise<ApiResponse<CreatedArchiveBoard>> => {
  const { data } = await axiosInstance.post<ApiResponse<CreatedArchiveBoard>>(
    "/api/archive",
    { name },
  );
  return data;
};

// 아카이브 보드 삭제
export const deleteArchiveBoard = async (
  boardIds: number[],
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post<ApiResponse<null>>(
    "/api/archive/delete",
    { boardIds },
  );
  return data;
};

// 아카이브 메인 상단에 표시할 전체 이미지 조회
export const getArchiveImages = async (
  page: number = 0,
  size: number = 20,
): Promise<ApiResponse<ArchiveImagesResponse>> => {
  const { data } = await axiosInstance.get<ApiResponse<ArchiveImagesResponse>>(
    "/api/archive/images",
    {
      params: {
        page,
        size,
      },
    },
  );
  return data;
};

// 바이브톤 태그 조회
export const getVibeToneTags = async (): Promise<
  ApiResponse<VibeToneTagsResponse>
> => {
  const { data } =
    await axiosInstance.get<ApiResponse<VibeToneTagsResponse>>(
      "/api/archive/vibe",
    );
  return data;
};

// ------- ArchiveDetailPage에서 필요 ----------
// 아카이브 보드에 이미지 추가
export const addImageToArchiveBoard = async (
  boardId: number,
  imageIds: number,
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.post<ApiResponse<null>>(
    `/api/archive/${boardId}/images`,
    { imageIds },
  );
  return data;
};

// 아카이브 보드 내 이미지 삭제
export const deleteArchiveBoardImages = async (
  boardId: number,
  boardImageIds: number[],
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ApiResponse<null>>(
    `/api/archive/${boardId}/delete`,
    {
      data: { boardImageIds },
    },
  );
  return data;
};

// 아카이브 보드명 수정
export const updateArchiveBoardName = async (
  boardId: number,
  name: string,
): Promise<ApiResponse<null>> => {
  const { data } = await axiosInstance.patch<ApiResponse<null>>(
    `/api/archive/${boardId}/name`,
    { name },
  );
  return data;
};

// 아카이브 상세 조회
export const getArchiveBoardDetail = async (
  boardId: number,
  tag?: string,
): Promise<ApiResponse<ArchiveBoardDetail>> => {
  const { data } = await axiosInstance.get<ApiResponse<ArchiveBoardDetail>>(
    `/api/archive/${boardId}`,
    {
      params: {
        tag,
      },
    },
  );
  return data;
};
