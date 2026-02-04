import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import IconChevronRightWhite from "@/assets/icons/icon_chevron_right_white.svg?react";
import IconQuickdropAdd from "@/assets/icons/icon_quickdrop_add.svg";
import IconSelectImage from "@/assets/icons/icon_select_image.svg?react";
import IconSearch from "@/assets/icons/icon_search.svg?react";
import IconChevronLeft from "@/assets/icons/icon_chevron_left.svg?react";
import IconBoardDefault from "@/assets/icons/icon_board_default.svg?react";
import Union from "@/assets/icons/Union.svg?react";
import { useState, useEffect } from "react";
import Img1 from "@/assets/images/img_temp1.png";
import { AddBoardModal } from "../quickdrop/AddBoardModal";
import {
  getArchiveList,
  createArchiveBoard,
} from "@/apis/archive-board/archive";

interface BoardSelectorProps {
  image: Blob | null;
  imageUrl: string | null;
  tag: string;
  onNext: (selectedBoard: Board) => void;
  onPrevious: () => void;
}

// TODO: 인터페이스 따로 빼야 함
interface Board {
  id: number;
  name: string;
  thumbnailUrl: string;
  tagCount: number;
}

export const BoardSelector = ({
  imageUrl,
  tag,
  onNext,
  onPrevious,
}: BoardSelectorProps) => {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [showingSavedBoards, setShowingSavedBoards] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 아카이브 보드 목록
  const [boards, setBoards] = useState<Board[]>([]);

  // 아카이브 목록 조회 API 이용해 데이터 가져오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await getArchiveList();
        console.log(response);

        if (response.data) {
          console.log(response.data);
          const mappedBoards: Board[] = response.data.map((board) => ({
            id: board.boardId,
            name: board.name,
            thumbnailUrl: board.thumbnailUrl || "",
            tagCount: board.tagCount || 0,
          }));

          setBoards(mappedBoards);
        } else {
          console.warn("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch archive boards:", error);
      }
    };

    fetchBoards();
  }, [imageUrl]);

  const handleAddBoard = async (boardName: string) => {
    if (!boardName || boardName.trim() === "") return;

    try {
      const response = await createArchiveBoard(boardName.trim());

      if (response.data) {
        const newBoard: Board = {
          id: response.data.boardId,
          name: response.data.name,
          thumbnailUrl: imageUrl || "",
          tagCount: 0,
        };
        setBoards([newBoard, ...boards]);
      }
    } catch (error) {
      console.error("Failed to create archive board:", error);
      // TODO: 사용자에게 에러 메시지 표시
      alert("보드 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="relative">
      {!showingSavedBoards && (
        <>
          <header className="flex items-center justify-between px-4 pt-2 pb-6 tracking-tight">
            <IconChevronLeft
              className="cursor-pointer"
              onClick={() => onPrevious()}
            />
            <h2 className="H2 text-white">바이브 드랍</h2>
            <p
              className={`ST2 ${
                selectedBoard
                  ? "cursor-pointer text-white"
                  : "cursor-not-allowed text-gray-700"
              }`}
              onClick={() => onNext(selectedBoard!)}
            >
              완료
            </p>
          </header>
          <div className="H1 relative mx-auto mb-6 h-[480px] w-[360px]">
            <img
              src={imageUrl || ""}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 40%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 40%, transparent 100%)",
              }}
            />
            <h1 className="absolute bottom-0 left-0 z-10 bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text text-[28px] tracking-tight text-transparent">
              #{tag[0] + tag.slice(1).toLowerCase()}
            </h1>
          </div>
          <div className="flex flex-col gap-3">
            <div className="mx-4 flex">
              <h2 className="H2 tracking-tight text-gray-200">
                저장할 아카이브 보드
              </h2>
              <div
                className="ml-3 flex cursor-pointer items-center justify-center"
                onClick={() => setShowingSavedBoards(true)}
              >
                <IconChevronRightWhite />
              </div>
            </div>
            <div className="ml-4 flex gap-[10px] overflow-x-auto">
              <img
                src={IconQuickdropAdd}
                alt=""
                className="h-[110px] w-[110px] cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
              {boards.map((board) => (
                <div
                  key={board.id}
                  className={`relative h-[110px] w-[110px] shrink-0 cursor-pointer overflow-hidden rounded-[5px] border-[0.5px] border-gray-700 bg-gray-900`}
                  onClick={() => setSelectedBoard(board)}
                >
                  {board.thumbnailUrl && (
                    <>
                      {/* 이미지 레이어 */}
                      <img
                        src={board.thumbnailUrl}
                        alt="thumbnail"
                        className="absolute top-1/2 left-1/2 w-[70px] -translate-x-1/2 -translate-y-1/2 object-cover"
                      />
                      {/* 폴더 오버레이 */}
                      <Union
                        className="pointer-events-none absolute bottom-0 left-0 z-20 h-full w-full translate-y-[0.5px]"
                        preserveAspectRatio="xMinYMax meet"
                      />
                    </>
                  )}
                  {board.thumbnailUrl === "" && (
                    <IconBoardDefault className="h-[110px] w-[110px] cursor-pointer" />
                  )}

                  <div className="absolute inset-0 z-20 flex flex-col justify-end text-white">
                    <div className="ST2 z-30 flex items-end justify-between px-[6px] pb-[10px] tracking-tight">
                      <p className="w-[70px] text-[10px] text-white">
                        {board.name}
                      </p>
                      <p className="text-[7px] text-gray-300">
                        {board.tagCount} 태그
                      </p>
                    </div>
                  </div>
                  {selectedBoard?.id === board.id && (
                    <>
                      <div className="absolute z-20 h-full w-full cursor-pointer bg-white opacity-50" />
                      <IconSelectImage className="absolute top-1/2 left-1/2 z-40 h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2" />
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
          <header className="flex items-center justify-between px-4 pt-2 pb-6 tracking-tight">
            <IconXbuttonGray3
              className="cursor-pointer"
              onClick={() => setShowingSavedBoards(false)}
            />
            <h2 className="H2 text-white">저장할 아카이브 보드</h2>
            <p
              className={`ST2 ${
                selectedBoard
                  ? "cursor-pointer text-white"
                  : "cursor-not-allowed text-gray-700"
              }`}
              onClick={() => onNext(selectedBoard!)}
            >
              완료
            </p>
          </header>
          <div className="mx-4 mb-5 flex h-12 items-center rounded-[5px] bg-gray-900">
            <IconSearch className="mr-3 ml-4" />
            <input
              type="text"
              placeholder="검색어를 입력하세요."
              className="B1 tracking-tight focus:outline-none"
            />
          </div>
          <div className="mx-4 flex flex-col gap-3">
            {boards.map((board) => (
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-6">
                  <div
                    className={`relative h-[74px] w-[74px] shrink-0 cursor-pointer overflow-hidden rounded-[5px] border-[0.5px] border-gray-700 bg-gray-900`}
                    onClick={() => setSelectedBoard(board)}
                  >
                    {/* 이미지 레이어 */}
                    <img
                      src={board.thumbnailUrl}
                      alt="thumbnail"
                      className="absolute top-1/2 left-1/2 w-[45px] -translate-x-1/2 -translate-y-1/2 object-cover"
                    />
                    {/* 폴더 오버레이 */}
                    <Union
                      className="pointer-events-none absolute bottom-0 left-0 z-10 h-full w-full translate-y-[0.5px]"
                      preserveAspectRatio="xMinYMax meet"
                    />
                    <div className="absolute inset-0 z-20 flex flex-col justify-between text-white" />
                    {selectedBoard?.id === board.id && (
                      <>
                        <div className="absolute z-20 h-full w-full cursor-pointer bg-white opacity-50" />
                        <IconSelectImage className="absolute top-1/2 left-1/2 z-40 h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2" />
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 tracking-tight text-gray-100">
                    <h3 className="H3">{board.name}</h3>
                    <p className="B2">{board.tagCount}개 태그</p>
                  </div>
                </div>
                <div className="h-[0.5px] w-full bg-gray-700" />
              </div>
            ))}
          </div>
        </>
      )}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" />
          <div className="fixed right-0 bottom-0 left-0 z-50 mx-auto max-w-[393px]">
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
