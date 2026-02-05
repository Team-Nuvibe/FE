import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { BaseModal } from "@/components/onboarding/BaseModal";

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const { setSocialLoginTokens } = useAuth();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    maintext: "로그인 실패",
    subtext: "다시 시도해주세요.",
  });

  useEffect(() => {
    const handleCallback = async () => {
      // Fragment(#) 또는 Query String(?) 방식으로 전달된 파라미터 파싱
      const hash = window.location.hash.substring(1); // # 제거
      let params = new URLSearchParams(hash);

      // Fragment에 토큰이 없으면 Query String 확인 (로컬 테스트용)
      if (!params.get("accessToken") && !params.get("error")) {
        params = new URLSearchParams(window.location.search);
      }

      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");
      const isNewUser = params.get("isNewUser");
      const userId = params.get("userId");
      const email = params.get("email");
      const provider = params.get("provider");
      const error = params.get("error");

      // 에러 처리
      if (error) {
        if (error === "AUTH017") {
          navigate("/login", {
            replace: true,
            state: {
              toastMessage: "이미 다른 방식으로 가입된 이메일입니다.",
            },
          });
          return;
        }

        setErrorMessage({
          maintext: "로그인 실패",
          subtext: "소셜 로그인 중 문제가 발생했습니다.",
        });
        setIsErrorModalOpen(true);
        return;
      }

      // 토큰이 없으면 에러
      if (!accessToken || !refreshToken) {
        setErrorMessage({
          maintext: "인증 실패",
          subtext: "토큰을 받아오지 못했습니다.",
        });
        setIsErrorModalOpen(true);
        return;
      }

      // 토큰 저장 및 사용자 프로필 가져오기 (비동기)
      // 토큰 저장 (email과 provider가 없는 경우 빈 문자열로 처리하거나 에러 처리 필요)
      await setSocialLoginTokens(
        accessToken,
        refreshToken,
        email || "",
        provider || "",
      );

      // 신규 유저인 경우 추가 정보 입력 페이지로, 아니면 홈으로
      if (isNewUser === "true") {
        navigate("/oauth/signup-complete", {
          state: { userId },
          replace: true,
        });
      } else {
        navigate("/home", { replace: true });
      }
    };

    handleCallback();
  }, [navigate, setSocialLoginTokens]);

  const handleErrorModalClose = () => {
    setIsErrorModalOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="flex min-h-[100dvh] items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white" />
          <p className="text-lg">로그인 처리 중...</p>
        </div>
      </div>

      <BaseModal
        isOpen={isErrorModalOpen}
        onClose={handleErrorModalClose}
        maintext={errorMessage.maintext}
        subtext={errorMessage.subtext}
      />
    </>
  );
};

export default OAuthCallbackPage;
