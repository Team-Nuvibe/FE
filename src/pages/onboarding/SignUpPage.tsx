import { useNavigate } from "react-router";
import NuvibeLogo from "@/assets/logos/Nuvibe.svg?react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { BackButton } from "../../components/onboarding/BackButton";
import InputBox from "../../components/onboarding/InputBox";
import { BaseModal } from "@/components/onboarding/BaseModal";
import VerifiedIcon from "@/assets/icons/icon_select_image_white.svg?react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const passwordCheckValue = watch("passwordCheck");

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

  // 이메일 인증 버튼 핸들러 (추후 API 연결)
  const handleEmailVerification = async () => {
    if (!isEmailValid() || isEmailVerified) return;

    // TODO: 추후 이메일 인증 API 호출
    console.log("이메일 인증 요청:", emailValue);
    // const result = await verifyEmail(emailValue);
    // if (result.success) {
    //   setIsEmailVerified(true);
    // }

    // 임시: 모달 열기 (추후 API 성공 시에만 열리도록 수정)
    setIsModalOpen(true);
    // 테스트를 위해 임시로 인증 완료 상태로 설정 (추후 API 응답에 따라 처리)
    setIsEmailVerified(true);
  };

  // const onSubmit:SubmitHandler<FormFields> = async (data) => {
  //   // eslint-disable-next-line
  //   try {
  //     const user = {email,password,name:data.name};
  //     const response = await postSignup(user)
  //     console.log(response);

  //     navigate("/");
  //     } catch(error) {
  //       console.log(error);
  //       alert("이미 존재하는 유저입니다")
  //     }
  // };
  const handleSignupSubmit = () => {
    navigate("/login");
  };
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
                disabled={!isEmailValid() || isEmailVerified}
                className={`ml-2 h-[28px] shrink-0 rounded-[5px] px-2 py-1 text-[10px] leading-[1.5] font-normal tracking-[-0.25px] transition-colors ${
                  isEmailVerified
                    ? "cursor-not-allowed bg-gray-700 text-gray-300"
                    : isEmailValid()
                      ? "bg-[#b9bdc2] text-[#212224]"
                      : "cursor-not-allowed bg-gray-700 text-gray-300"
                }`}
              >
                {isEmailVerified ? "인증 완료" : "이메일 인증"}
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
          disabled={!isValid || isSubmitting}
          onClick={handleSignupSubmit}
        >
          회원가입
        </button>
      </div>

      {/* 이메일 인증 모달 */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maintext="메일함을 확인해주세요"
        subtext="메일이 보이지 않는다면 스팸함을 함께 확인해주세요"
      />
    </>
  );
};

export default SignUpPage;
