import type {
  ChatDetailResponse,
  ChatGridResponse,
  ChatTimelineResponse,
  EmojiType,
  ImageStatusResponse,
} from "@/types/tribeChat";
import { axiosInstance } from "../axios";
import type { ApiResponse } from "@/types/common";

// 채팅 발신 (이미지 업로드 및 선택 보드에 저장 후 채팅 발신)
export const sendChatMessage = async (
  tribeId: number,
  boardId: number,
  imageId: number,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    `/api/chat/tribe/${tribeId}/send?imageId=${imageId}&boardId=${boardId}`,
  );
  return data;
};

// 채팅 이미지 상세 조회 (그리드 목록에서 이미지 상세 조회)
export const getChatDetail = async (
  chatId: number,
): Promise<ApiResponse<ChatDetailResponse>> => {
  const { data } = await axiosInstance.get<ApiResponse<ChatDetailResponse>>(
    `/api/chat/${chatId}/detail`,
  );
  return data;
};

// 트라이브 챗 내 채팅 타임라인 목록 조회
// 트라이브 챗의 타임라인을 가져 기반으로 조회 (최신순)
// lastChatId: 이전 페이지의 마지막 chatId (null이면 첫 페이지)
// size: 조회할 페이지 수 (기본 20, 최대 40)
export const getChatTimeline = async (
  tribeId: number,
  lastChatId?: number,
  size: number = 20,
): Promise<ApiResponse<ChatTimelineResponse>> => {
  const params = new URLSearchParams();

  if (lastChatId !== undefined && lastChatId !== null) {
    params.append("lastChatId", lastChatId.toString());
  }
  params.append("size", size.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/api/chat/tribe/${tribeId}/timeline?${queryString}`
    : `/api/chat/tribe/${tribeId}/timeline`;

  const { data } =
    await axiosInstance.get<ApiResponse<ChatTimelineResponse>>(url);
  return data;
};

// 트라이브 챗 내 채팅 이미지 그리드 목록 조회
// 채팅 이미지 목록을 커서 기반으로 조회 (최신순)
// cursorCreatedAt: 마지막 데이터의 생성 시각 (커서)
// cursorChatId: 마지막 데이터의 ID (보조 커서)
// size: 조회 개수 (기본 24, 최대 30)
export const getChatGrid = async (
  tribeId: number,
  cursorCreatedAt?: string,
  cursorChatId?: number,
  size: number = 24,
): Promise<ApiResponse<ChatGridResponse>> => {
  const params = new URLSearchParams();

  if (cursorCreatedAt) {
    params.append("cursorCreatedAt", cursorCreatedAt);
  }
  if (cursorChatId !== undefined && cursorChatId !== null) {
    params.append("cursorChatId", cursorChatId.toString());
  }
  params.append("size", size.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/api/chat/tribe/${tribeId}/grid?${queryString}`
    : `/api/chat/tribe/${tribeId}/grid`;

  const { data } = await axiosInstance.get<ApiResponse<ChatGridResponse>>(url);
  return data;
};

// 채팅 이모지 반응
export const reactToChatEmoji = async (
  chatId: number,
  type: EmojiType,
): Promise<ApiResponse<Record<string, never>>> => {
  try {
    const url = `/api/emoji/chat/${chatId}`;
    console.log(`📤 Emoji Reaction Request: POST ${url} with body:`, { type });
    const { data } = await axiosInstance.post<ApiResponse<Record<string, never>>>(
      url,
      null, // POST 요청이므로 Body는 비워둡니다 (null)
      { params: { type } } // ?type=VALUE 형식으로 전달됨
    );
    console.log("Emoji Reaction Success:", data);
    return data;
  } catch (error) {
    console.error("Emoji Reaction Error Detail:", error);
    throw error;
  }
};

// 이미지 상태 조회
export const checkImageStatus = async (
  imageId: number,
): Promise<ApiResponse<ImageStatusResponse>> => {
  const { data } = await axiosInstance.get<ApiResponse<ImageStatusResponse>>(
    `/api/images/${imageId}/status`,
  );
  return data;
};
