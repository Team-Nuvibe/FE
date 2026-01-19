// 회원가입 요청 타입
export interface SignUpRequest {
  name: string;
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 로그인 요청 타입
export interface LogInRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LogInResponse {
  accessToken: string;
  refreshToken: string;
}
