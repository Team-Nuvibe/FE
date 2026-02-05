import type { TribeJoinRequest, TribeJoinResponse } from "@/types/tribeChat";
import { axiosInstance } from "../axios";
import type { ApiResponse } from "@/types/common";

// 트라이브 챗 입장 및 생성
// 기존 트라이브 챗이 존재하면 입장, 없으면 새로운 트라이브 챗 생성
export const joinOrCreateTribe = async (
  body: TribeJoinRequest,
): Promise<ApiResponse<TribeJoinResponse>> => {
  const { data } = await axiosInstance.post<ApiResponse<TribeJoinResponse>>(
    "/api/tribe/join",
    body,
  );
  return data;
};
