import { useState } from 'react';
import IconArrowLeft from "@/assets/icons/icon_chevron_left.svg?react";
import IconSearch from "@/assets/icons/icon_search.svg?react";
import IconSelectImage from "@/assets/icons/icon_select_image.svg?react";
import Union from "@/assets/icons/Union.svg?react";

// Mock Data (can be replaced with props or API data)
import Img1 from "@/assets/images/img_temp1.png";

export interface Board {
  id: number;
  name: string;
  createdAt: string;
  thumbnailUrl: string;
  tagCount: number;
}

interface BoardSelectorProps {
  onSelect: (selectedBoard: Board) => void;
  onClose: () => void;
}

export const BoardSelector = ({ onSelect, onClose }: BoardSelectorProps) => {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // 임시 보드 데이터 (Mock)
  const [boards] = useState<Board[]>([
    {
      id: 1,
      name: "가나다라마바사아자차카타파하",
      createdAt: "2026. 01. 03",
      thumbnailUrl: Img1, // Using a placeholder since we don't have the image blob in this context
      tagCount: 12,
    },
    {
      id: 2,
      name: "가나다라마바사아자차카타파하",
      createdAt: "2025. 12. 28",
      thumbnailUrl: Img1,
      tagCount: 8,
    },
    {
      id: 3,
      name: "크리스의 집",
      createdAt: "2026. 01. 03",
      thumbnailUrl: Img1,
      tagCount: 12,
    },
     {
      id: 4,
      name: "텔리의 집",
      createdAt: "2026. 01. 03",
      thumbnailUrl: Img1,
      tagCount: 12,
    },
    {
      id: 5,
      name: "구디의 집",
      createdAt: "2026. 01. 03",
      thumbnailUrl: Img1,
      tagCount: 12,
    },
  ]);

  return (
    <div className="w-full h-full bg-black flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center py-[14px] px-4 shrink-0 h-[56px] mt-6">
        <IconArrowLeft
          className="cursor-pointer"
          onClick={onClose}
        />
        <h2 className="H2 text-white absolute left-1/2 -translate-x-1/2">이미지 이동하기</h2>
        <p
          className={`ST2 ${
            selectedBoard
              ? "text-white cursor-pointer"
              : "text-gray-600 cursor-not-allowed"
          }`}
          onClick={() => selectedBoard && onSelect(selectedBoard)}
        >
          완료
        </p>
      </header>

      {/* Search Bar */}
      <div className="flex items-center mx-4 mb-6 h-12 rounded-[5px] bg-gray-900 shrink-0 mt-3">
        <IconSearch className="ml-4 mr-3" />
        <input
          type="text"
          placeholder="검색어를 입력하세요."
          className="B1 tracking-tight focus:outline-none bg-transparent w-full text-white placeholder-gray-500"
        />
      </div>

      {/* Board List */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pb-10 scrollbar-hide">
        {boards.map((board) => (
          <div key={board.id}>
            <div className="flex flex-col mx-4 gap-[10px]">
              <div className="flex items-center gap-4">
                <div
                  className={`relative w-[74px] h-[74px] shrink-0 rounded-[5px] border-[0.5px] border-gray-700 bg-gray-900 overflow-hidden cursor-pointer`}
                  onClick={() => setSelectedBoard(board)}
                >
                  {/* 이미지 레이어 */}
                  <img
                    src={board.thumbnailUrl}
                    alt="thumbnail"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45px] object-cover"
                  />
                  {/* 폴더 오버레이 */}
                  <Union
                    className="absolute bottom-0 translate-y-[0.5px] left-0 z-10 w-full pointer-events-none"
                    preserveAspectRatio="xMinYMax meet"
                  />
                  <div className="flex flex-col justify-between z-20 absolute inset-0 text-white" />
                  {selectedBoard?.id === board.id && (
                    <>
                      <div className="absolute w-full h-full bg-white opacity-50 cursor-pointer z-20" />
                      <IconSelectImage className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-[42px] h-[42px]" />
                    </>
                  )}
                </div>
                <div className="flex flex-col justify-center gap-[2px] text-gray-100 tracking-tight">
                  <h3 className="H3 text-gray-100">{board.name}</h3>
                  <p className="B2 text-gray-500">{board.tagCount}개 태그</p>
                </div>
              </div>
            </div>
             <div className="mx-4 w-full h-[0.5px] bg-gray-900 mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
};
