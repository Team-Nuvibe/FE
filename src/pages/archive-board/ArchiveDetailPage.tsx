import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BackButton } from "../../components/onboarding/BackButton";
import { useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import EtcButton from "@/assets/icons/icon_etcbutton.svg?react";
import SelectedImageIcon from "@/assets/icons/icon_select_image.svg?react";

// Components
import { CountBottomSheet } from "@/components/archive-board/CountBottomSheet";
import { DeleteConfirmModal } from "@/components/archive-board/DeleteCofirmModal";
import { ArchiveOptionMenu } from "@/components/archive-board/ArchiveOptionMenu";
import { BoardBottomSheet } from "@/components/archive-board/BoardBottomSheet";
import { useNavbarActions } from "@/hooks/useNavbarStore";
import {
  BoardSelector,
  type Board,
} from "@/components/archive-board/BoardSelector";
import { ImageDetailModal } from "@/components/archive-board/ImageDetailModal";

// APIs
import {
  getArchiveBoardDetail,
  deleteArchiveBoardImages,
  updateArchiveBoardName,
} from "@/apis/archive-board/archive";

// Swiper styles
import "swiper/css";

interface ModelItem {
  id: string;
  tag: string;
  thumbnail?: string;
}

const ArchiveDetailPage = () => {
  const { boardid } = useParams<{ boardid: string }>();

  // Title state to allow renaming
  const [boardTitle, setBoardTitle] = useState<string>(boardid || "");

  // Update title if params change (initial load)
  useEffect(() => {
    if (boardid) setBoardTitle(boardid);
  }, [boardid]);

  const [selectedFilter, setSelectedFilter] = useState<string>("최신순");
  const [filters, setFilters] = useState<string[]>(["최신순"]);

  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [isMoveMode, setIsMoveMode] = useState(false); // New: Move mode state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Sheets State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isBoardSelectorOpen, setIsBoardSelectorOpen] = useState(false); // New: Board Selector State
  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<ModelItem | null>(null);

  // Board detail state
  const [allModelItems, setAllModelItems] = useState<ModelItem[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      if (!boardid) return;

      const boardIdNum = parseInt(boardid, 10);
      if (isNaN(boardIdNum)) {
        console.error("Invalid board ID:", boardid);
        return;
      }
      try {
        setIsLoadingDetail(true);
        const response = await getArchiveBoardDetail(boardIdNum);

        if (response.data) {
          console.log("📋 Board detail loaded:", response.data);
          const detail = response.data;

          const mappedItems: ModelItem[] = detail.images.map((img) => ({
            id: String(img.boardImageId),
            tag: img.imageTag,
            thumbnail: img.imageUrl,
          }));

          // Extract unique tags for filters
          const uniqueTags = Array.from(
            new Set(detail.images.map((img) => img.imageTag)),
          );
          setFilters(["최신순", ...uniqueTags]);

          setAllModelItems(mappedItems);
          setBoardTitle(detail.name);
        }
      } catch (error) {
        console.error("Failed to fetch board detail:", error);
      }
    };

    fetchBoardDetail();
  }, [boardid]);

  // Filter Logic
  const modelItems = (() => {
    if (selectedFilter === "최신순") {
      return [...allModelItems].sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    return allModelItems.filter((item) => item.tag === selectedFilter);
  })();

  // Toggle Selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Delete Logic
  const handleDelete = async () => {
    if (!boardid) return;

    try {
      const boardImageIds = selectedIds.map((id) => parseInt(id));
      await deleteArchiveBoardImages(parseInt(boardid), boardImageIds);

      // Update local state after successful deletion
      setAllModelItems((prev) =>
        prev.filter((item) => !selectedIds.includes(item.id)),
      );
      setIsSelectMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to delete images:", error);
      // TODO: Show error toast to user
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // Move Logic
  const handleMoveBoard = () => {
    setIsMenuOpen(false);
    setIsMoveMode(true);
    setIsSelectMode(true);
  };

  const handleOpenBoardSelector = () => {
    if (selectedIds.length > 0) {
      setIsBoardSelectorOpen(true);
    }
  };

  const handleBoardSelect = (targetBoard: Board) => {
    console.log(
      `Moving items ${selectedIds.join(", ")} to board ${targetBoard.name} (ID: ${targetBoard.id})`,
    );
    // TODO: Implement actual move logic API call here

    // Reset states
    setIsBoardSelectorOpen(false);
    setIsSelectMode(false);
    setIsMoveMode(false);
    setSelectedIds([]);
  };

  // Rename Logic
  const handleEditNameSave = async (newTitle: string) => {
    if (!boardid) return;

    try {
      await updateArchiveBoardName(parseInt(boardid), newTitle);
      setBoardTitle(newTitle);
      console.log("Board name updated to:", newTitle);
    } catch (error) {
      console.error("Failed to update board name:", error);
      // TODO: Show error toast to user
    }
  };

  const { setNavbarVisible } = useNavbarActions();

  useEffect(() => {
    // 선택 모드이거나(OR) 수정 모달이 열려있거나(OR) 상세 모달이 열려있으면 네비바를 숨김.
    const shouldHideNavbar =
      isSelectMode || isEditNameModalOpen || !!selectedItem;
    setNavbarVisible(!shouldHideNavbar);

    // 컴포넌트 언마운트 시 네비바 다시 보이게 복구
    return () => setNavbarVisible(true);
  }, [isSelectMode, isEditNameModalOpen, selectedItem, setNavbarVisible]);

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-white">
      {/* Header */}
      <div className="z-10 flex items-center justify-between px-4 pt-6 pb-4">
        <BackButton className="h-6 w-6" />

        {/* Title Display */}
        <h1 className="H2 max-w-[200px] truncate text-gray-200">
          {boardTitle}
        </h1>

        {/* Etc Button */}
        <button
          className="flex h-6 w-6 items-center justify-center"
          onClick={() => {
            if (isSelectMode) {
              setIsSelectMode(false);
              setIsMoveMode(false);
              setSelectedIds([]);
            } else {
              setIsMenuOpen(!isMenuOpen);
            }
          }}
        >
          {isSelectMode ? (
            <span className="text-[14px] whitespace-nowrap text-gray-400">
              취소
            </span>
          ) : (
            <EtcButton />
          )}
        </button>

        {/* Option Menu */}
        {isMenuOpen && !isSelectMode && (
          <ArchiveOptionMenu
            onClose={() => setIsMenuOpen(false)}
            onDeleteMode={() => {
              setIsMenuOpen(false);
              setIsSelectMode(true);
              setIsMoveMode(false);
            }}
            onMoveBoard={handleMoveBoard}
            onEditName={() => {
              setIsMenuOpen(false); // Close menu
              setIsEditNameModalOpen(true); // Open Edit Sheet
            }}
          />
        )}
      </div>

      {/* Filter Tags */}
      <div className="mb-6">
        <Swiper
          spaceBetween={8}
          slidesPerView={"auto"}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          freeMode={true}
        >
          {filters.map((filter) => (
            <SwiperSlide key={filter} className="!w-auto">
              <button
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === filter ? "최신순" : filter,
                  )
                }
                className={`ST2 rounded-[5px] px-3 py-1.5 whitespace-nowrap transition-colors ${
                  selectedFilter === filter
                    ? "bg-gray-200 text-black"
                    : "bg-gray-900 text-gray-200"
                }`}
              >
                {filter === "최신순" ? filter : `#${filter}`}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Model Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="grid grid-cols-2 gap-2.5">
          {modelItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isSelectMode) {
                    toggleSelection(item.id);
                  } else {
                    setSelectedItem(item);
                  }
                }}
                className={`relative h-[236px] w-full cursor-pointer overflow-hidden rounded-[5px] bg-gray-200 transition-all ${isSelectMode ? "active:scale-95" : ""} `}
              >
                <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-600">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.tag}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                {isSelectMode && (
                  <div
                    className={`absolute inset-0 z-20 flex items-center justify-center transition-colors ${
                      isSelected ? "bg-black/40" : "bg-black/10"
                    }`}
                  >
                    {isSelected ? (
                      <SelectedImageIcon className="h-[42px] w-[42px]" />
                    ) : (
                      <div className="h-[24px] w-[24px] rounded-full border-[1.5px] border-white/60 bg-transparent" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sheet for Deletion or Move */}
      <AnimatePresence>
        {isSelectMode && (
          <CountBottomSheet
            count={selectedIds.length}
            maintext="개의 이미지 선택됨"
            onDelete={
              !isMoveMode
                ? () => {
                    if (selectedIds.length > 0) setIsDeleteModalOpen(true);
                  }
                : undefined
            }
            onMove={isMoveMode ? handleOpenBoardSelector : undefined}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        count={selectedIds.length}
        maintext="개의 이미지를 삭제하시겠습니까?"
        subtext="삭제하면 보드 안의 모든 이미지가 사라져요."
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      <BoardBottomSheet
        isOpen={isEditNameModalOpen}
        initialTitle={boardTitle} // Pass current title
        toptext="아카이브 보드명 수정"
        buttontext="저장하기"
        placeholderText="수정할 보드명을 입력해주세요."
        onClose={() => setIsEditNameModalOpen(false)}
        onClick={handleEditNameSave} // Handle save
      />

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ImageDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            boardTitle={boardTitle}
            onTagUpdate={(newTag) => {
              if (selectedItem) {
                const updatedItem = { ...selectedItem, tag: newTag };
                setSelectedItem(updatedItem); // Update modal view
                setAllModelItems((prev) =>
                  prev.map((item) =>
                    item.id === selectedItem.id ? updatedItem : item,
                  ),
                ); // Update list view
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Board Selector Bottom Sheet */}
      <AnimatePresence>
        {isBoardSelectorOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-0 z-[60] bg-black"
          >
            <BoardSelector
              onSelect={handleBoardSelect}
              onClose={() => setIsBoardSelectorOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchiveDetailPage;
