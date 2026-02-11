import { NavLink, useLocation, useNavigate } from "react-router";
import Google_G_logo from "@/assets/logos/Google_logo.svg?react";
import Naver_logo from "@/assets/logos/Naver_logo.svg?react";
import KakaoTalk_logo from "@/assets/logos/KakaoTalk_logo.svg?react";
import EyeOnIcon from "@/assets/icons/icon_eye_on.svg?react";
import EyeOffIcon from "@/assets/icons/icon_eye_off.svg?react";
import {
  validateSignin,
  type UserSigninInformation,
} from "../../utils/validate";
import useForm from "../../hooks/useForm";
import InputBox from "../../components/onboarding/InputBox";
import { useEffect, useState } from "react";
import useLogin from "@/hooks/mutation/auth/useLogin";
import { startSocialLogin } from "@/apis/auth";
import { BaseModal } from "@/components/onboarding/BaseModal";
import LoginCheckedIcon from "@/assets/icons/icon_login_checked.svg?react";
import LoginNotCheckedIcon from "@/assets/icons/icon_login_notchecked.svg?react";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState({
    maintext: "",
    subtext: "",
  });

  const { mutate: login, isPending } = useLogin();
  const { accessToken } = useAuth();
  const fromPath = location.state?.fromPath || "/home";
  const navigate = useNavigate();

  // 이미 로그인 해있을 시 홈으로 이동 (로그아웃 직후에는 이동하지 않음)
  useEffect(() => {
    if (accessToken && !location.state?.isLogout) {
      navigate(fromPath, { replace: true });
    }
  }, [navigate, accessToken, fromPath, location.state]);

  // 토스트 메시지 처리

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToastMessage(location.state.toastMessage);
      const timer = setTimeout(() => {
        setToastMessage(null);
        window.history.replaceState({}, document.title);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
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
        onSuccess: () => {
          navigate(fromPath, { replace: true });
        },
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

  const handleGoogleLogin = () => {
    startSocialLogin("google");
  };

  const handleNaverLogin = () => {
    startSocialLogin("naver");
  };

  const handleKakaoLogin = () => {
    startSocialLogin("kakao");
  };

  return (
    <>
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center text-white">
        <div className="H0 flex w-full items-center justify-center p-9 text-white">
          Start nuvibe
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLoginSubmit();
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
              이메일
            </div>
            <InputBox
              {...getInputProps("email")}
              type="email"
              placeholder="이메일을 입력해주세요."
            />
            {touched.email && errors.email && (
              <p className="text-[12px] leading-[150%] font-normal tracking-[-0.3px] text-gray-300">
                {errors.email}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
              비밀번호
            </div>
            <InputBox
              {...getInputProps("password")}
              type={isPasswordVisible ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요."
              rightElement={
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeOnIcon /> : <EyeOffIcon />}
                </button>
              }
            />
            {touched.password && errors.password && (
              <p className="text-[12px] leading-[150%] font-normal tracking-[-0.3px] text-gray-300">
                {errors.password}
              </p>
            )}
          </div>
          <div className="B2 mb-2 flex items-center justify-between pt-[50px] leading-[150%] tracking-[-0.35px] text-gray-300">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAutoLogin(!isAutoLogin)}
                className="flex items-center"
              >
                {isAutoLogin ? <LoginCheckedIcon /> : <LoginNotCheckedIcon />}
              </button>
              <div>자동 로그인</div>
            </div>
            <div
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/reset-password")}
            >
              비밀번호를 잊어버리셨나요?
            </div>
          </div>
          <button
            type="submit"
            className="H4 flex h-[48px] w-[339px] items-center justify-center gap-[8px] rounded-[5px] bg-white text-black disabled:cursor-not-allowed disabled:bg-gray-800"
            disabled={isDisabled || isPending}
          >
            {isPending ? "로그인 중..." : "로그인하기"}
          </button>
        </form>
        <div className="mt-9 mb-2 w-[339px] border-t border-gray-800" />
        <div className="p-4 text-[11.64px] text-gray-500">간편로그인하기</div>
        <div className="flex gap-2 pb-12">
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

        {/* 토스트 메시지 */}
        {toastMessage && (
          <div className="animate-fade-in-out absolute bottom-[40px] z-50 flex h-[48px] w-[344px] items-center justify-center rounded-[5px] bg-[#D0D3D7]/85 px-[16px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[30px]">
            <span className="text-[14px] leading-[150%] font-normal tracking-[-0.025em] text-black">
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
