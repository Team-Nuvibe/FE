export type TagCategory =
  | "MOOD"
  | "LIGHT"
  | "COLOR"
  | "TEXTURE"
  | "SPACE"
  | "DAILY"
  | "FASHION"
  | "MEDIA"
  | "TRAVEL";

// 카테고리별 태그 응답
export interface CategoryTagResponse {
  tag: string;
  imageUrl: string | null;
}

export interface TagDetailResponse {
  tag: string;
  description: string;
  category: TagCategory;
  tribeImageUrls: string[];
  hasImages: boolean;
  tribeId: number;
}

export interface DropMissionResponse {
  tag: string;
  imageId: number;
  imageUrl: string;
}
