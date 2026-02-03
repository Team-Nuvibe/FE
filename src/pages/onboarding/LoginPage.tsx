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
import { deleteUser } from "@/apis/auth";
import { useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState({
    maintext: "",
    subtext: "",
  });

  const { mutate: login, isPending } = useLogin();
  const { accessToken, clearSession } = useAuth();
  const fromPath = location.state?.fromPath || "/home";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 이미 로그인 해있을 시 홈으로 이동 (단, 탈퇴 대기 중일 때나 로그아웃 직후에는 이동하지 않음)
  useEffect(() => {
    if (
      accessToken &&
      !location.state?.pendingDeletion &&
      !location.state?.isLogout
    ) {
      navigate(fromPath, { replace: true });
    }
  }, [navigate, accessToken, fromPath, location.state]);

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (location.state?.pendingDeletion) {
      // 탈퇴 대기 상태 진입
      setIsDeleting(true);
      setToastMessage("계정이 삭제 되었습니다."); // 사용자 경험을 위해 삭제된 것처럼 표시

      const timerIdx = setTimeout(async () => {
        // 4초 후 실제 삭제 요청
        try {
          await deleteUser();
          // 성공 처리
          setIsDeleting(false);
          queryClient.clear();
          clearSession();
          // 페이지 새로고침 효과 및 메시지 표시를 위해 replace 이동
          navigate("/login", {
            replace: true,
            state: { toastMessage: "계정이 영구적으로 삭제되었습니다." } // 메시지 약간 변경하여 완료됨을 구분하거나 그대로 유지
          });
        } catch (error) {
          console.error("Account deletion failed:", error);
          setIsDeleting(false);
          setToastMessage("계정 삭제에 실패했습니다.");
        }
      }, 4000);

      // 클린업: 만약 컴포넌트가 언마운트되면 타이머 취소
      return () => clearTimeout(timerIdx);
    } else if (location.state?.toastMessage) {
      // 일반적인 토스트 메시지 처리
      setToastMessage(location.state.toastMessage);
      const timer = setTimeout(() => {
        setToastMessage(null);
        window.history.replaceState({}, document.title);
      }, 3000); // 3초 후 토스트 메시지 제거
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, queryClient, clearSession]);

  const handleUndoDelete = () => {
    // 실행 취소: 타이머 취소는 useEffect cleanup 발생으로 처리 (navigate 이동 시)
    navigate("/profile");
  };

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

  const handleGoogleLogin = () => { };

  const handleNaverLogin = () => { };

  const handleKakaoLogin = () => { };

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

        {/* 계정삭제 시 로그인 화면에서 뜨는 토스트 메시지 */}
        {toastMessage && (
          <div className="animate-fade-in-out absolute bottom-[40px] z-50 flex h-[48px] w-[344px] items-center justify-center gap-[10px] rounded-[5px] bg-[#D0D3D7]/85 px-[16px] pr-[8px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[30px]">
            <span className="text-[14px] leading-[150%] font-normal tracking-[-0.025em] text-black">
              {toastMessage}
            </span>
            {isDeleting && (
              <button
                onClick={handleUndoDelete}
                className="ml-auto text-[14px] font-normal leading-[150%] tracking-[-0.025em] text-gray-600 underline decoration-solid underline-offset-auto"
              >
                실행취소
              </button>
            )}
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
