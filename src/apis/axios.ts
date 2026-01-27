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

// 응답 인터셉터 : 401 에러 발생 -> refresh 토큰을 통한 토큰 갱신 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답 그대로 반환
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    // 401 에러면서 아직 재시도 하지 않은 요청 경우 처리
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      //refresh 엔드포인트에서 401 에러가 발생한 경우(UnAuthorized)
      // 중복 재시도 방지를 위해 로그아웃 처리.
      if (originalRequest.url === "/api/auth/reissue") {
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
        // refresh 요청 실행 후 프로미스를 전역 변수에 할당
        refreshPromise = (async () => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );

          const refreshToken = getRefreshToken();

          const { data } = await axiosInstance.post(
            "/api/auth/reissue",
            {}, // body는 비움
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`, // Header에 refreshToken 전송
              },
            },
          );

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
          .catch((error) => {
            console.error("Failed to refresh token:", error);
            // 토큰 삭제
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken,
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken,
            );

            removeAccessToken();
            removeRefreshToken();

            // 로그인 페이지로 리다이렉트
            window.location.href = "/login";

            // 에러를 재throw하여 요청이 실패했음을 명확히 함
            throw error;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }
      // 진행중인 refreshPromise(비동기)가 해결될 때까지 기다림
      return refreshPromise.then((newAccessToken) => {
        // 원본 요청에 Authorization 헤더를 갱신된 토큰으로 업뎃
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // 업데이트 된 원본 요청을 재시도
        return axiosInstance.request(originalRequest);
      });
    }
    // 401 에러가 아닌 경우에 그대로 오류를 반환
    return Promise.reject(error);
  },
);
