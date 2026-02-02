import { useState } from "react";
import { useNavigate } from "react-router";
import { completeSocialSignUp } from "@/apis/auth";
import InputBox from "@/components/onboarding/InputBox";
import { BaseModal } from "@/components/onboarding/BaseModal";
import useForm from "@/hooks/useForm";

interface SocialSignUpForm {
  name: string;
  nickname: string;
}

const validateSocialSignUp = (
  values: SocialSignUpForm,
): Record<keyof SocialSignUpForm, string> => {
  const errors: Record<keyof SocialSignUpForm, string> = {
    name: "",
    nickname: "",
  };

  if (!values.name.trim()) {
    errors.name = "이름을 입력해주세요.";
  } else if (values.name.length < 2) {
    errors.name = "이름은 최소 2자 이상이어야 합니다.";
  }

  if (!values.nickname.trim()) {
    errors.nickname = "닉네임을 입력해주세요.";
  } else if (values.nickname.length < 2) {
    errors.nickname = "닉네임은 최소 2자 이상이어야 합니다.";
  } else if (values.nickname.length > 10) {
    errors.nickname = "닉네임은 최대 10자까지 입력 가능합니다.";
  }

  return errors;
};

const SocialSignUpCompletePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    maintext: "회원가입 실패",
    subtext: "다시 시도해주세요.",
  });

  const { values, errors, getInputProps } = useForm<SocialSignUpForm>({
    initialValues: {
      name: "",
      nickname: "",
    },
    validate: validateSocialSignUp,
  });

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDisabled || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await completeSocialSignUp({
        name: values.name,
        nickname: values.nickname,
      });

      // 성공 시 홈으로 이동
      navigate("/home", { replace: true });
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
      <div className="relative flex min-h-[100dvh] flex-col items-center justify-center text-white">
        <div className="H0 flex w-full items-center justify-center p-9 text-white">
          추가 정보 입력
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
              이름
            </div>
            <InputBox
              {...getInputProps("name")}
              type="text"
              placeholder="이름을 입력해주세요."
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
              닉네임
            </div>
            <InputBox
              {...getInputProps("nickname")}
              type="text"
              placeholder="닉네임을 입력해주세요."
            />
          </div>

          <button
            type="submit"
            className="H4 mt-12 flex h-[48px] w-[339px] items-center justify-center gap-[8px] rounded-[5px] bg-white text-black disabled:cursor-not-allowed disabled:bg-gray-800"
            disabled={isDisabled || isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "완료"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400">
          소셜 로그인을 완료하려면 추가 정보가 필요해요
        </p>
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
