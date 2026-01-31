import { useLocation, useNavigate } from "react-router-dom";
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
      className="z-50 flex h-[65px] w-[65px] cursor-pointer items-center justify-center rounded-[40px] bg-[var(--color-gray-900)]/90 transition-transform"
      aria-label="Quick Drop"
    >
      <IconQuickDrop
        className="h-full w-full"
        onClick={() => inputImageRef.current?.click()}
      />
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
