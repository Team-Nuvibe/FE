import { useNavigate } from "react-router";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import BackbuttonIcon from "@/assets/icons/icon_chevron_left.svg?react";
import { BaseModal } from "@/components/onboarding/BaseModal";
import { OTPBottomSheet } from "@/components/onboarding/OTPBottomSheet";
import {
  sendResetPasswordVerificationCode,
  confirmResetPasswordVerificationCode,
  resetPassword,
} from "@/apis/auth";

// Components
import ProgressBar from "@/components/onboarding/ProgressBar";
import EmailStep from "@/components/onboarding/signup/EmailStep";
import PasswordStep from "@/components/onboarding/signup/PasswordStep";

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
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않아요.",
    path: ["passwordCheck"],
  });

export type ResetPasswordFormFields = z.infer<typeof schema>;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isMailConfirmModalOpen, setIsMailConfirmModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorModalContent, setErrorModalContent] = useState({
    maintext: "",
    subtext: "",
  });

  const {
    register,
    watch,
    getValues,
    trigger,
    setFocus,
    formState: { errors },
  } = useForm<ResetPasswordFormFields>({
    defaultValues: {
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordCheckValue = watch("passwordCheck");

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    try {
      await confirmResetPasswordVerificationCode(emailValue, code);
      setVerificationCode(code);
      setIsEmailVerified(true);
      setIsOTPModalOpen(false);
    } catch (error: any) {
      console.error("인증 실패 오류:", error);
      console.error("응답 데이터:", error.response?.data);
      console.error("상태 코드:", error.response?.status);
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

    // 먼저 메일함 확인 안내 모달을 표시
    setIsMailConfirmModalOpen(true);
  };

  const handleMailConfirmModalClose = async () => {
    setIsMailConfirmModalOpen(false);

    // 모달 확인 후 실제 이메일 발송
    setIsEmailSending(true);
    try {
      await sendResetPasswordVerificationCode(emailValue);
      setIsOTPModalOpen(true);
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

  const handleResetPasswordSubmit = async () => {
    const { email, password, passwordCheck } = getValues();

    try {
      await resetPassword({
        email,
        code: verificationCode,
        newPassword: password,
        confirmPassword: passwordCheck,
      });

      // 성공 시 로그인 페이지로 이동
      navigate("/login", {
        state: {
          toastMessage: "비밀번호가 재설정되었습니다. 로그인을 진행해주세요.",
        },
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "비밀번호 재설정에 실패했습니다.";
      setErrorModalContent({
        maintext: "비밀번호 재설정 실패",
        subtext: errorMessage,
      });
      setIsErrorModalOpen(true);
    }
  };

  const handleNext = async () => {
    let stepValid = false;

    if (currentStep === 1) {
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
    } else if (currentStep === 2) {
      const p1 = await trigger("password");
      const p2 = await trigger("passwordCheck");
      stepValid = p1 && p2 && isPasswordCheckValid();
    }

    if (stepValid) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleResetPasswordSubmit();
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
            비밀번호 재설정
          </span>
        </div>

        <div className="mb-5 w-full">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <form className="flex w-full flex-1 flex-col justify-between">
          <div className="w-full">
            {currentStep === 1 && (
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
            {currentStep === 2 && (
              <PasswordStep
                register={register}
                errors={errors}
                isPasswordValid={isPasswordValid}
                isPasswordCheckValid={isPasswordCheckValid}
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
                (currentStep === 1 && (!isEmailValid() || !isEmailVerified)) ||
                (currentStep === 2 &&
                  (!isPasswordValid() || !isPasswordCheckValid()))
              }
            >
              {currentStep === totalSteps ? "재설정 완료" : "다음"}
            </button>
          </div>
        </form>
      </div>

      {/* 메일함 확인 안내 모달 */}
      <BaseModal
        isOpen={isMailConfirmModalOpen}
        onClose={handleMailConfirmModalClose}
        maintext="메일함을 확인해주세요"
        subtext="인증 코드가 발송되었습니다."
      />

      {/* OTP 입력 모달 */}
      <OTPBottomSheet
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        onVerify={handleVerifyCode}
        onResend={async () => {
          setIsEmailSending(true);
          try {
            await sendResetPasswordVerificationCode(emailValue);
          } catch (error: any) {
            const errorMessage =
              error.response?.data?.message ||
              "이메일 인증 발송에 실패했습니다.";
            setErrorModalContent({
              maintext: "이메일 인증 실패",
              subtext: errorMessage,
            });
            setIsErrorModalOpen(true);
          } finally {
            setIsEmailSending(false);
          }
        }}
        isVerifying={isVerifying}
        isResending={isEmailSending}
      />

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

export default ResetPasswordPage;
