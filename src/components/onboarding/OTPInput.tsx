import { useRef, useState, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
}

const OTPInput = ({ length = 6, onComplete }: OTPInputProps) => {
  // 6개의 입력값을 저장하는 배열
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  // 각 인풋의 focus를 제어하기 위한 ref 배열
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 첫 번째 칸에 자동 포커스 (선택 사항)
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // 숫자가 아니면 무시

    const newOtp = [...otp];
    // 입력된 값의 마지막 글자만 가져옴 (한 칸에 하나만)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // 코드가 완성되었는지 확인하여 부모에게 전달
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // 값이 입력되었고, 마지막 칸이 아니라면 다음 칸으로 포커스 이동
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // 백스페이스를 눌렀을 때
    if (e.key === "Backspace") {
      // 현재 칸이 비어있고, 첫 번째 칸이 아니라면 이전 칸으로 이동
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // 붙여넣기 기능 (ex: 123456을 복사해서 붙여넣으면 자동 채움)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return; // 숫자가 아니면 무시

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    onComplete(newOtp.join(""));

    // 마지막 입력된 곳으로 포커스
    const lastFilledIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((_, index) => (
        <div key={index} className={`relative ${index === 2 ? "mr-2" : ""}`}>
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric" // 모바일에서 숫자 키패드 뜨게 함
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="focus:bg-gray-750 h-[50px] w-[45px] rounded-lg border border-gray-700 bg-gray-800 text-center text-[24px] font-semibold text-white transition-all focus:border-gray-500 focus:outline-none"
          />
        </div>
      ))}
    </div>
  );
};

export default OTPInput;
