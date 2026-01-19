// 아카이브 보드 아이템 타입
export interface ArchiveBoardItem {
  boardId: number;
  name: string;
  thumbnailUrl: string;
}

// 생성된 아카이브 보드 타입
export interface CreatedArchiveBoard {
  boardId: number;
  name: string;
}

// 아카이브 보드 이미지 타입
export interface ArchiveBoardImage {
  boardImageId: number;
  imageId: number;
  imageUrl: string;
  imageTag: string;
}

// 아카이브 보드 상세 타입
export interface ArchiveBoardDetail {
  boardId: number;
  name: string;
  images: ArchiveBoardImage[];
}

// Recap 이미지 아이템 타입
export interface RecapImageItem {
  imageId: number;
  imageUrl: string;
  tag: string;
  uploadedAt: string;
}

// Recap 이미지 목록 응답 타입
export interface RecapImagesResponse {
  content: RecapImageItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  numberOfElements: number;
}

// 바이브톤 태그 조회 응답 타입
export interface VibeToneTagsResponse {
  nickname: string;
  topTags: string[];
}
