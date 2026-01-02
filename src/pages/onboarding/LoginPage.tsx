import { NavLink, useNavigate } from "react-router"
import Google_G_logo from '@/assets/logos/Google_logo.svg?react';
import Naver_logo from '@/assets/logos/Naver_logo.svg?react';
import KakaoTalk_logo from '@/assets/logos/KakaoTalk_logo.svg?react'
import { validateSignin, type UserSigninInformation } from "../../utils/validate";
import useForm from "../../hooks/useForm";
import InputBox from "../../components/onboarding/InputBox";

const LoginPage = () => {
  const navigate = useNavigate();

  const { values, errors, getInputProps } = useForm<UserSigninInformation>({
        initialValues: {
            email: "",
            password: "",
        },
        validate: validateSignin
    })

  const isDisabled = 
        Object.values(errors || {}).some((error)=>error.length > 0) || // 오류 있으면 true
        Object.values(values).some((value)=> value === ""); // 입력 값 비어있으면 true
  
  const handleLoginSubmit = () => {
    // api 통신
    navigate('/archive-board')
  }
  
  const handleGoogleLogin = () => {

  }

  const handleNaverLogin = () => {

  }

  const handleKakaoLogin = () => {

  }
  
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-[100dvh] pt-10 pb-33 text-white">
        <div className="H0 text-white w-fit flex justify-center items-center p-9">
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
          <div className="flex justify-between items-center mb-4 text-[12px]">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                className="appearance-none w-[12px] h-[12px] rounded-[3px] border-[0.79px] border-gray-500 bg-transparent checked:bg-gray-800 checked:border-transparent focus:ring-0 focus:ring-offset-0"
              /> {/* CheckIcon 필요 */}
              <div>아이디 저장</div>
            </div>
            <div className="cursor-pointer hover:underline">
              비밀번호를 잊어버리셨나요? 
            </div>
          </div>
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
            onClick={handleLoginSubmit}
            disabled={isDisabled}
          >
            로그인하기
          </button>
        </div>
        <div className="border-gray-800 border-t mt-4 mb-2 w-[339px]"/>
        <div className="text-gray-500 text-[11.64px] p-4">간편로그인하기</div>
        <div className="flex gap-2">
          <button
            onClick={handleGoogleLogin}
          >
            <Google_G_logo />
          </button>
          <button
            onClick={handleNaverLogin}
          >
            <Naver_logo />
          </button>
          <button
            onClick={handleKakaoLogin}
          >
            <KakaoTalk_logo />
          </button>
        </div>
        <footer className="absolute bottom-0 w-full flex justify-center gap-1 text-[12px] pb-[env(safe-area-inset-bottom)]">
          <p className="text-gray-500">아이디가 없나요?</p>
          <NavLink
            key='/signup'
            to='/signup'
            className={"text-gray-100 underline"}
          >
            회원가입하기
          </NavLink>
        </footer>
      </div>
    </>
  )
}

export default LoginPage
