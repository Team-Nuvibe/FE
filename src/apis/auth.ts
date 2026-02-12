import type {
  LogInRequest,
  LogInResponse,
  SignUpRequest,
  PasswordResetRequest,
  SocialSignUpCompleteRequest,
} from "@/types/auth";
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

// 회원가입 인증 코드 발송
export const sendVerificationEmail = async (
  email: string,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/verify-code/send",
    { email },
  );
  return data;
};

// 회원가입 인증 코드 검증
export const confirmVerificationCode = async (
  email: string,
  code: string,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/verify-code/confirm",
    {
      email,
      code,
    },
  );
  return data;
};

// 비밀번호 확인
export const checkPassword = async (
  password: string,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/check-password",
    { password },
  );
  return data;
};

// ------- 비밀번호 재설정 로직 -------

// 비밀번호 초기화
export const resetPassword = async (
  body: PasswordResetRequest,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/password-reset",
    body,
  );
  return data;
};

// 비밀번호 초기화용 인증 코드 발송
export const sendResetPasswordVerificationCode = async (
  email: string,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/password-reset/send-code",
    { email },
  );
  return data;
};

// 비밀번호 초기화용 인증 코드 검증
export const confirmResetPasswordVerificationCode = async (
  email: string,
  code: string,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/password-reset/verify-code",
    {
      email,
      code,
    },
  );
  return data;
};

// 소셜 로그인 시작 (OAuth2 인증 페이지로 리다이렉트)
export const startSocialLogin = (
  provider: "google" | "naver" | "kakao",
): void => {
  const baseUrl =
    import.meta.env.VITE_SERVER_API_URL || "https://api.nuvibe.site";
  const currentOrigin = window.location.origin;
  const redirectUri = currentOrigin; // 백엔드에서 /oauth/callback을 붙여주는 것으로 추정됨
  const targetUrl = `${baseUrl}api/auth/oauth2/${provider}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  window.location.href = targetUrl;
};

// 소셜 로그인 콜백 (OAuth2 인증 코드를 받아서 토큰 발급)
export const socialLoginCallback = async (
  provider: "google" | "naver" | "kakao",
  code: string,
  state?: string,
): Promise<ApiResponse<LogInResponse>> => {
  const params = new URLSearchParams({ code });
  if (state) {
    params.append("state", state);
  }

  const { data } = await axiosInstance.get<ApiResponse<LogInResponse>>(
    `/api/auth/oauth2/callback/${provider}?${params.toString()}`,
  );
  return data;
};

// 소셜 회원 가입 완료 (신규 소셜 유저 추가 정보 입력)
export const completeSocialSignUp = async (
  body: SocialSignUpCompleteRequest,
): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.post<ApiResponse<string>>(
    "/api/auth/oauth2/signup/complete",
    body,
  );
  return data;
};
