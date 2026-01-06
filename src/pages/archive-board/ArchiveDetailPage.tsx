import { useEffect, useState } from 'react';
import { BackButton } from '../../components/onboarding/BackButton';
import { useParams } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import EtcButton from '@/assets/icons/icon_etcbutton.svg?react'
import SelectedImageIcon from '@/assets/icons/icon_select_image.svg?react'

import { DeleteBottomSheet } from '../../components/archive-board/DeleteBottomSheet';
import { DeleteConfirmModal } from '../../components/archive-board/DeleteCofirmModal';
import { ArchiveOptionMenu } from '../../components/archive-board/ArchiveOptionMenu';
import { useNavbarActions } from '../../hooks/useNavbarStore';


interface ModelItem {
  id: string;
  tag: string;
  thumbnail?: string;
}



const ArchiveDetailPage = () => {

  const {boardid} = useParams<string>();

  const [selectedFilter, setSelectedFilter] = useState<string | null>('최신순');

  const filters = ['최신순', 'Warm', 'Blur', 'Moody', 'Minimal'];

  // 메뉴 및 선택 모드 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


  const [allModelItems, setAllModelItems] = useState<ModelItem[]>([
    { id: '1', tag: 'Blur' },
    { id: '2', tag: 'Blur' },
    { id: '3', tag: 'Warm' },
    { id: '4', tag: 'Moody' },
    { id: '5', tag: 'Minimal' },
    { id: '6', tag: 'Blur' },
    { id: '7', tag: 'Warm' },
    { id: '8', tag: 'Minimal' },
  ]);

  // 필터링된 아이템
  const modelItems = (() => {
    // '최신순'이면 id 기준 내림차순 정렬 (숫자가 큰 게 최신)
    if (selectedFilter === '최신순') {
      return [...allModelItems].sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    // 다른 태그 선택 시 해당 태그만 필터링
    return allModelItems.filter((item) => item.tag === selectedFilter);
  })();

  // 선택 토글 함수
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // 삭제 실행 함수
  const handleDelete = () => {
    setAllModelItems(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setIsSelectMode(false);
    setSelectedIds([]);
    setIsDeleteModalOpen(false);
  };

  // Navbar 상태 관리
    const { setNavbarVisible } = useNavbarActions();
    useEffect(() => {
      setNavbarVisible(!isSelectMode);
      return () => setNavbarVisible(true);
    }, [isSelectMode, setNavbarVisible]);

  return (
    <div className="w-full h-[100dvh] bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <BackButton className="w-6 h-6" />
        <h1 className="H2 text-gray-200">{boardid}</h1>
        {/*  Etc Button: 메뉴 토글 */}
        <button 
          className="w-6 h-6 flex items-center justify-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* 선택 모드일 땐 '취소' 버튼 등을 보여줄 수도 있음 */}
          {isSelectMode ? (
            <span 
              className="text-[14px] text-gray-400" 
              onClick={(e) => {
                e.stopPropagation();
                setIsSelectMode(false);
                setSelectedIds([]);
              }}
            >
              취소
            </span>
          ) : (
            <EtcButton />
          )}
        </button>

        {/*  드롭다운 메뉴 (조건부 렌더링) */}
        {isMenuOpen && !isSelectMode && (
          <ArchiveOptionMenu 
            onClose={() => setIsMenuOpen(false)}
            onDeleteMode={() => setIsSelectMode(true)} // '이미지 삭제하기' 클릭 시
            onMoveBoard={() => console.log('보드 이동')}
            onEditName={() => console.log('이름 수정')}
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
                onClick={() => setSelectedFilter(selectedFilter === filter ? null : filter)}
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
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {modelItems.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isSelectMode) toggleSelection(item.id);
                  else {
                    // 상세 보기 이동 로직
                  }
                }}
                className={`
                  relative w-full h-[236px] bg-gray-200 rounded-[5px] overflow-hidden cursor-pointer transition-all
                  ${isSelectMode ? 'active:scale-95' : ''}
                `}
              >
                {/* 이미지 (Placeholder) */}
                <div className="w-full h-full bg-gray-800" />

                {/* Tag */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-[5px] ST2 whitespace-nowrap">
                    #{item.tag}
                  </span>
                </div>

                {/* ✨ 선택 모드 오버레이 (체크 아이콘) */}
                {isSelectMode && (
                  <div className={`absolute inset-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-black/40' : 'bg-transparent'}`}>
                    {isSelected ? (
                      <SelectedImageIcon className="w-[42px] h-[42px]" />
                    ) : (
                      // 선택 안 된 상태일 때 빈 원 등을 보여주고 싶다면 여기에 추가
                      <div className="w-[24px] h-[24px] rounded-full border border-white/30" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/*  하단 삭제 바텀 시트 */}
      {isSelectMode && (
        <DeleteBottomSheet
          count={selectedIds.length}
          maintext="개의 이미지 선택됨"
          onDelete={() => {
            if (selectedIds.length > 0) setIsDeleteModalOpen(true);
          }}
        />
      )}

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        count={selectedIds.length}
        maintext="정말 이미지를 삭제하시겠습니까?"
        subtext="삭제하면 보드 안의 모든 이미지가 사라져요."
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ArchiveDetailPage;