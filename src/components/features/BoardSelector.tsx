import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import IconChevronRightWhite from "@/assets/icons/icon_chevron_right_white.svg?react";
import IconSearch from "@/assets/icons/icon_search.svg?react";
import IconChevronLeft from "@/assets/icons/icon_chevron_left.svg?react";
import IconBoardDefault from "@/assets/icons/icon_board_default.svg?react";
import IconFolderVibedrop from "@/assets/icons/icon_folder_vibedrop.svg?react";
import IconPlus from "@/assets/icons/icon_plus.svg?react";
import SelectedImageIcon from "@/assets/icons/icon_select_image.svg?react";
import Icon_folder from "@/assets/icons/icon_folder2.svg?react";
import { useState, useEffect } from "react";
import {
  getArchiveList,
  createArchiveBoard,
} from "@/apis/archive-board/archive";
import { BoardBottomSheet } from "../archive-board/BoardBottomSheet";

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

        if (response.data) {
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
          thumbnailUrl: "",
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
              onClick={() => {
                if (selectedBoard) {
                  onNext(selectedBoard!);
                }
              }}
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
              <div
                onClick={() => setIsModalOpen(true)}
                className={`flex w-[110px] shrink-0 cursor-pointer flex-col items-center gap-2 transition-all`}
              >
                {/* 폴더 컨테이너 */}
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[5px] border-[0.5px] border-gray-700 bg-[#212224]/80">
                  {/* 내부 이미지 (썸네일) */}

                  <div className="absolute top-2 left-1/2 h-[94px] w-[71px] -translate-x-1/2 rounded-[3px] border-[1px] border-dashed border-gray-700 bg-gray-800" />

                  {/* 폴더 오버레이 아이콘 */}
                  <Icon_folder className="pointer-events-none absolute bottom-0 left-0 z-10 h-auto w-full scale-y-[150%] rounded-[5px]" />
                  <IconPlus className="absolute top-[50px] left-1/2 z-20 h-[21px] w-[21px] -translate-x-1/2" />
                </div>
              </div>
              {boards.map((board) => (
                <div
                  key={board.id}
                  onClick={() => setSelectedBoard(board)}
                  className={`flex w-[110px] shrink-0 cursor-pointer flex-col items-center gap-2 transition-all`}
                >
                  {/* 폴더 컨테이너 */}
                  <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[5px] border-[0.5px] border-gray-700 bg-[#212224]/80">
                    {/* 내부 이미지 (썸네일) */}
                    {board.thumbnailUrl ? (
                      <img
                        src={board.thumbnailUrl}
                        alt="thumbnail"
                        className="absolute top-2 left-1/2 w-[71px] -translate-x-1/2 rounded-[3px] object-cover"
                      />
                    ) : (
                      <div className="absolute top-2 left-1/2 h-[94px] w-[71px] -translate-x-1/2 rounded-[3px] border-[1px] border-dashed border-gray-700 bg-gray-800" />
                    )}

                    {/* 폴더 오버레이 아이콘 */}
                    <Icon_folder className="pointer-events-none absolute bottom-0 left-0 z-10 h-auto w-full" />

                    {/* 폴더 제목 (하단) */}
                    <div className="absolute right-[6px] bottom-[10px] left-[6.39px] z-20 flex justify-between gap-[6px] tracking-tight">
                      <p className="line-clamp-2 text-[10px] font-normal text-white">
                        {board.name}
                      </p>
                      {/* 보드 내의 태그 갯수 */}
                      <p className="flex shrink-0 items-end text-[7px] font-normal text-gray-300">
                        {board.tagCount} 태그
                      </p>
                    </div>

                    {/* 체크표시 */}

                    <div
                      className={`absolute inset-0 z-30 flex items-center justify-center transition-colors ${
                        selectedBoard === board
                          ? "bg-white/30"
                          : "bg-transparent"
                      }`}
                    >
                      {selectedBoard === board && (
                        <SelectedImageIcon className="h-[32px] w-[32px]" />
                      )}
                    </div>
                  </div>
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
          <div className="mx-4 flex flex-col">
            {boards.map((board) => (
              <div className="flex flex-col gap-3 pt-3" key={board.id}>
                <div
                  className="flex cursor-pointer items-center gap-4 px-[10px]"
                  onClick={() => setSelectedBoard(board)}
                >
                  <div
                    key={board.id}
                    className={`flex w-[70px] shrink-0 cursor-pointer flex-col items-center gap-2 transition-all`}
                  >
                    {/* 폴더 컨테이너 */}
                    <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[5px] border-[0.5px] border-gray-700 bg-[#212224]/80">
                      {/* 내부 이미지 (썸네일) */}
                      {board.thumbnailUrl ? (
                        <img
                          src={board.thumbnailUrl}
                          alt="thumbnail"
                          className="absolute top-2 left-1/2 w-[45px] -translate-x-1/2 rounded-[3px] object-cover"
                        />
                      ) : (
                        <div className="absolute top-2 left-1/2 h-[60px] w-[45px] -translate-x-1/2 rounded-[3px] border-[1px] border-dashed border-gray-700 bg-gray-800" />
                      )}

                      {/* 폴더 오버레이 아이콘 */}
                      <Icon_folder className="pointer-events-none absolute bottom-0 left-0 z-10 h-auto w-full" />
                      {/* 체크표시 */}

                      <div
                        className={`absolute inset-0 z-30 flex items-center justify-center transition-colors ${
                          selectedBoard === board
                            ? "bg-white/30"
                            : "bg-transparent"
                        }`}
                      >
                        {selectedBoard === board && (
                          <SelectedImageIcon className="h-[32px] w-[32px]" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col leading-[150%] tracking-tight text-gray-100">
                    <h3 className="H4">{board.name}</h3>
                    <p className="B1">{board.tagCount}개 태그</p>
                  </div>
                </div>
                <div className="h-[0.5px] w-full bg-gray-700" />
              </div>
            ))}
          </div>
        </>
      )}
      <BoardBottomSheet
        isOpen={isModalOpen}
        initialTitle=""
        toptext="아카이브 보드 추가"
        buttontext="추가하기"
        placeholderText="추가할 보드명을 입력해주세요."
        onClose={() => setIsModalOpen(false)}
        onClick={handleAddBoard}
      />
    </div>
  );
};
