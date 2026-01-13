import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import IconFolder from "@/assets/icons/icon_folder.svg?react";
import IconChevronRightWhite from "@/assets/icons/icon_chevron_right_white.svg?react";
import IconQuickdropAdd from "@/assets/icons/icon_quickdrop_add.png";
import IconSelectImage from "@/assets/icons/icon_select_image.svg?react";
import IconSearch from "@/assets/icons/icon_search.svg?react";
import { useNavigate } from "react-router-dom";
import Union from "@/assets/icons/Union.svg?react";
import { useState } from "react";

import Img1 from "@/assets/images/img_temp1.png";
import Img2 from "@/assets/images/img_temp2.png";
import Img9 from "@/assets/images/img_temp9.png";
import { AddBoardModal } from "../quickdrop/AddBoardModal";

interface BoardSelectorProps {
  image: Blob | null;
  tag: string;
  onNext: (selectedBoard: Board) => void;
  onPrevious: () => void;
}

// TODO: 인터페이스 따로 빼야 함
interface Board {
  id: number;
  name: string;
  createdAt: string;
  thumbnailUrl: string;
  tagCount: number;
}

export const BoardSelector = ({
  image,
  tag,
  onNext,
  onPrevious,
}: BoardSelectorProps) => {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [showingSavedBoards, setShowingSavedBoards] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 임시 보드 데이터
  const [boards, setBoards] = useState<Board[]>([
    {
      id: 1,
      name: "가나다라마바사아자차카타파하",
      createdAt: "2026. 01. 03",
      thumbnailUrl: image ? URL.createObjectURL(image) : "",
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
      thumbnailUrl: image ? URL.createObjectURL(image) : "",
      tagCount: 12,
    },
    {
      id: 4,
      name: "텔리의 집",
      createdAt: "2026. 01. 03",
      thumbnailUrl: image ? URL.createObjectURL(image) : "",
      tagCount: 12,
    },
    {
      id: 5,
      name: "구디의 집",
      createdAt: "2026. 01. 03",
      thumbnailUrl: image ? URL.createObjectURL(image) : "",
      tagCount: 12,
    },
  ]);

  const handleAddBoard = (boardName: string) => {
    const newBoard: Board = {
      id: boards.length + 1,
      name: boardName,
      createdAt: "2026. 01. 13",
      thumbnailUrl: URL.createObjectURL(image!),
      tagCount: 0,
    };
    setBoards([newBoard, ...boards]);
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      {!showingSavedBoards && (
        <>
          <header className="flex justify-between items-center pt-2 pb-6 px-4 tracking-tight">
            <IconXbuttonGray3
              className="cursor-pointer"
              onClick={() => onPrevious()}
            />
            <h2 className="H2 text-white">바이브 드랍</h2>
            <p
              className={`ST2 ${
                selectedBoard
                  ? "text-white cursor-pointer"
                  : "text-gray-700 cursor-not-allowed"
              }`}
              onClick={() => onNext(selectedBoard!)}
            >
              완료
            </p>
          </header>
          <div className="relative w-[360px] h-[480px] mx-auto mb-6 H1">
            <img
              src={image ? URL.createObjectURL(image) : ""}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 40%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 40%, transparent 100%)",
              }}
            />
            <h1 className="absolute bottom-0 tracking-tight left-0 z-10 text-[28px] bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text text-transparent">
              #{tag}
            </h1>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex mx-4">
              <h2 className="H2 text-gray-200 tracking-tight">
                저장할 아카이브 보드
              </h2>
              <div
                className="flex justify-center items-center ml-3 cursor-pointer"
                onClick={() => setShowingSavedBoards(true)}
              >
                <IconChevronRightWhite />
              </div>
            </div>
            <div className="flex gap-[10px] ml-4 overflow-x-auto">
              <img
                src={IconQuickdropAdd}
                alt=""
                className="w-[110px] cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              {boards.map((board) => (
                <div
                  className={`relative w-[110px] h-[110px] shrink-0 rounded-[5px] border-[0.5px] border-gray-700 bg-gray-900 overflow-hidden cursor-pointer`}
                  onClick={() => setSelectedBoard(board)}
                >
                  {/* 이미지 레이어 */}
                  <img
                    src={board.thumbnailUrl}
                    alt="thumbnail"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] object-cover"
                  />
                  {/* 폴더 오버레이 */}
                  <Union className="absolute bottom-0 translate-y-[0.5px] left-0 z-10 w-full pointer-events-none" />
                  <div className="flex flex-col justify-between z-20 absolute inset-0 text-white">
                    <p className="pt-11 pr-[6px] text-[6px] text-right">
                      {board.createdAt}
                    </p>
                    <div className="flex justify-between items-end px-[6px] pb-[10px] ST2 tracking-tight z-30">
                      <p className="text-white text-[10px] w-[70px]">
                        {board.name}
                      </p>
                      <p className="text-gray-300 text-[7px]">
                        {board.tagCount} 태그
                      </p>
                    </div>
                  </div>
                  {selectedBoard?.id === board.id && (
                    <>
                      <div className="absolute w-full h-full bg-white opacity-50 cursor-pointer z-20" />
                      <IconSelectImage className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-[42px] h-[42px]" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {showingSavedBoards && (
        <>
          <header className="flex justify-between items-center pt-2 pb-6 px-4 tracking-tight">
            <IconXbuttonGray3
              className="cursor-pointer"
              onClick={() => setShowingSavedBoards(false)}
            />
            <h2 className="H2 text-white">저장할 아카이브 보드</h2>
            <p
              className={`ST2 ${
                selectedBoard
                  ? "text-white cursor-pointer"
                  : "text-gray-700 cursor-not-allowed"
              }`}
              onClick={() => onNext(selectedBoard!)}
            >
              완료
            </p>
          </header>
          <div className="flex items-center mx-4 mb-5 h-12 rounded-[5px] bg-gray-900">
            <IconSearch className="ml-4 mr-3" />
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              className="B1 tracking-tight focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-3">
            {boards.map((board) => (
              <div className="flex flex-col mx-4 gap-[10px]">
                <div className="flex items-center gap-6">
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
                  <div className="flex flex-col gap-2 text-gray-100 tracking-tight">
                    <h3 className="H3">{board.name}</h3>
                    <p className="B2">{board.tagCount}개 태그</p>
                  </div>
                </div>
                <div className="w-full h-[0.5px] bg-gray-900" />
              </div>
            ))}
            <div className="mx-4 w-full h-[0.5px] bg-gray-900" />
            <div className="mx-4 w-full h-[0.5px] bg-gray-900" />
          </div>
        </>
      )}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-w-[393px] mx-auto">
            <AddBoardModal
              onClose={() => setIsModalOpen(false)}
              onAdd={handleAddBoard}
            />
          </div>
        </>
      )}
    </div>
  );
};
