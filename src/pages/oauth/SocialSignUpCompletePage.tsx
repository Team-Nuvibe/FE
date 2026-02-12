import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { completeSocialSignUp } from "@/apis/auth";
import { BaseModal } from "@/components/onboarding/BaseModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ProgressBar from "@/components/onboarding/ProgressBar";
import NameStep from "@/components/onboarding/signup/NameStep";
import NicknameStep from "@/components/onboarding/signup/NicknameStep";
import { useUserStore } from "@/hooks/useUserStore";

const schema = z.object({
  name: z.string().min(1, { message: "이름을 입력해주세요." }),
  nickname: z
    .string()
    .min(1, { message: "닉네임을 입력해주세요." })
    .min(2, { message: "닉네임은 최소 2자 이상이어야 합니다." })
    .max(10, { message: "닉네임은 최대 10자까지 입력 가능합니다." }),
});

export type SocialSignUpForm = z.infer<typeof schema>;

const SocialSignUpCompletePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    maintext: "회원가입 실패",
    subtext: "다시 시도해주세요.",
  });

  useEffect(() => {
    // 뒤로가기 방지
    const currentUrl = window.location.href; // 현재 URL 저장

    const preventGoBack = () => {
      // 뒤로가기 시 저장된 현재 URL로 다시 푸시하여 페이지 유지
      window.history.pushState(null, "", currentUrl);
    };

    window.history.pushState(null, "", currentUrl);
    window.addEventListener("popstate", preventGoBack);

    return () => {
      window.removeEventListener("popstate", preventGoBack);
    };
  }, []);

  const {
    register,
    trigger,
    getValues,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<SocialSignUpForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      nickname: "",
    },
  });

  const handleNext = async () => {
    let stepValid = false;

    if (currentStep === 1) {
      stepValid = await trigger("name");
    } else if (currentStep === 2) {
      stepValid = await trigger("nickname");
    }

    if (stepValid) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    const { name, nickname } = getValues();
    const { setNickname } = useUserStore.getState(); // Assuming we access it this way or hook

    try {
      await completeSocialSignUp({
        name,
        nickname,
      });

      // 로컬 스토어 업데이트 (닉네임 설정하여 MainLayout 리다이렉트 방지)
      setNickname(nickname);

      // 성공 시 홈으로 이동
      navigate("/home", { replace: true });
      sessionStorage.setItem("isNewUser", "true");
    } catch (error: any) {
      console.error("Social signup completion failed:", error);

      const errorMsg = error?.response?.data?.message || "";

      if (errorMsg.includes("닉네임")) {
        setErrorMessage({
          maintext: "사용할 수 없는 닉네임입니다",
          subtext: "이미 사용 중인 닉네임이에요. 다른 닉네임을 입력해주세요.",
        });
      } else {
        setErrorMessage({
          maintext: "회원가입 실패",
          subtext: "문제가 발생했습니다. 다시 시도해주세요.",
        });
      }

      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative flex min-h-[100dvh] flex-col items-center px-4 pt-[60px] pb-15 text-white">
        <div className="relative mb-6 flex w-full items-center justify-center">
          <div className="H2 text-[20px] leading-[150%] tracking-[-0.5px] text-gray-200">
            추가 정보 입력
          </div>
        </div>

        <div className="mb-5 w-full">
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>

        <form
          className="flex w-full flex-1 flex-col justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          <div className="w-full">
            {currentStep === 1 && (
              <NameStep
                register={register}
                errors={errors}
                setFocus={setFocus}
              />
            )}
            {currentStep === 2 && (
              <NicknameStep
                register={register}
                errors={errors}
                setFocus={setFocus}
              />
            )}
          </div>

          <div className="mt-10 mb-8 w-full">
            <button
              type="submit"
              className="H4 flex h-[48px] w-full items-center justify-center gap-[8px] rounded-[5px] bg-white text-black disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
              disabled={
                isSubmitting ||
                (currentStep === 1 && (!watch("name") || !!errors.name)) ||
                (currentStep === 2 && (!watch("nickname") || !!errors.nickname))
              }
            >
              {isSubmitting
                ? "처리 중..."
                : currentStep === totalSteps
                  ? "완료"
                  : "다음"}
            </button>
          </div>
        </form>
      </div>

      <BaseModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        maintext={errorMessage.maintext}
        subtext={errorMessage.subtext}
      />
    </>
  );
};

export default SocialSignUpCompletePage;
