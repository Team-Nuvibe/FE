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

// 아카이브 메인 상단에 표시할 전체 이미지 아이템 타입
export interface ArchiveImageItem {
  imageId: number;
  imageUrl: string;
  tag: string;
  uploadedAt: string;
}

// 아카이브 메인 상단에 표시할 전체 이미지 목록 응답 타입
export interface ArchiveImagesResponse {
  content: ArchiveImageItem[];
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

// ----- 바이브톤 리캡 -----

// 태그 순위 아이템 타입
export interface TagRankItem {
  rank: number;
  tag: string;
}

// 사용 태그 순위 조회 응답 타입
export interface TagUsageRankingResponse {
  period: string;
  startDate: string;
  endDate: string;
  totalDropCount: number;
  rank: TagRankItem[];
  timestamp: string;
}

// 캘린더 이미지 아이템 타입
export interface CalendarImageItem {
  imageId: number;
  tag: string;
  imageUrl: string;
}

// 날짜 별 업로드한 이미지 조회 응답 타입
export interface CalendarImagesResponse {
  listOfWithImages: CalendarImageItem[];
  todayImages: CalendarImageItem[];
}

// 월별 업로드 날짜 조회 응답 타입 (날짜 문자열 배열)
export type MonthlyUploadDatesResponse = string[];

// 가장 많이 사용한 보드 조회 응답 타입
export interface MostUsedBoardResponse {
  period: string;
  startDate: string;
  endDate: string;
  totalDropCount: number;
  boardId: number;
  boardName: string;
  boardImages: string[];
}

// 사용자 이용 패턴 조회 응답 타입
export interface UserUsagePatternResponse {
  period: string;
  startDate: string;
  endDate: string;
  dayOfWeek: string;
  preferredMealtimes: string;
  totalBoardCount: number;
  totalTagCount: number;
  mostUsedTag: string;
  weeklyDropCount: number;
}
// ------------------------------------------------
