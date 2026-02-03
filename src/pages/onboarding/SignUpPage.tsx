import { useNavigate } from "react-router";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BackbuttonIcon from "@/assets/icons/icon_chevron_left.svg?react";
import { BaseModal } from "@/components/onboarding/BaseModal";
import { OTPBottomSheet } from "@/components/onboarding/OTPBottomSheet";
import useSignup from "@/hooks/mutation/auth/useSignup";
import WelcomeSplash from "@/components/onboarding/WelcomeSplash";
import { sendVerificationEmail, confirmVerificationCode } from "@/apis/auth";

// Components
import ProgressBar from "@/components/onboarding/ProgressBar";
import NameStep from "@/components/onboarding/signup/NameStep";
import EmailStep from "@/components/onboarding/signup/EmailStep";
import PasswordStep from "@/components/onboarding/signup/PasswordStep";
import NicknameStep from "@/components/onboarding/signup/NicknameStep";

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

export type FormFields = z.infer<typeof schema>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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
    trigger,
    setFocus,
    formState: { errors },
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
      searchParams.delete("verified");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordCheckValue = watch("passwordCheck");

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    try {
      await confirmVerificationCode(emailValue, code);
      setIsEmailVerified(true);
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "인증 코드가 유효하지 않습니다.";
      setErrorModalContent({
        maintext: "인증 실패",
        subtext: errorMessage,
      });
      setIsErrorModalOpen(true);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  const isEmailValid = () => {
    try {
      z.string().email().parse(emailValue);
      return true;
    } catch {
      return false;
    }
  };

  const isPasswordValid = () => {
    try {
      schema.shape.password.parse(passwordValue);
      return true;
    } catch {
      return false;
    }
  };

  const isPasswordCheckValid = () => {
    return (
      !!passwordCheckValue &&
      passwordCheckValue.length >= 8 &&
      passwordValue === passwordCheckValue
    );
  };

  const handleEmailVerification = async () => {
    if (!isEmailValid() || isEmailVerified || isEmailSending) return;

    setIsEmailSending(true);
    try {
      await sendVerificationEmail(emailValue);
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

  const handleNext = async () => {
    let stepValid = false;

    if (currentStep === 1) {
      stepValid = await trigger("name");
    } else if (currentStep === 2) {
      const emailFormValid = await trigger("email");
      if (emailFormValid && !isEmailVerified) {
        setErrorModalContent({
          maintext: "이메일 인증 필요",
          subtext: "이메일 인증을 완료해주세요.",
        });
        setIsErrorModalOpen(true);
        return;
      }
      stepValid = emailFormValid && isEmailVerified;
    } else if (currentStep === 3) {
      const p1 = await trigger("password");
      const p2 = await trigger("passwordCheck");
      stepValid = p1 && p2 && isPasswordCheckValid();
    } else if (currentStep === 4) {
      stepValid = await trigger("nickname");
    }

    if (stepValid) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSignupSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  if (showSplash) {
    return <WelcomeSplash />;
  }

  return (
    <>
      <div className="relative flex min-h-[100dvh] w-full flex-col items-center px-4 pt-[60px] pb-15 text-white">
        {/* Navigation Header */}
        <div className="relative mb-6 flex w-full items-center justify-center">
          <button
            onClick={handleBack}
            type="button"
            className="absolute left-0 -ml-2 h-[44px] w-[44px] p-2"
          >
            <BackbuttonIcon className="h-full w-full" />
          </button>
          <span className="H2 text-[20px] leading-[150%] tracking-[-0.5px] text-gray-200">
            회원가입
          </span>
        </div>

        <div className="mb-5 w-full">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <form className="flex w-full flex-1 flex-col justify-between">
          <div className="w-full">
            {currentStep === 1 && (
              <NameStep
                register={register}
                errors={errors}
                setFocus={setFocus}
              />
            )}
            {currentStep === 2 && (
              <EmailStep
                register={register}
                errors={errors}
                isEmailVerified={isEmailVerified}
                isEmailSending={isEmailSending}
                handleEmailVerification={handleEmailVerification}
                isEmailValid={isEmailValid()}
                setFocus={setFocus}
              />
            )}
            {currentStep === 3 && (
              <PasswordStep
                register={register}
                errors={errors}
                isPasswordValid={isPasswordValid}
                isPasswordCheckValid={isPasswordCheckValid}
                setFocus={setFocus}
              />
            )}
            {currentStep === 4 && (
              <NicknameStep
                register={register}
                errors={errors}
                setFocus={setFocus}
              />
            )}
          </div>

          <div className="mt-10 mb-8 w-full">
            <button
              type="button"
              className="H4 flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[5px] bg-white text-black disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
              onClick={handleNext}
              disabled={
                isPending ||
                (currentStep === 1 && (!watch("name") || !!errors.name)) ||
                (currentStep === 2 && (!isEmailValid() || !isEmailVerified)) ||
                (currentStep === 3 &&
                  (!isPasswordValid() || !isPasswordCheckValid())) ||
                (currentStep === 4 && (!watch("nickname") || !!errors.nickname))
              }
            >
              {isPending
                ? "가입 중..."
                : currentStep === totalSteps
                  ? "회원가입"
                  : "다음"}
            </button>
          </div>
        </form>
      </div>

      <OTPBottomSheet
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVerify={handleVerifyCode}
        onResend={handleEmailVerification}
        isVerifying={isVerifying}
        isResending={isEmailSending}
      />

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
