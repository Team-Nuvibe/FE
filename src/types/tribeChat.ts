export interface ChatRoom {
  id: string;
  title: string;
  memberCount: number;
  lastMessageTime?: string;
  unreadCount?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  thumbnailUrl?: string;
  tags?: string[];
}

// 트라이브 챗 입장 및 생성 요청
export interface TribeJoinRequest {
  imageTag: string;
}

// 트라이브 챗 입장 및 생성 응답
export interface TribeJoinResponse {
  tribeId: number;
  userTribeId: number;
  imageTag: string;
  version: number;
  tribeStatus: string;
  counts: number;
  joinedAt: string;
}

// 채팅 이미지 상세 조회 응답
export interface ChatDetailResponse {
  chatId: number;
  imageId: number;
  imageUrl: string;
  imageTag: string;
  createdAt: string;
  isScrapped: boolean;
}

// 채팅 타임라인 아이템
export interface ChatTimelineItem {
  chatId: number;
  imageId: number;
  imageUrl: string;
  createdAt: string;
  sender: {
    userId: number;
    nickname: string;
    profileImage: string;
  };
  reactionsSummary: Array<{
    type: string;
    count: number;
  }>;
  myReactionType: string | null;
  isScrapped: boolean; // 스크랩 여부
}

// 채팅 타임라인 목록 조회 응답
export interface ChatTimelineResponse {
  items: ChatTimelineItem[];
  nextLastChatId: number;
  hasNext: boolean;
}

// 채팅 이미지 그리드 아이템
export interface ChatGridItem {
  chatId: number;
  imageId: number;
  imageUrl: string;
  createdAt: string;
}

// 채팅 이미지 그리드 목록 조회 응답
export interface ChatGridResponse {
  items: ChatGridItem[];
  nextCursorCreatedAt: string;
  nextCursorChatId: number;
  hasNext: boolean;
}

// 이모지 타입
export type EmojiType = "LIKE" | "COOL" | "WOW";

// 트라이브 챗 즐겨찾기 응답
export interface UserTribeFavoriteResponse {
  userTribeId: number;
  tribeId: number;
  imageTag: string;
  isFavorite: boolean;
  tribeStatus: string;
}

// 유저 트라이브 챗 활성화 응답
export interface UserTribeActivateResponse {
  userTribeId: number;
  tribeId: number;
  imageTag: string;
  isFavorite: boolean;
  tribeStatus: string;
  receivedStatus: string;
  receivedAt: string;
}

// 트라이브 챗 읽음 처리 응답
export interface TribeReadResponse {
  tribeId: number;
  unreadChatId: number;
}

// 대기 중인 트라이브 아이템
export interface WaitingTribeItem {
  tribeId: number;
  userTribeId: number;
  imageTag: string;
  counts: number;
}

// 대기 중인 트라이브 목록 조회 응답
export interface WaitingTribeListResponse {
  items: WaitingTribeItem[];
  hasNext: boolean;
  nextCursor: number;
}

// 활성화된 트라이브 아이템
export interface ActiveTribeItem {
  tribeId: number;
  userTribeId: number;
  imageTag: string;
  counts: number;
  isFavorite: boolean;
  lastActivityAt: string;
  unreadCount: number;
}

// 활성화된 트라이브 목록 조회 응답
export interface ActiveTribeListResponse {
  items: ActiveTribeItem[];
  hasNext: boolean;
  nextCursor: {
    fav: boolean;
    lastActivityAt: string;
    unread: boolean;
    lastChatId: number;
    complete: boolean;
  };
}

// 챗 퇴장 응답
export interface LeaveTribeResponse {
  userTribeId: number;
  tribeId: number;
}

// 이미지 스크랩 토글 응답
export interface ScrapImageToggleResponse {
  scrapedImageId: number;
}

// 스크랩 이미지 아이템
export interface ScrapedImageItem {
  scrapedImageId: number;
  imageId: number;
  imageUrl: string;
  imageTag: string;
  createdAt: string;
}

// 스크랩 이미지 목록 조회 응답
export interface ScrapedImageListResponse {
  items: ScrapedImageItem[];
  nextCursorCreatedAt: string;
  nextCursorId: number;
  hasNext: boolean;
}

// 이미지 상태 조회 응답
export interface ImageStatusResponse {
  imageId: number;
  status: string;
}
