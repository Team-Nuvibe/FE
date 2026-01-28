import { LOCAL_STORAGE_KEY } from "@/constants/key";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import axios, { type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? "" : "http://43.200.96.34",
  withCredentials: false, //쿠키
});

// "요청 인터셉터(Request Interceptor)"
// axios가 HTTP 요청을 보내기 직전에 자동으로 '인증 토큰'을 헤더에 추가
// 단, 로그인/회원가입 같은 공개 엔드포인트는 제외
axiosInstance.interceptors.request.use(
  (config) => {
    // 인증이 필요 없는 공개 엔드포인트 목록
    const publicEndpoints = ["/api/auth/login", "/api/auth/sign-up"];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint),
    );

    // 공개 엔드포인트가 아닌 경우에만 토큰 추가
    if (!isPublicEndpoint) {
      const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
      const accessToken = getItem();
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    // 수정된 요청 설정을 반환
    return config;
  },
  // 요청 인터셉터가 실패하면 에러 보냄
  (error) => Promise.reject(error),
);

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 전역 변수로 refresh 요청의 Promise를 저장
let refreshPromise: Promise<string> | null = null;

// 토큰 만료 여부를 확인하는 헬퍼 함수
const isTokenExpiredError = (error: unknown): boolean => {
  // Type guard: error가 response 속성을 가진 객체인지 확인
  if (
    !error ||
    typeof error !== "object" ||
    !("response" in error) ||
    !error.response
  ) {
    return false;
  }

  const response = error.response as {
    status?: number;
    data?: { message?: string };
  };

  const status = response.status;
  const message = response.data?.message || "";

  // 401 에러는 항상 토큰 만료로 간주
  if (status === 401) return true;

  // 400 에러 중 "만료된 jwt 토큰입니다." 메시지가 있는 경우
  if (status === 400 && message.includes("만료된 jwt 토큰")) {
    return true;
  }

  return false;
};

// 응답 인터셉터 : 401/400 에러 발생 -> refresh 토큰을 통한 토큰 갱신 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답 그대로 반환
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    console.log("🔴 [Response Interceptor] Error occurred:", {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
      isRetried: originalRequest?._retry,
    });

    // 토큰 만료 에러이고 아직 재시도하지 않은 요청인 경우 처리
    if (
      error.response &&
      isTokenExpiredError(error) &&
      !originalRequest._retry
    ) {
      console.log("🟡 [Token Expired] Attempting token refresh...");

      //refresh 엔드포인트에서 401 에러가 발생한 경우(UnAuthorized)
      // 중복 재시도 방지를 위해 로그아웃 처리.
      if (originalRequest.url === "/api/auth/reissue") {
        console.log(
          "🔴 [Refresh Failed] Refresh endpoint itself returned 401. Logging out...",
        );
        // 토큰 모두 삭제
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken,
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken,
        );
        removeAccessToken();
        removeRefreshToken();

        window.location.href = "/login";
        return Promise.reject(error);
      }

      // 재시도 플래그 설정
      originalRequest._retry = true;

      // 이미 리프레시 요청이 진행중이면 Promise를 재사용
      if (!refreshPromise) {
        console.log("🟢 [Token Refresh] Starting new refresh request...");
        // refresh 요청 실행 후 프로미스를 전역 변수에 할당
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );

          const refreshToken = getRefreshToken();
          console.log(
            "🔵 [Token Refresh] Refresh token exists:",
            !!refreshToken,
          );

          const { data } = await axiosInstance.post(
            "/api/auth/reissue",
            {}, // body는 비움
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`, // Header에 refreshToken 전송
              },
            },
          );

          console.log("✅ [Token Refresh] Successfully received new tokens");

          // 데이터 안에 새 토큰이 반환
          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken,
          );

          const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );

          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          //새 accessToken을 반환하여 다른 요청들이 이것을 사용할 수 있게함
          return data.data.accessToken;
        })()
          .catch((refreshError) => {
            console.error("🔴 [Token Refresh] Failed to refresh token:", {
              status: refreshError.response?.status,
              message: refreshError.response?.data?.message,
              error: refreshError,
            });
            // 토큰 삭제
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken,
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );

            removeAccessToken();
            removeRefreshToken();

            console.log("🔴 [Token Refresh] Redirecting to /login...");
            // 로그인 페이지로 리다이렉트
            window.location.href = "/login";

            // 에러를 재throw하여 요청이 실패했음을 명확히 함
            throw refreshError;
          })
          .finally(() => {
            console.log("🟣 [Token Refresh] Refresh promise cleared");
            refreshPromise = null;
          });
      } else {
        console.log("🟠 [Token Refresh] Reusing existing refresh promise...");
      }

      // 진행중인 refreshPromise(비동기)가 해결될 때까지 기다림
      return refreshPromise
        .then((newAccessToken) => {
          console.log(
            "✅ [Token Refresh] Successfully refreshed. Retrying original request:",
            originalRequest.url,
          );
          // 원본 요청에 Authorization 헤더를 갱신된 토큰으로 업뎃
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // 업데이트 된 원본 요청을 재시도
          return axiosInstance.request(originalRequest);
        })
        .catch((refreshError) => {
          console.log(
            "🔴 [Token Refresh] Refresh failed, cannot retry original request",
          );
          // 에러를 그대로 전파 (이미 위에서 /login 리다이렉트 처리됨)
          return Promise.reject(refreshError);
        });
    }
    // 401/400 에러가 아닌 경우에 그대로 오류를 반환
    console.log(
      "⚪ [Response Interceptor] Not a token expired error, rejecting as is",
    );
    return Promise.reject(error);
  },
);
