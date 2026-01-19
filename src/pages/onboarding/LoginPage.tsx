import { NavLink, useNavigate, useLocation } from "react-router";
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
import { BaseModal } from "@/components/onboarding/BaseModal";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState({
    maintext: "",
    subtext: "",
  });

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

  const handleLoginSubmit = async () => {
    try {
      // TODO: 실제 로그인 API 호출
      // const response = await loginAPI({ email: values.email, password: values.password });

      // 임시: 에러 시뮬레이션 (테스트용)
      const simulatedResponse = {
        success: false,
        message: "이메일을 확인해주세요", // API에서 직접 전달되는 에러 메시지
      };

      if (!simulatedResponse.success) {
        // API에서 전달된 에러 메시지를 그대로 사용
        setErrorModalContent({
          maintext: simulatedResponse.message,
          subtext: "입력한 정보가 맞는지 다시 확인해주세요",
        });
        setIsErrorModalOpen(true);
      } else {
        // 로그인 성공
        navigate("/home");
      }

      /*
      // 실제 API 연동 예시:
      const response = await loginAPI({ 
        email: values.email, 
        password: values.password 
      });
      
      if (!response.success) {
        // API에서 보내준 에러 메시지를 maintext로 사용
        setErrorModalContent({
          maintext: response.message, // 예: "이메일을 확인해주세요" 또는 "비밀번호를 확인해주세요"
          subtext: "입력한 정보가 맞는지 다시 확인해주세요"
        });
        setIsErrorModalOpen(true);
      } else {
        // 로그인 성공
        navigate('/home');
      }
      */
    } catch (error) {
      console.error("로그인 에러:", error);
      setErrorModalContent({
        maintext: "로그인 실패",
        subtext: "네트워크 오류가 발생했습니다",
      });
      setIsErrorModalOpen(true);
    }
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
            disabled={isDisabled}
          >
            로그인하기
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
