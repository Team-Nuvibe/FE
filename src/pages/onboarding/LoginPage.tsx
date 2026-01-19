import { NavLink, useLocation, useNavigate } from "react-router";
import Google_G_logo from "@/assets/logos/Google_logo.svg?react";
import Naver_logo from "@/assets/logos/Naver_logo.svg?react";
import KakaoTalk_logo from "@/assets/logos/KakaoTalk_logo.svg?react";
import {
  validateSignin,
  type UserSigninInformation,
} from "../../utils/validate";
import useForm from "../../hooks/useForm";
import InputBox from "../../components/onboarding/InputBox";
import { useEffect, useState } from "react";
import useLogin from "@/hooks/mutation/auth/useLogin";
import { BaseModal } from "@/components/onboarding/BaseModal";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState({
    maintext: "",
    subtext: "",
  });

  const { mutate: login, isPending } = useLogin();
  const { accessToken } = useAuth();
  const fromPath = location.state?.fromPath || "/home";
  const navigate = useNavigate();
  // 이미 로그인 해있을 시 홈으로 이동
  useEffect(() => {
    if (accessToken) {
      navigate(fromPath, { replace: true });
    }
  }, [navigate, accessToken, fromPath]);

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToastMessage(location.state.toastMessage);
      const timer = setTimeout(() => {
        setToastMessage(null);
        window.history.replaceState({}, document.title);
      }, 3000); // 3초 후 토스트 메시지 제거
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const { values, errors, getInputProps } = useForm<UserSigninInformation>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) || // 오류 있으면 true
    Object.values(values).some((value) => value === ""); // 입력 값 비어있으면 true

  const handleLoginSubmit = () => {
    login(
      {
        email: values.email,
        password: values.password,
      },
      {
        onError: (error: unknown) => {
          const errorMessage = (error as any)?.response?.data?.message || "";

          // API 에러 메시지에 따라 모달 내용 설정
          if (errorMessage === "사용자를 찾을 수 없습니다") {
            setErrorModalContent({
              maintext: "가입되지 않은 계정이에요",
              subtext: "이메일을 확인하거나, 회원가입을 진행해주세요.",
            });
          } else if (errorMessage === "비밀번호가 일치하지 않습니다.") {
            setErrorModalContent({
              maintext: "비밀번호가 일치하지 않습니다.",
              subtext: "입력한 정보가 일치하지 않아요.",
            });
          } else {
            // 기타 에러
            setErrorModalContent({
              maintext: "로그인 실패",
              subtext: "네트워크 오류가 발생했습니다.",
            });
          }

          setIsErrorModalOpen(true);
        },
      },
    );
  };

  const handleGoogleLogin = () => {};

  const handleNaverLogin = () => {};

  const handleKakaoLogin = () => {};

  return (
    <>
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center pt-10 pb-33 text-white">
        <div className="H0 flex w-fit items-center justify-center p-9 text-white">
          Start nuvibe
        </div>
        <div className="flex flex-col gap-3">
          <InputBox
            {...getInputProps("email")}
            type="email"
            placeholder="이메일"
          />
          <InputBox
            {...getInputProps("password")}
            type="password"
            placeholder="비밀번호"
          />
          <div className="mb-4 flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                className="h-[12px] w-[12px] appearance-none rounded-[3px] border-[0.79px] border-gray-500 bg-transparent checked:border-transparent checked:bg-gray-800 focus:ring-0 focus:ring-offset-0"
              />{" "}
              {/* CheckIcon 필요 */}
              <div>아이디 저장</div>
            </div>
            <div className="cursor-pointer hover:underline">
              비밀번호를 잊어버리셨나요?
            </div>
          </div>
          <button
            className="H4 flex h-[48px] w-[339px] items-center justify-center gap-[8px] rounded-[5px] bg-white text-black disabled:cursor-not-allowed disabled:bg-gray-800"
            onClick={handleLoginSubmit}
            disabled={isDisabled || isPending}
          >
            {isPending ? "로그인 중..." : "로그인하기"}
          </button>
        </div>
        <div className="mt-4 mb-2 w-[339px] border-t border-gray-800" />
        <div className="p-4 text-[11.64px] text-gray-500">간편로그인하기</div>
        <div className="flex gap-2">
          <button onClick={handleGoogleLogin}>
            <Google_G_logo />
          </button>
          <button onClick={handleNaverLogin}>
            <Naver_logo />
          </button>
          <button onClick={handleKakaoLogin}>
            <KakaoTalk_logo />
          </button>
        </div>

        {toastMessage && (
          <div className="animate-fade-in-out absolute bottom-[122px] z-50 flex h-[46px] w-[361px] items-center justify-center rounded-[5px] bg-gray-800">
            <span className="text-[14px] leading-[150%] font-normal tracking-[-0.025em] text-white">
              {toastMessage}
            </span>
          </div>
        )}

        <footer className="absolute !bottom-12 flex w-full justify-center gap-1 pb-[env(safe-area-inset-bottom)] text-[12px]">
          <p className="text-gray-500">아이디가 없나요?</p>
          <NavLink
            key="/signup"
            to="/signup"
            className={"text-gray-100 underline"}
          >
            회원가입하기
          </NavLink>
        </footer>
      </div>

      {/* 로그인 에러 모달 */}
      <BaseModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        maintext={errorModalContent.maintext}
        subtext={errorModalContent.subtext}
      />
    </>
  );
};

export default LoginPage;
