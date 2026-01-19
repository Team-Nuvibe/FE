// 회원가입
import { axiosInstance } from "./axios";
import type { ArchiveApiResponse } from "@/types/archive";

// 회원가입 요청 타입
export interface SignUpRequest {
  name: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 회원가입
export const signUp = async (
  data: SignUpRequest,
): Promise<ArchiveApiResponse<string>> => {
  const response = await axiosInstance.post<ArchiveApiResponse<string>>(
    "/api/auth/sign-up",
    data,
  );
  return response.data;
};
