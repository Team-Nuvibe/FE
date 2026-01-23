import { useNavigate } from "react-router";
import NuvibeLogo from "@/assets/logos/Nuvibe.svg?react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BackButton } from "../../components/onboarding/BackButton";
import InputBox from "../../components/onboarding/InputBox";
import { BaseModal } from "@/components/onboarding/BaseModal";
import VerifiedIcon from "@/assets/icons/icon_select_image_white.svg?react";
import useSignup from "@/hooks/mutation/auth/useSignup";
import WelcomeSplash from "@/components/onboarding/WelcomeSplash";
import { sendVerificationEmail, verifyEmail } from "@/apis/auth";
import OTPInput from "@/components/onboarding/OTPInput";

const schema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 올바르지 않아요." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상 입력해 주세요." })
      .max(20, { message: "비밀번호는 20자 이하 입력해 주세요." })
      .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/, {
        message: "영문, 숫자, 특수문자를 모두 포함해 주세요.",
      }),
    passwordCheck: z
      .string()
      .min(8, { message: "비밀번호는 8자 이상 입력해 주세요." })
      .max(20, { message: "비밀번호는 20자 이하 입력해 주세요." }),
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
    nickname: z.string().min(1, { message: "닉네임을 입력해주세요" }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않아요.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutate: signup, isPending } = useSignup();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState({
    maintext: "",
    subtext: "",
  });

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setIsEmailVerified(true);
      // URL에서 verified 파라미터 제거 (깔끔한 URL 유지)
      searchParams.delete("verified");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordCheckValue = watch("passwordCheck");

  const [verificationCode, setVerificationCode] = useState("");
  // 코드 입력이 완료되었을 때 실행될 함수
  const handleCodeComplete = (code: string) => {
    setVerificationCode(code);
    console.log("입력된 코드:", code);
  };

  // 코드 검증 함수 (버튼 클릭 시 실행)
  const handleVerifyCode = async () => {
    if (verificationCode.length < 6 || isVerifying) return;

    setIsVerifying(true);
    try {
      const response = await verifyEmail(verificationCode);
      console.log("인증 성공:", response.message);

      // 성공 시
      setIsEmailVerified(true);
      setIsModalOpen(false);
      setVerificationCode(""); // 코드 초기화
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "인증 코드가 유효하지 않습니다.";
      setErrorModalContent({
        maintext: "인증 실패",
        subtext: errorMessage,
      });
      setIsErrorModalOpen(true);
      setVerificationCode(""); // 실패 시도 코드 초기화
    } finally {
      setIsVerifying(false);
    }
  };
  // 이메일 형식 유효성 검사
  const isEmailValid = () => {
    try {
      z.string().email().parse(emailValue);
      return true;
    } catch {
      return false;
    }
  };

  // 비밀번호 형식 유효성 검사
  const isPasswordValid = () => {
    try {
      schema.shape.password.parse(passwordValue);
      return true;
    } catch {
      return false;
    }
  };

  // 비밀번호 확인 유효성 검사
  const isPasswordCheckValid = () => {
    return (
      passwordCheckValue &&
      passwordCheckValue.length >= 8 &&
      passwordValue === passwordCheckValue
    );
  };

  // 이메일 인증 버튼 핸들러
  const handleEmailVerification = async () => {
    if (!isEmailValid() || isEmailVerified || isEmailSending) return;

    setIsEmailSending(true);
    try {
      const response = await sendVerificationEmail(emailValue);
      console.log("이메일 발송 성공:", response.message);

      // 성공 시 모달 열기
      setIsModalOpen(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "이메일 인증 발송에 실패했습니다.";
      setErrorModalContent({
        maintext: "이메일 인증 실패",
        subtext: errorMessage,
      });
      setIsErrorModalOpen(true);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleSignupSubmit = () => {
    const { email, password, passwordCheck, name, nickname } = getValues();

    signup(
      { email, password, name, nickname, confirmPassword: passwordCheck },
      {
        onSuccess: () => {
          setShowSplash(true);
          setTimeout(() => {
            navigate("/login", {
              state: {
                toastMessage:
                  "회원가입이 완료되었습니다. 로그인을 진행해주세요.",
              },
            });
          }, 2000);
        },
        onError: (error: any) => {
          const errorMessage =
            error.response?.data?.message || "회원가입에 실패했습니다.";
          setErrorModalContent({
            maintext: "회원가입 실패",
            subtext: errorMessage,
          });
          setIsErrorModalOpen(true);
        },
      },
    );
  };

  if (showSplash) {
    return <WelcomeSplash />;
  }

  return (
    <>
      <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center pb-15 text-white">
        <BackButton className="absolute top-[60.82px] left-[30.42px] z-50 p-2" />
        <div className="mb-12">
          <NuvibeLogo className="h-[25.4px] w-[130.3px]" />
        </div>
        <form className="mb-9 flex flex-col gap-3">
          <InputBox
            {...register("name")}
            type="name"
            placeholder="이름"
            hasError={!!errors?.name}
            errorMessage={errors.name?.message}
          />

          {/* 이메일 입력 필드 with 인증 버튼 */}
          <InputBox
            {...register("email")}
            type="email"
            placeholder="이메일"
            hasError={!!errors?.email}
            errorMessage={errors.email?.message}
            rightElement={
              <button
                type="button"
                onClick={handleEmailVerification}
                disabled={!isEmailValid() || isEmailVerified || isEmailSending}
                className={`ml-2 flex h-[28px] shrink-0 items-center justify-center rounded-[5px] px-2 py-1 text-[10px] leading-[1.5] font-normal tracking-[-0.25px] whitespace-nowrap transition-colors ${
                  isEmailVerified
                    ? "cursor-not-allowed bg-gray-700 text-gray-300"
                    : isEmailValid()
                      ? "bg-[#b9bdc2] text-[#212224]"
                      : "cursor-not-allowed bg-gray-700 text-gray-300"
                }`}
              >
                {isEmailVerified
                  ? "인증 완료"
                  : isEmailSending
                    ? "발송 중..."
                    : "이메일 인증"}
              </button>
            }
          />
          <InputBox
            {...register("password")}
            type="password"
            placeholder="비밀번호"
            hasError={!!errors?.password}
            errorMessage={errors.password?.message}
            guideText="8~20자/영문,숫자,특수문자 혼합"
            rightElement={
              isPasswordValid() && !errors?.password ? <VerifiedIcon /> : null
            }
          />
          <InputBox
            {...register("passwordCheck")}
            type="password"
            placeholder="비밀번호 확인"
            hasError={!!errors?.passwordCheck}
            errorMessage={errors.passwordCheck?.message}
            rightElement={
              isPasswordCheckValid() && !errors?.passwordCheck ? (
                <VerifiedIcon />
              ) : null
            }
          />
          <InputBox
            {...register("nickname")}
            type="text"
            placeholder="닉네임"
            hasError={!!errors?.nickname}
            errorMessage={errors.nickname?.message}
            guideText="(추후 변경할 수 있어요)"
          />
        </form>
        <button
          className="H4 flex h-[48px] w-[339px] items-center justify-center gap-[8px] rounded-[5px] bg-white text-black disabled:cursor-not-allowed disabled:bg-gray-800"
          disabled={!isValid || isPending}
          onClick={handleSignupSubmit}
        >
          {isPending ? "가입 중..." : "회원가입"}
        </button>
      </div>

      {/* 디자인 나오면 수정 예정 */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maintext="인증번호 입력"
        subtext="이메일로 전송된 숫자 6자리를 입력해주세요."
      >
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* ✨ 여기에 OTP Input 배치 ✨ */}
          <OTPInput length={6} onComplete={handleCodeComplete} />

          {/* 확인 버튼 */}
          <button
            onClick={handleVerifyCode}
            disabled={verificationCode.length < 6 || isVerifying}
            className="mt-4 h-[48px] w-full rounded bg-white font-bold text-black disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {isVerifying ? "인증 중..." : "인증하기"}
          </button>

          {/* 타이머나 재전송 버튼 등이 여기에 들어감 */}
        </div>
      </BaseModal>

      {/* 에러 모달 */}
      <BaseModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        maintext={errorModalContent.maintext}
        subtext={errorModalContent.subtext}
      />
    </>
  );
};

export default SignUpPage;
