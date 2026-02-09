import { useNavigate } from "react-router-dom";
import IconQuickDrop from "../../assets/icons/icon_quickdrop.svg?react";
import { useRef } from "react";

const QuickDropButton = () => {
  const navigate = useNavigate();

  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("파일을 선택하지 않았습니다.");
      return;
    }
    navigate("/quickdrop", { state: { file } });
  };

  return (
    <button
      className="z-50 flex h-16.25 w-16.25 shrink-0 cursor-pointer flex-col items-center justify-center rounded-[40px] bg-gray-900/90 pt-1.5 px-2 pb-1.75 backdrop-blur-[20px] transition-transform border-t border-gray-800 shadow-[0_0_32px_0_rgba(18,18,18,0.5)]"
      aria-label="Quick Drop"
      onClick={() => inputImageRef.current?.click()}
    >
      <IconQuickDrop className="h-10 w-10" />      
      <input
        type="file"
        className="hidden"
        accept="image/*"
        ref={inputImageRef}
        onChange={handleImageChange}
      />
    </button>
  );
};

export default QuickDropButton;
