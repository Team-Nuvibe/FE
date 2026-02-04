import type {
  UserTribeFavoriteResponse,
  UserTribeActivateResponse,
  TribeReadResponse,
  WaitingTribeListResponse,
  ActiveTribeListResponse,
  LeaveTribeResponse,
} from "@/types/tribeChat";
import { axiosInstance } from "../axios";
import type { ApiResponse } from "@/types/common";

// 트라이브 챗 즐겨찾기
// 원하는 트라이브 챗을 즐겨찾기로 등록
export const toggleTribeFavorite = async (
  userTribeId: number,
): Promise<ApiResponse<UserTribeFavoriteResponse>> => {
  const { data } = await axiosInstance.patch<
    ApiResponse<UserTribeFavoriteResponse>
  >(`/api/userTribe/${userTribeId}/favorite`);
  return data;
};

// 유저 트라이브 챗 활성화
// 인원 수가 5명 이상인 트라이브 챗에 대해 유저 프로 활성화
export const activateUserTribe = async (
  userTribeId: number,
): Promise<ApiResponse<UserTribeActivateResponse>> => {
  const { data } = await axiosInstance.patch<
    ApiResponse<UserTribeActivateResponse>
  >(`/api/userTribe/${userTribeId}/activate`, {});
  return data;
};

// 트라이브 챗 읽음 처리
// 안 읽은 메시지 수를 0개로 초기화
export const markTribeAsRead = async (
  tribeId: number,
): Promise<ApiResponse<TribeReadResponse>> => {
  const { data } = await axiosInstance.patch<ApiResponse<TribeReadResponse>>(
    `/api/userTribe/tribe/${tribeId}/read`,
  );
  return data;
};

// 대기 중인 트라이브 목록 조회
// 대기 중 트라이브 챗 목록을 tribeId 순으로 정렬
export const getWaitingTribeList = async (
  cursorTribeId?: number,
  size: number = 20,
): Promise<ApiResponse<WaitingTribeListResponse>> => {
  const params = new URLSearchParams();

  if (cursorTribeId !== undefined && cursorTribeId !== null) {
    params.append("cursorTribeId", cursorTribeId.toString());
  }
  params.append("size", size.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/api/userTribe/waiting?${queryString}`
    : `/api/userTribe/waiting`;

  const { data } =
    await axiosInstance.get<ApiResponse<WaitingTribeListResponse>>(url);
  return data;
};

// 활성화된 트라이브 목록 조회
// 트라이브 챗 목록을 고정, 마지막 활동 시각, 읽음 시각, 마지막 chatId 순으로 정렬
export const getActiveTribeList = async (
  cursorFav?: boolean,
  cursorLastActivityAt?: string,
  cursorUnread?: boolean,
  cursorLastChatId?: number,
  size: number = 20,
): Promise<ApiResponse<ActiveTribeListResponse>> => {
  const params = new URLSearchParams();

  if (cursorFav !== undefined && cursorFav !== null) {
    params.append("cursor.fav", cursorFav.toString());
  }
  if (cursorLastActivityAt) {
    params.append("cursor.lastActivityAt", cursorLastActivityAt);
  }
  if (cursorUnread !== undefined && cursorUnread !== null) {
    params.append("cursor.unread", cursorUnread.toString());
  }
  if (cursorLastChatId !== undefined && cursorLastChatId !== null) {
    params.append("cursor.lastChatId", cursorLastChatId.toString());
  }
  params.append("size", size.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/api/userTribe/active?${queryString}`
    : `/api/userTribe/active`;

  const { data } =
    await axiosInstance.get<ApiResponse<ActiveTribeListResponse>>(url);
  return data;
};

// 챗 퇴장
// 활성화된 트라이브 챗 퇴장
export const leaveTribe = async (
  userTribeId: number,
): Promise<ApiResponse<LeaveTribeResponse>> => {
  const { data } = await axiosInstance.delete<ApiResponse<LeaveTribeResponse>>(
    `/api/userTribe/${userTribeId}`,
  );
  return data;
};
