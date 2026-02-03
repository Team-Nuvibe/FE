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

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (singinData: LogInRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
  clearSession: () => {},
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
      const newAccressToken = data.accessToken;
      const newRefreshToken = data.refreshToken;

      setAccessTokenInStorage(newAccressToken);
      setRefreshTokenInStorage(newRefreshToken);

      setAccessToken(newAccressToken);
      setRefreshToken(newRefreshToken);
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

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, clearSession }}
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
