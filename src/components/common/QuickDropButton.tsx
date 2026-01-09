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
    console.log("Selected file:", file);
    navigate("/quickdrop", { state: { file } });
  };

  // 임시: quickdrop에서 숨기기
  const location = useLocation();
  if (location.pathname === "/quickdrop") {
    return null;
  }

  return (
    <button
      className="w-[65px] h-[65px] bg-[var(--color-gray-900)]/90 rounded-[40px] flex items-center justify-center z-50 transition-transform"
      aria-label="Quick Drop"
    >
      <IconQuickDrop className="w-full h-full" />
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        ref={inputImageRef}
        onChange={handleImageChange}
      />
    </button>
  );
};

export default QuickDropButton;
