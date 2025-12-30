import { useNavigate } from 'react-router';
import NuvibeLogo from '@/assets/logos/Nuvibe.svg?react';
import { BackButton } from '../components/Login_Signup/BackButton';
import InputBox from '../components/Login_Signup/InputBox';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email({ message: "이메일 형식이 올바르지 않아요." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 8자 이상 입력해 주세요." })
    .max(20, { message: "비밀번호는 20자 이하 입력해 주세요." })
    .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/, {
      message: "영문, 숫자, 특수문자를 모두 포함해 주세요."
    }),
  passwordCheck: z
    .string()
    .min(8, { message: "" })
    .max(20, { message: "" }),
  name: z.string().min(1, { message: "이름을 입력해주세요." }),
  nickname: z.string().min(1, { message: "닉네임을 입력해주세요" })
})
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않아요.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>

const SignUpPage = () => {

  const navigate = useNavigate();

  const {
    register,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormFields>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange"
  });

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
    navigate('/login')
  }
  return (
    <>
      <div className="relative flex flex-col justify-center items-center min-h-[100dvh] w-full text-white">
        <BackButton className="absolute top-[60.82px] left-[30.42px] z-50 p-2 " />
        <div className="mb-12">
          <NuvibeLogo className="w-[130.3px] h-[25.4px]" />
        </div>
        <form className="flex flex-col gap-[10px] mb-9">
          <InputBox
            {...register('name')}
            type="name"
            placeholder="이름"
            hasError={!!errors?.name}
            errorMessage={errors.name?.message}
          />
          <InputBox
            {...register("email")}
            type="email"
            placeholder="이메일"
            hasError={!!errors?.email}
            errorMessage={errors.email?.message}
          />
          <InputBox
            {...register("password")}
            type="password"
            placeholder="비밀번호"
            hasError={!!errors?.password}
            errorMessage={errors.password?.message}
            guideText='8자 이상/영문,숫자,특수문자 혼합'
          />
          <InputBox
            {...register("passwordCheck")}
            type="password"
            placeholder="비밀번호 확인"
            hasError={!!errors?.passwordCheck}
            errorMessage={errors.passwordCheck?.message}
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
          className="
              w-[339px] h-[48px]
              rounded-[5px]
              gap-[8px]
              flex justify-center items-center
              bg-white text-black
              H4
              disabled:bg-gray-800 disabled:cursor-not-allowed
            "
          disabled={!isValid || isSubmitting}
          onClick={handleSignupSubmit}
        >
          회원가입
        </button>
      </div>
    </>
  )
}

export default SignUpPage
