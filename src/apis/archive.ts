import type {
  ArchiveApiResponse,
  ArchiveBoardDetail,
  ArchiveBoardItem,
  CreatedArchiveBoard,
  RecapImagesResponse,
  VibeToneTagsResponse,
} from "@/types/archive";
import { axiosInstance } from "./axios";

// 아카이브 목록 조회
export const getArchiveList = async (
  keyword?: string,
): Promise<ArchiveApiResponse<ArchiveBoardItem[]>> => {
  const { data } = await axiosInstance.get<
    ArchiveApiResponse<ArchiveBoardItem[]>
  >("/api/archive", {
    params: {
      keyword,
    },
  });
  return data;
};

// 아카이브 보드 생성
export const createArchiveBoard = async (
  name: string,
): Promise<ArchiveApiResponse<CreatedArchiveBoard>> => {
  const { data } = await axiosInstance.post<
    ArchiveApiResponse<CreatedArchiveBoard>
  >("/api/archive", { name });
  return data;
};

// 아카이브 보드 삭제
export const deleteArchiveBoard = async (
  boardIds: number[],
): Promise<ArchiveApiResponse<null>> => {
  const { data } = await axiosInstance.post<ArchiveApiResponse<null>>(
    "/api/archive/delete",
    { boardIds },
  );
  return data;
};

// 아카이브 보드에 이미지 추가
export const addImageToArchiveBoard = async (
  boardId: number,
  imageIds: number,
): Promise<ArchiveApiResponse<null>> => {
  const { data } = await axiosInstance.post<ArchiveApiResponse<null>>(
    `/api/archive/${boardId}/images`,
    { imageIds },
  );
  return data;
};

// 아카이브 보드 내 이미지 삭제
export const deleteArchiveBoardImages = async (
  boardId: number,
  boardImageIds: number[],
): Promise<ArchiveApiResponse<null>> => {
  const { data } = await axiosInstance.delete<ArchiveApiResponse<null>>(
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
): Promise<ArchiveApiResponse<null>> => {
  const { data } = await axiosInstance.patch<ArchiveApiResponse<null>>(
    `/api/archive/${boardId}/name`,
    { name },
  );
  return data;
};

// 아카이브 상세 조회
export const getArchiveBoardDetail = async (
  boardId: number,
  tag?: string,
): Promise<ArchiveApiResponse<ArchiveBoardDetail>> => {
  const { data } = await axiosInstance.get<
    ArchiveApiResponse<ArchiveBoardDetail>
  >(`/api/archive/${boardId}`, {
    params: {
      tag,
    },
  });
  return data;
};

// 아카이브 메인 상단 Recap 조회
export const getArchiveRecapImages = async (
  page: number = 0,
  size: number = 20,
): Promise<ArchiveApiResponse<RecapImagesResponse>> => {
  const { data } = await axiosInstance.get<
    ArchiveApiResponse<RecapImagesResponse>
  >("/api/archive/images", {
    params: {
      page,
      size,
    },
  });
  return data;
};

// 바이브톤 태그 조회
export const getVibeToneTags = async (): Promise<
  ArchiveApiResponse<VibeToneTagsResponse>
> => {
  const { data } =
    await axiosInstance.get<ArchiveApiResponse<VibeToneTagsResponse>>(
      "/api/archive/vibe",
    );
  return data;
};
