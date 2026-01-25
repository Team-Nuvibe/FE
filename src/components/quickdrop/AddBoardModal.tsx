import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import { useState } from "react";

interface AddBoardModalProps {
  onClose: () => void;
  onAdd: (boardName: string) => void;
}

export const AddBoardModal = ({ onClose, onAdd }: AddBoardModalProps) => {
  const [boardNameInput, setBoardNameInput] = useState("");

  const handleChangeNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 15) return;
    setBoardNameInput(e.target.value);
  };

  const handleSubmit = () => {
    if (boardNameInput.length === 0) return;
    onAdd(boardNameInput);
  };

  return (
    <div className="flex flex-col rounded-t-[25px] h-[288px] bg-gray-900 tracking-tight">
      <div className="relative mt-6 mb-8 mx-4 flex justify-center items-center">
        <h2 className="H2 text-gray-200">아카이브 보드 추가</h2>
        <IconXbuttonGray3
          className="absolute left-0 cursor-pointer"
          onClick={onClose}
        />
      </div>
      <div className="flex justify-between items-center mx-4 bg-gray-700 rounded-[5px] p-4 mb-4">
        <input
          type="text"
          placeholder="추가할 보드명을 입력해주세요."
          className="B1 text-gray-100 focus:outline-none"
          value={boardNameInput}
          onChange={handleChangeNameInput}
          maxLength={15}
        />
        <p
          className={`font-normal text-[12px] ${
            boardNameInput.length === 0 ? "text-gray-400" : "text-white"
          }`}
        >
          ({boardNameInput.length}/15)
        </p>
      </div>
      <div
        className={`flex justify-center items-center rounded-[5px] mx-4 p-4 ${
          boardNameInput.length === 0
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gray-200 cursor-pointer"
        }`}
        onClick={handleSubmit}
      >
        <p className={`H4 text-gray-900`}>추가하기</p>
      </div>
    </div>
  );
};
