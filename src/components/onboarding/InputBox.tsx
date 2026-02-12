interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  hasError?: boolean;
  errorMessage?: string;
  guideText?: string;
  rightElement?: React.ReactNode;
}

const InputBox = ({
  type,
  placeholder,
  hasError,
  className,
  errorMessage,
  guideText,
  rightElement,
  ...props
}: InputBoxProps) => {
  return (
    <div className="relative flex flex-col gap-1">
      <div
        className={`relative flex h-[48px] w-full max-w-[393px] items-center justify-between rounded-[5px] border bg-gray-900 p-3 transition-colors ${
          hasError ? "border-gray-300" : "border-transparent"
        }`}
      >
        <input
          type={type}
          {...props}
          placeholder=" "
          className={`peer min-w-0 flex-1 bg-transparent text-[16px] leading-[1.5] font-medium tracking-[-0.4px] text-gray-100 outline-none placeholder:text-gray-500 ${
            className || ""
          }`}
        />
        {rightElement}

        {/* Placeholder with guide text */}
        {!hasError && (
          <div className="pointer-events-none absolute top-1/2 left-3 hidden -translate-y-1/2 items-center gap-2 text-gray-500 peer-placeholder-shown:flex peer-focus:hidden">
            {/* 메인 Placeholder */}
            <span className="B1 leading-[150%] tracking-[-0.4px] text-gray-600">
              {placeholder}
            </span>

            {/* 보조 가이드 텍스트 */}
            {guideText && (
              <span className="mt-[1px] text-[10px] text-gray-600">
                {guideText}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {hasError && errorMessage && (
        <p className="letter-spacing-[-0.25px] pt-2 text-xs leading-[150%] font-normal tracking-[-0.3px] text-white">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default InputBox;
