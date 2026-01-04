import Icon_quickdrop_close from "@/assets/icons/icon_quickdrop_close.svg?react";
import { useNavigate } from "react-router";

export const QuickdropPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-full h-dvh">
      <div className="flex justify-between items-center py-4 px-4">
        <Icon_quickdrop_close
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h2 className="H2 text-white">Vibe Drop</h2>
        <p className="ST2 text-white cursor-pointer">다음</p>
      </div>
    </div>
  );
};
