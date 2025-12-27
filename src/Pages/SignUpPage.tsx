import NuvibeLogo from '../assets/icons/nuvibe_logo.svg?react';
import { BackButton } from '../components/BackButton';

const SignUpPage = () => {
  return (
    <>
      <div className="relative flex flex-col justify-center items-center min-h-screen w-full text-white">
        <BackButton className="absolute top-[60.82px] left-[30.42px] z-50 p-2 "/>
        <div className="mb-12">
          <NuvibeLogo className="w-[130.3px] h-[25.4px]" />
        </div>
        <div className="flex flex-col gap-[10px] mb-9">
          <input 
            type="name"
            placeholder="이름"
            className="
              w-[339px] h-[48px] 
              rounded-[5px]
              pl-[15px] pr-[8px] py-[8px]
              focus:border outline-none focus:border-gray-300
              bg-gray-800
            "
          />
          <input 
            type="email"
            placeholder="이메일"
            className="
              w-[339px] h-[48px] 
              rounded-[5px]
              pl-[15px] pr-[8px] py-[8px]
              focus:border outline-none focus:border-gray-300
              bg-gray-800
            "
          />
          <input 
            type="password"
            placeholder="비밀번호"
            className="
              w-[339px] h-[48px] 
              rounded-[5px]
              pl-[15px] pr-[8px] py-[8px]
              focus:border outline-none focus:border-gray-300
              bg-gray-800
            "
          />
          <input 
            type="password"
            placeholder="비밀번호 확인"
            className="
              w-[339px] h-[48px] 
              rounded-[5px]
              pl-[15px] pr-[8px] py-[8px]
              focus:border outline-none focus:border-gray-300
              bg-gray-800
            "
          />
          <input 
            type="text"
            placeholder="닉네임"
            className="
              w-[339px] h-[48px] 
              rounded-[5px]
              pl-[15px] pr-[8px] py-[8px]
              focus:border outline-none focus:border-gray-300
              bg-gray-800
            "
          />
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
          >
            회원가입
          </button>
      </div>
    </>
  )
}

export default SignUpPage
