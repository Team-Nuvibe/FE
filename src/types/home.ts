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
