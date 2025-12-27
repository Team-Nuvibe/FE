// import useForm from "../hooks/useForm";
// import { validateSignin, type UserSigninInformation } from "../utils/validate";

const LoginPage = () => {

  // const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
  //       initialValues: {
  //           email: "",
  //           password: "",
  //       },
  //       validate: validateSignin
  //   })

  // const isDisabled = 
  //       Object.values(errors || {}).some((error)=>error.length > 0) || // 오류 있으면 true
  //       Object.values(values).some((value)=> value === ""); // 입력 값 비어있으면 true
  
  // const handleLoginSubmit = () => {
  //       // api 통신
  //   }
  
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen text-white">
        <div className="H0 text-white w-fit flex justify-center items-center p-9">
          Start nuvibe
        </div>
        <div className="flex flex-col gap-3">
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
          <div className="flex justify-between items-center mb-4 text-[12px]">
            <div className="flex items-center gap-2">
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
            "
          >
            로그인하기
          </button>
        </div>
        <div className="p-4 flex flex-col justify-center items-center">
          <div className="border-gray-800 border-t p-2 mt-2 w-[339px]"/>
          <div className="text-gray-500 text-[11.64px]">간편로그인하기</div>
        </div>
        <footer className="text-[12px] absolute top-[745px] left-[124px]">아이디가 없나요? 회원가입 하기</footer>
      </div>
    </>
  )
}

export default LoginPage
