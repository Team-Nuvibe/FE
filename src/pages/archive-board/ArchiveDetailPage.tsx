import { useEffect, useState } from 'react';
import { BackButton } from '../../components/onboarding/BackButton';
import { useParams } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import EtcButton from '@/assets/icons/icon_etcbutton.svg?react';
import SelectedImageIcon from '@/assets/icons/icon_select_image.svg?react';

// Components
import { DeleteBottomSheet } from '@/components/archive-board/DeleteBottomSheet';
import { DeleteConfirmModal } from '@/components/archive-board/DeleteCofirmModal';
import { ArchiveOptionMenu } from '@/components/archive-board/ArchiveOptionMenu';
import { EditBoardNameBottomSheet } from '@/components/archive-board/EditBoardnameBottomSheet';
import { useNavbarActions } from '@/hooks/useNavbarStore';

// Data
import { tagItems } from '@/constants/TagItems';

// Swiper styles
import 'swiper/css';



interface ModelItem {
  id: string;
  tag: string;
  thumbnail?: string;
}

const ArchiveDetailPage = () => {
  const { boardid } = useParams<string>();

  // Title state to allow renaming
  const [boardTitle, setBoardTitle] = useState<string>(boardid || '');

  // Update title if params change (initial load)
  useEffect(() => {
    if (boardid) setBoardTitle(boardid);
  }, [boardid]);

  const [selectedFilter, setSelectedFilter] = useState<string>('최신순');
  const filters = ['최신순', 'Mood', 'Light', 'Color'];

  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Modals & Sheets State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);

  // Convert tagItems to ModelItem format and add to state
  const [allModelItems, setAllModelItems] = useState<ModelItem[]>(
    tagItems.map(item => ({
      id: item.id,
      tag: item.tag.replace('#', ''), // Remove # from tag
      thumbnail: item.thumbnail
    }))
  );

  // Filter Logic
  const modelItems = (() => {
    if (selectedFilter === '최신순') {
      return [...allModelItems].sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    return allModelItems.filter((item) => item.tag === selectedFilter);
  })();

  // Toggle Selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete Logic
  const handleDelete = () => {
    setAllModelItems((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id))
    );
    setIsSelectMode(false);
    setSelectedIds([]);
    setIsDeleteModalOpen(false);
  };

  // Rename Logic
  const handleEditNameSave = (newTitle: string) => {
    setBoardTitle(newTitle);
    // TODO: Add API call here to update the name on the server
    console.log('Board name updated to:', newTitle);
  };

  const { setNavbarVisible } = useNavbarActions();
  
  useEffect(() => {
    // 선택 모드이거나(OR) 수정 모달이 열려있으면 네비바를 숨깁니다.
    const shouldHideNavbar = isSelectMode || isEditNameModalOpen;
    setNavbarVisible(!shouldHideNavbar);

    // 컴포넌트 언마운트 시 네비바 다시 보이게 복구
    return () => setNavbarVisible(true);
  }, [isSelectMode, isEditNameModalOpen, setNavbarVisible]);

  return (
    <div className="w-full h-[100dvh] bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between z-10">
        <BackButton className="w-6 h-6" />
        
        {/* Title Display */}
        <h1 className="H2 text-gray-200 truncate max-w-[200px]">{boardTitle}</h1>
        
        {/* Etc Button */}
        <button
          className="w-6 h-6 flex items-center justify-center"
          onClick={() => {
            if (isSelectMode) {
              setIsSelectMode(false);
              setSelectedIds([]);
            } else {
              setIsMenuOpen(!isMenuOpen);
            }
          }}
        >
          {isSelectMode ? (
            <span className="text-[14px] text-gray-400 whitespace-nowrap">
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
            }}
            onMoveBoard={() => console.log('보드 이동')}
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
          slidesPerView={'auto'}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          freeMode={true}
        >
          {filters.map((filter) => (
            <SwiperSlide key={filter} className="!w-auto">
              <button
                onClick={() =>
                  setSelectedFilter(
                    selectedFilter === filter ? '최신순' : filter
                  )
                }
                className={`px-3 py-1.5 rounded-[5px] ST2 whitespace-nowrap transition-colors ${
                  selectedFilter === filter
                    ? 'bg-gray-200 text-black'
                    : 'bg-gray-900 text-gray-200'
                }`}
              >
                {filter === '최신순' ? filter : `#${filter}`}
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
                    console.log(`Maps to detail ${item.id}`);
                  }
                }}
                className={`
                  relative w-full h-[236px] bg-gray-200 rounded-[5px] overflow-hidden cursor-pointer transition-all
                  ${isSelectMode ? 'active:scale-95' : ''}
                `}
              >
                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.tag}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-[5px] ST2 whitespace-nowrap text-white">
                    #{item.tag}
                  </span>
                </div>

                {isSelectMode && (
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-colors z-20 ${
                      isSelected ? 'bg-black/40' : 'bg-black/10'
                    }`}
                  >
                    {isSelected ? (
                      <SelectedImageIcon className="w-[42px] h-[42px]" />
                    ) : (
                      <div className="w-[24px] h-[24px] rounded-full border-[1.5px] border-white/60 bg-transparent" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sheet for Deletion */}
      {isSelectMode && (
        <DeleteBottomSheet
          count={selectedIds.length}
          maintext="개의 이미지 선택됨"
          onDelete={() => {
            if (selectedIds.length > 0) setIsDeleteModalOpen(true);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        count={selectedIds.length}
        maintext="개의 이미지를 삭제하시겠습니까?"
        subtext="삭제하면 보드 안의 모든 이미지가 사라져요."
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {/* Edit Board Name Bottom Sheet  */}
      <EditBoardNameBottomSheet
        isOpen={isEditNameModalOpen}
        initialTitle={boardTitle} // Pass current title
        onClose={() => setIsEditNameModalOpen(false)}
        onSave={handleEditNameSave} // Handle save
      />
    </div>
  );
};

export default ArchiveDetailPage;