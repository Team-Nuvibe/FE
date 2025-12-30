import { useEffect, useState, type ChangeEvent } from "react";

interface UseFormProps<T> {
  initialValues: T; // {email: '', password: ''}

  // T에 대한 key값을 받고 그것에 대한 value는 string인지,
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
  const [values, setValues] = useState(initialValues);

  const [touched, setTouched] = useState<Record<string, boolean>>();
  // {"email": false, "password": true}

  const [errors, setErrors] = useState<Record<string, string>>();
  // { "이메일은 반드시 @를 포함해야 합니다." "email"}

  // 사용자가 입력 값을 업데이트 할 때 실행되는 함수
  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values, // 불변성 유지( 기존 값 유지)
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  // 이메일 인증, 패스워드 인증, 속성들을 가져오는 것
  const getInputProps = (name: keyof T) => {
    const value = values[name];

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  // values가 변경될 때 마다 에러 검증 로직이 실행되어야함
  // {email: ""} => {email: "이메일은 반드시 @를 포함해야 합니다."}

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors); // 오류 메시지 업데이트
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;
