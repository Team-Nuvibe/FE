import type { LogInRequest, LogInResponse, SignUpRequest } from "@/types/auth";
import { axiosInstance } from "./axios";
import type { ApiResponse } from "@/types/common";

// 회원가입
export const signUp = async (
  body: SignUpRequest,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/sign-up",
    body,
  );
  return data;
};

// 로그인
export const logIn = async (
  body: LogInRequest,
): Promise<ApiResponse<LogInResponse>> => {
  const { data } = await axiosInstance.post<ApiResponse<LogInResponse>>(
    "/api/auth/login",
    body,
  );
  return data;
};

// 로그아웃
export const logOut = async (): Promise<ApiResponse<string>> => {
  const { data } =
    await axiosInstance.post<ApiResponse<string>>("/api/auth/logout");
  return data;
};

// 회원탈퇴
export const deleteUser = async (): Promise<ApiResponse<string>> => {
  const { data } =
    await axiosInstance.delete<ApiResponse<string>>("/api/auth/withdraw");
  return data;
};

// 이메일 인증 발송 (feat/apis-auth에서 추가)
export const sendVerificationEmail = async (
  email: string,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/verify-email",
    { email },
  );
  return data;
};

// 비밀번호 확인 (feat/apis-auth에서 추가)
export const checkPassword = async (
  password: string,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/check-password",
    { password },
  );
  return data;
};

// 이메일 인증 완료 (feat/apis-auth에서 추가)
export const verifyEmail = async (
  token: string,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.get<ApiResponse<string>>(
    "/api/auth/verify",
    {
      params: { token },
    },
  );
  return data;
};
