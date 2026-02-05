import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import type { LogInRequest } from "@/types/auth";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "@/constants/key";
import { logIn, logOut } from "@/apis/auth";
import { useUserStore } from "@/hooks/useUserStore";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: LogInRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
  setSocialLoginTokens: (
    accessToken: string,
    refreshToken: string,
    email: string,
    provider: string,
  ) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  clearSession: () => {},
  setSocialLoginTokens: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage(),
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(),
  );

  const login = async (signinData: LogInRequest) => {
    const { data } = await logIn(signinData);

    if (data) {
      const newAccessToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      setAccessTokenInStorage(newAccessToken);
      setRefreshTokenInStorage(newRefreshToken);

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      // 로그인 성공 후 사용자 프로필 정보 가져오기
      try {
        const { getUserNickname, getUserProfileImage } =
          await import("@/apis/user");
        const { useUserStore } = await import("@/hooks/useUserStore");

        const [nicknameData, profileImageData] = await Promise.all([
          getUserNickname(),
          getUserProfileImage(),
        ]);

        const { setNickname, setEmail, setProfileImage } =
          useUserStore.getState();

        if (nicknameData.data?.nickname) {
          setNickname(nicknameData.data.nickname);
        }

        if (profileImageData.data?.profileImage) {
          setProfileImage(profileImageData.data.profileImage);
        }

        // 이메일은 로그인 시 입력한 값 저장
        setEmail(signinData.email);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // 프로필 가져오기 실패해도 로그인은 성공으로 처리
      }
    }
  };
  const clearSession = () => {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();

    setAccessToken(null);
    setRefreshToken(null);
  };

  const logout = async () => {
    try {
      await logOut();
    } finally {
      clearSession();
    }
  };

  const setSocialLoginTokens = (
    newAccessToken: string,
    newRefreshToken: string,
    email: string,
    provider: string,
  ) => {
    setAccessTokenInStorage(newAccessToken);
    setRefreshTokenInStorage(newRefreshToken);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);

    // 스토어에 이메일과 provider 저장
    const { setEmail, setProvider } = useUserStore.getState();
    setEmail(email);
    setProvider(provider);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        login,
        logout,
        clearSession,
        setSocialLoginTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }

  return context;
};
