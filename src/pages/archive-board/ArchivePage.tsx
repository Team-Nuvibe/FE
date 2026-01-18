import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SearchIcon from '@/assets/icons/icon_search.svg?react'
import Plusbutton from '@/assets/icons/icon_plusbutton.svg?react'
import SelectedImageIcon from '@/assets/icons/icon_select_image.svg?react'
import ChevronRightIcon from '@/assets/icons/icon_chevron_right.svg?react'
import Icon_folder from '@/assets/icons/icon_folder2.svg?react'
import { useNavigate } from 'react-router';
import { useNavbarActions } from '../../hooks/useNavbarStore';
import { DeleteConfirmModal } from '../../components/archive-board/DeleteCofirmModal';
import { DeleteBottomSheet } from '../../components/archive-board/DeleteBottomSheet';
import { useUserStore } from '@/hooks/useUserStore';
import DefaultProfileImage from '@/assets/images/Default_profile_logo.svg';
import { ProfileImageDisplay } from '@/components/common/ProfileImageDisplay';


interface ArchiveBoard {
  id: string;
  title: string;
  thumbnail?: string;
  image?: string;
}

interface ResentDrops {
  id: string;
  tag: string;
  time: string;
  thumbnail: string;
}

const ArchivePage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const handleVibeTone = () => {
    navigate('/archive-board/vibetone')
  }

  const { nickname, profileImage } = useUserStore();

  const resentDrops: ResentDrops[] = [
    { id: '1', tag: '#Start', time: '12m', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '2', tag: '#Minimal', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '3', tag: '#Minimal', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '4', tag: '#Minimal', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '5', tag: '#Minimal', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },
    { id: '6', tag: '#End', time: '01h', thumbnail: '../../src/assets/images/img_7.svg' },

  ];

  const tags = ['#Minimal', '#Warm', '#Object', '#Moody'];

  const [archiveboard, setArciveboard] = useState<ArchiveBoard[]>([
    { id: '1', title: '2026 추구미', image: '../../src/assets/images/img_7.svg' },
    { id: '2', title: '보드명', image: '../../src/assets/images/img_7.svg' },
    { id: '3', title: '', image: '' },
    { id: '4', title: '' },
    { id: '5', title: '' },
    { id: '6', title: '' },
    { id: '7', title: '' },
    { id: '8', title: '' },
    { id: '9', title: '' },
    { id: '10', title: '' },
    { id: '11', title: '' },
    { id: '12', title: '' },
    { id: '13', title: '' },
  ]);

  // Archive Section 관리용
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedIds([]); // 모드 변경 시 선택 초기화
  };

  // 아이템 선택/해제 토글
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id) // 이미 있으면 제거
        : [...prev, id] // 없으면 추가
    );
  };

  // Board 삭제 Modal 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleTrashClick = () => {
    if (selectedIds.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  // Board 삭제 함수
  const executeDelete = () => {
    setArciveboard((prev) => prev.filter((board) => !selectedIds.includes(board.id)));
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
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24 touch-auto">
        {/* Video Posts Section with Overlay */}
        <div className="relative mb-[134px] mt-2">
          {/* Background Video Posts */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={12}
            slidesPerView={'auto'}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            className="pb-2 [&>.swiper-wrapper]:!ease-linear"
            speed={10000} // 이동 속도 
            resistanceRatio={0}
            freeMode={{
              enabled: true,
              momentum: false, // 관성 
              sticky: false,
            }}
            loop={false}
            allowTouchMove={true} // 사용자가 손가락으로 스와이프 가능
            autoplay={{
              delay: 0, // 딜레이 없이 부드럽게 계속 흐르게 설정
              disableOnInteraction: true, // 사용자가 건드려도 자동 재생이 꺼지지 않음
              stopOnLastSlide: true,
              waitForTransition: false,
            }}
          >
            {resentDrops.map((post) => (
              <SwiperSlide
                key={post.id}
                className="!w-[165px]"
              >
                <div className="relative w-full h-[220px] rounded-[10px] overflow-hidden backdrop-blur-[2px]">
                  <img
                    src={post.thumbnail}
                    alt={post.tag}
                    className="w-full h-full object-cover "
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
                  <div className="absolute top-1 left-1 px-2 py-1 rounded-lg ST1">
                    <span
                      className="
                        bg-clip-text 
                        text-transparent 
                        bg-[linear-gradient(90deg,#F7F7F7_35.59%,rgba(247,247,247,0.3)_105%)]
                        leading-[150%] tracking-[-0.025em]
                      "
                    >
                      {post.tag}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 B2 text-white/80">
                    {post.time}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-[260px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
            {/* 프로필 이미지 */}
            {profileImage === DefaultProfileImage ? (
              <div className="w-[76.14px] h-[76.14px] pointer-events-auto">
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <ProfileImageDisplay
                src={profileImage}
                className="w-[76.14px] h-[76.14px] pointer-events-auto"
              />
            )}
            <div className="mt-1 font-[500] text-[28.42px] text-[#F7F7F7] leading-[140%] tracking-[-0.03em]">
              {/* user.nickname */}
              {nickname}
            </div>
          </div>
        </div>

        {/* Vibe Tone */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <p className="H2 text-gray-200 leading-[150%] tracking-[-0.025em]">{nickname}'s 바이브 톤</p>
            <button
              onClick={handleVibeTone}
              className="flex items-center gap-[12px]" // flex(가로 정렬) + 세로 중앙 + 간격 12px
            >
              <span className="B2 text-gray-500 leading-[150%] tracking-[-0.025em]">더보기</span>
              <ChevronRightIcon />
            </button>

          </div>

          {/* Tags */}
          <div className="w-full">
            <Swiper
              spaceBetween={8}
              slidesPerView={'auto'}
              className="px-4"
              freeMode={true}
            >
              {tags.map((tag) => (
                <SwiperSlide key={tag} className="!w-auto">
                  <div className="px-3 py-1.5 mb-7.5 bg-gray-900 rounded-[5px] ST2 whitespace-nowrap">
                    <span
                      className="
                        bg-clip-text 
                        text-transparent 
                        bg-[linear-gradient(90deg,rgba(247,247,247,0.8)_35.59%,rgba(247,247,247,0.4)_105%)]
                        leading-[150%] tracking-[-0.025em]
                      "
                    >
                      {tag}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Archive Section */}
        <div className="flex-1 flex flex-col">
          {/* Fixed Header */}
          <div className="px-4 p-5 bg-black sticky top-0 z-50 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="H2 text-gray-200 leading-[150%] tracking-[-0.025em]">아카이브 보드</div>
              <div className="flex gap-[24px]">
                <button
                  className={`B2 ${isSelectMode ? 'text-gray-200' : 'text-gray-200'}`}
                  onClick={toggleSelectMode}
                >
                  {isSelectMode ? '취소' : '선택'}
                </button>
                <button
                >
                  <Plusbutton className="w-[24px] h-[24px]" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="아카이브 보드명을 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[48px] bg-gray-900 rounded-[5px] pl-10 pr-4 py-3
                placeholder:text-gray-600 placeholder:text-[16px] placeholder:font-normal placeholder:leading-[150%] placeholder:tracking-[-0.025em]
                focus:outline-none"
              />
            </div>
          </div>

          {/* Scrollable Grid */}
          <div className="px-4">

            <div className="grid grid-cols-3 gap-x-4 gap-y-4 pb-6">
              {archiveboard.map((board) => {
                const isSelected = selectedIds.includes(board.id);
                return (
                  <div
                    key={board.id}
                    onClick={() => {
                      if (isSelectMode) {
                        toggleSelection(board.id);
                      } else {
                        navigate(`/archive-board/${board.title}`);
                      }
                    }}
                    className={`
                      flex flex-col items-center gap-2 cursor-pointer transition-all
                      ${isSelectMode ? 'active:scale-95' : ''} 
                    `}
                  >
                    {/* 폴더 컨테이너 */}
                    <div className="relative w-full aspect-square max-w-[110px] shrink-0 rounded-[5px] bg-[#212224]/80 overflow-hidden">
                      {/* 내부 이미지 (썸네일) */}
                      {board.image ? (
                        <img
                          src={board.image}
                          alt="thumbnail"
                          className="absolute w-[66%] h-[88%] top-[3%] left-[16%] py-2"
                        />
                      ) : (
                        <div className="absolute w-[66%] h-[88%] top-[3%] left-[16%] bg-gray-800" />
                      )}

                      {/* 폴더 오버레이 아이콘 */}
                      <Icon_folder className="absolute bottom-0 left-0 w-full h-auto z-10 pointer-events-none" />

                      {/* 날짜 (우측 상단) */}
                      <div className="absolute top-[40%] right-2 z-20 text-gray-300 text-[6px] font-light leading-[150%] font-['Montserrat']">
                        2026. 01. 03
                      </div>

                      {/* 폴더 제목 (하단) */}
                      <div className="absolute flex justify-between bottom-[9.5px] left-[6.39px] right-[6px] z-20">
                        <p className="text-gray-200 text-[10px] font-normal leading-[150%] tracking-[-0.025em] line-clamp-2 text-white">
                          {board.title}
                        </p>
                        {/* 보드 내의 태그 갯수 */}
                        <p className='flex items-end text-[7px] font-normal text-gray-300'>12tag</p>
                      </div>



                      {/* 체크표시 */}
                      {isSelectMode && (
                        <div
                          className={`absolute inset-0 z-30 flex items-center justify-center transition-colors ${isSelected ? 'bg-white/30' : 'bg-transparent'
                            }`}
                        >
                          {isSelected && (
                            <SelectedImageIcon className="w-[32px] h-[32px]" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {isSelectMode && (
        <DeleteBottomSheet
          count={selectedIds.length}
          onDelete={handleTrashClick}
          maintext="개의 아카이브 보드 선택됨"
        />
      )}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        count={selectedIds.length}
        maintext="개의 보드를 삭제하시겠습니까?"
        subtext="삭제하면 보드 안의 모든 이미지가 사라져요"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
      />
    </div>
  );
};

export default ArchivePage;