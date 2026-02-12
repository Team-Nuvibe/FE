import { useEffect } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetFocus,
  FieldPath,
} from "react-hook-form";
import InputBox from "../InputBox";
import VerifiedIcon from "@/assets/icons/icon_checked_24.svg?react";
import EyeOnIcon from "@/assets/icons/icon_eye_on.svg?react";
import EyeOffIcon from "@/assets/icons/icon_eye_off.svg?react";
import { useState } from "react";

interface PasswordStepProps<T extends Record<string, any>> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  isPasswordValid: () => boolean;
  isPasswordCheckValid: () => boolean;
  setFocus: UseFormSetFocus<T>;
}

const PasswordStep = <T extends Record<string, any>>({
  register,
  errors,
  isPasswordValid,
  isPasswordCheckValid,
  setFocus,
}: PasswordStepProps<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [isPasswordCheckVisible, setIsPasswordCheckVisible] = useState(false);
  const [isPasswordCheckFocused, setIsPasswordCheckFocused] = useState(false);

  useEffect(() => {
    setFocus("password" as FieldPath<T>);
  }, [setFocus]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
          비밀번호
        </div>
        <InputBox
          {...register("password" as FieldPath<T>)}
          type={isPasswordVisible ? "text" : "password"}
          placeholder="8~20자의 영문, 숫자, 특수문자를 조합해 주세요."
          hasError={!!errors?.password}
          errorMessage={errors.password?.message as string}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          rightElement={
            <div className="flex h-6 w-6 items-center justify-center">
              {isPasswordValid() && !errors?.password && !isPasswordFocused ? (
                <VerifiedIcon />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss on click
                >
                  {isPasswordVisible ? <EyeOnIcon /> : <EyeOffIcon />}
                </button>
              )}
            </div>
          }
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="B2 flex leading-[150%] tracking-[-0.35px] text-gray-300">
          비밀번호 확인
        </div>
        <InputBox
          {...register("passwordCheck" as FieldPath<T>)}
          type={isPasswordCheckVisible ? "text" : "password"}
          placeholder="동일한 비밀번호를 입력해주세요."
          hasError={!!errors?.passwordCheck}
          errorMessage={errors.passwordCheck?.message as string}
          onFocus={() => setIsPasswordCheckFocused(true)}
          onBlur={() => setIsPasswordCheckFocused(false)}
          rightElement={
            <div className="flex h-6 w-6 items-center justify-center">
              {isPasswordCheckValid() &&
              !errors?.passwordCheck &&
              !isPasswordCheckFocused ? (
                <VerifiedIcon />
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setIsPasswordCheckVisible(!isPasswordCheckVisible)
                  }
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                >
                  {isPasswordCheckVisible ? <EyeOnIcon /> : <EyeOffIcon />}
                </button>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default PasswordStep;
