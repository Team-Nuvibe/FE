// 공통 API 응답 타입
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
  httpStatus: string;
}
