interface InputBoxProps {
  type : string;
  placeholder : string;
}


const InputBox = ({type, placeholder} :InputBoxProps) => {
  return (
    <input 
      type={type}
      placeholder={placeholder}
      className="
        w-[339px] h-[48px] 
        rounded-[5px]
        pl-[15px] pr-[8px] py-[8px]
        focus:border outline-none focus:border-gray-300
        bg-gray-800
        "
    />
  )
}

export default InputBox
