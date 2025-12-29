interface InputBoxProps {
  type : string;
  placeholder : string;
  hasError? : boolean;
  className? : string;
  errorMessage? : string;
  guideText? : string; 
}


const InputBox = ({type, placeholder, hasError, className, errorMessage, guideText, ...props} :InputBoxProps) => {
  return (
    <div className="relative w-[339px] h-[48px]">
      <input
        type={type}
        {...props}
        placeholder=" "
        className={`
          peer
          w-full h-full
          rounded-[5px]
          pl-[15px] 
          ${hasError ? "pr-[100px]" : "pr-[8px]"} /* 에러 있으면 오른쪽 여백을 늘려서 글자 겹침 방지 */
          py-[8px]
          outline-none
          border
          transition-colors
          text-white
          placeholder-gray-500
          ${ /* 에러 상태 디자인*/
            hasError 
              ? "border-gray-300 bg-gray-800" 
              : "border-transparent bg-gray-800 focus:border-gray-300"
          }
          ${className}
        `}
      />
      {!hasError && (
        <div 
          className="
            absolute left-[15px] top-1/2 -translate-y-1/2
            pointer-events-none 
            hidden peer-placeholder-shown:flex peer-focus:hidden
            items-center gap-2
            text-gray-500
            "
          >
          {/* 메인 Placeholder */}
          <span className="text-[16px] text-gray-300">{placeholder}</span>
            
          {/* 보조 가이드 텍스트 */}
          {guideText && (
            <span className="text-[10px] text-gray-600 mt-[1px]">
              {guideText}
            </span>
          )}
        </div>
      )}
      {/* 에러 메시지 */}
      {hasError && (
        <span 
          className="
            absolute right-[12px] top-1/2 -translate-y-1/2
            text-white text-[10px] font-normal
            pointer-events-none
            "
        >
          {errorMessage}
        </span>
      )}
    </div>
  )
}

export default InputBox
