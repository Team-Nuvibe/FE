import { useNavigate } from 'react-router';
import NuvibeLogo from '../assets/icons/nuvibe_logo.svg?react';
import { BackButton } from '../components/Login_Signup/BackButton';
import InputBox from '../components/Login_Signup/InputBox';

const SignUpPage = () => {

  const navigate = useNavigate();

  const handleSignupSubmit = () => {
    navigate('/login')
  }
  return (
    <>
      <div className="relative flex flex-col justify-center items-center min-h-[100dvh] w-full text-white">
        <BackButton className="absolute top-[60.82px] left-[30.42px] z-50 p-2 "/>
        <div className="mb-12">
          <NuvibeLogo className="w-[130.3px] h-[25.4px]" />
        </div>
        <div className="flex flex-col gap-[10px] mb-9">
          <InputBox type="name" placeholder="이름" />
          <InputBox type="email" placeholder="이메일" />
          <InputBox type="password" placeholder="비밀번호" />
          <InputBox type="password" placeholder="비밀번호 확인" />
          <InputBox type="text" placeholder="닉네임" />
        </div>
        <button 
            className="
              w-[339px] h-[48px]
              rounded-[5px]
              gap-[8px]
              flex justify-center items-center
              bg-white text-black
              H4
            "
            onClick={handleSignupSubmit}
          >
            회원가입
          </button>
      </div>
    </>
  )
}

export default SignUpPage
