import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import SearchIcon from "@/assets/icons/icon_search.svg?react";
import Plusbutton from "@/assets/icons/icon_plusbutton.svg?react";
import SelectedImageIcon from "@/assets/icons/icon_select_image.svg?react";
import ChevronRightIcon from "@/assets/icons/icon_chevron_right.svg?react";
import Icon_folder from "@/assets/icons/icon_folder2.svg?react";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import NoArchiveDataIcon from "@/assets/icons/icon_noarchivedata.svg?react";
import { useNavigate } from "react-router";
import { useNavbarActions } from "@/hooks/useNavbarStore";
import { DeleteConfirmModal } from "@/components/archive-board/DeleteCofirmModal";
import { CountBottomSheet } from "@/components/archive-board/CountBottomSheet";
import { useUserStore } from "@/hooks/useUserStore";
import { ImageDetailModal } from "@/components/archive-board/ImageDetailModal";
import { AnimatePresence } from "framer-motion";
import { ProfileImageDisplay } from "@/components/common/ProfileImageDisplay";
import { BoardBottomSheet } from "@/components/archive-board/BoardBottomSheet";
import {
  getArchiveImages,
  getVibeToneTags,
  getArchiveList,
  deleteArchiveBoard,
  createArchiveBoard,
} from "@/apis/archive-board/archive";
import { getImageDetail } from "@/apis/image";
import type { ImageDetailResponse } from "@/types/image";

interface ArchiveBoard {
  id: string;
  title: string;
  thumbnail?: string;
  image?: string;
  tagCount: number;
}

interface ResentDrops {
  id: string;
  tag: string;
  time: string;
  thumbnail: string;
  uploadedAt?: string;
}

const ArchivePage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleVibeTone = () => {
    navigate("/archive-board/vibetone");
  };

  const { nickname, profileImage } = useUserStore();

  // 아카이브 메인 상단에 표시할 전체 이미지 조회 API(getArchiveImages API 이용)
  const [resentDrops, setResentDrops] = useState<ResentDrops[]>([]);

  // TODO: uploadedAt을 상대 시간(12m, 01h 등)으로 변환하는 유틸 함수 필요
  // 예: formatRelativeTime(uploadedAt: string): string
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getArchiveImages(0, 20);
        if (response.data) {
          const mappedDrops: ResentDrops[] = response.data.content.map(
            (item) => ({
              id: item.imageId.toString(),
              tag: item.tag,
              time: "--", // TODO: uploadedAt을 상대 시간으로 변환 필요
              thumbnail: item.imageUrl,
              uploadedAt: item.uploadedAt,
            }),
          );
          setResentDrops(mappedDrops);
        }
      } catch (error) {
        console.error("Failed to fetch archive images:", error);
      }
    };

    fetchImages();
  }, []);

  // 바이브톤 태그 조회 API 연결 (getVibeToneTags API 이용)
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getVibeToneTags();
        if (response.data) {
          setTags(response.data.topTags);
        }
      } catch (error) {
        console.error("Failed to fetch vibe tone tags:", error);
      }
    };

    fetchTags();
  }, []);

  // 아카이브 목록 조회 API 이용해 데이터 가져올 것 (getArchiveList API 이용)
  const [archiveboard, setArciveboard] = useState<ArchiveBoard[]>([]);
  const [allArchiveBoards, setAllArchiveBoards] = useState<ArchiveBoard[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await getArchiveList();

        if (response.data) {
          const mappedBoards: ArchiveBoard[] = response.data.map((board) => ({
            id: board.boardId.toString(),
            title: board.name,
            thumbnail: board.thumbnailUrl,
            image: board.thumbnailUrl,
            tagCount: board.tagCount,
          }));

          setAllArchiveBoards(mappedBoards);
          setArciveboard(mappedBoards);
        } else {
          console.warn("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Failed to fetch archive boards:", error);
      }
    };

    fetchBoards();
  }, []);

  const handleDropVibe = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        alert("파일을 선택하지 않았습니다.");
        return;
      }
      navigate("/quickdrop", { state: { file } });
    };
    fileInput.click();
  };

  // Filter boards based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setArciveboard(allArchiveBoards);
    } else {
      const filtered = allArchiveBoards.filter((board) =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setArciveboard(filtered);
    }
  }, [searchQuery, allArchiveBoards]);

  // Archive Section 관리용
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedIds([]); // 모드 변경 시 선택 초기화
  };

  // 아이템 선택/해제 토글
  const toggleSelection = (id: string) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id) // 이미 있으면 제거
          : [...prev, id], // 없으면 추가
    );
  };

  // Board 삭제 Modal 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Board 생성 Modal 상태
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<ImageDetailResponse | null>(
    null,
  );

  // 이미지 클릭 핸들러 - getImageDetail API 호출
  const handleImageClick = async (post: ResentDrops) => {
    try {
      const response = await getImageDetail(parseInt(post.id));
      if (response.data) {
        setSelectedItem(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch image detail:", error);
      // TODO: Show error toast to user
    }
  };

  const handleTrashClick = () => {
    if (selectedIds.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  // Board 생성 함수 (createArchiveBoard API 이용)
  const handleCreateBoard = () => {
    setIsCreateBoardModalOpen(true);
  };

  const handleCreateBoardSave = async (boardName: string) => {
    if (!boardName || boardName.trim() === "") return;

    try {
      const response = await createArchiveBoard(boardName.trim());
      if (response.data) {
        const newBoard: ArchiveBoard = {
          id: response.data.boardId.toString(),
          title: response.data.name,
          thumbnail: "",
          image: "",
          tagCount: 0,
        };
        setAllArchiveBoards((prev) => [...prev, newBoard]);
        setArciveboard((prev) => [...prev, newBoard]);
      }
    } catch (error) {
      console.error("Failed to create archive board:", error);
      // TODO: Show error toast to user
    } finally {
      setIsCreateBoardModalOpen(false);
    }
  };

  // Board 삭제 함수 (deleteArchiveBoard API 이용)
  const executeDelete = async () => {
    try {
      // Convert string IDs to numbers for API
      const boardIds = selectedIds.map((id) => parseInt(id, 10));
      await deleteArchiveBoard(boardIds);

      // Update local state
      setAllArchiveBoards((prev) =>
        prev.filter((board) => !selectedIds.includes(board.id)),
      );
      setArciveboard((prev) =>
        prev.filter((board) => !selectedIds.includes(board.id)),
      );
      setIsSelectMode(false);
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to delete archive boards:", error);
      // TODO: Show error toast to user
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // Navbar 상태 관리
  const { setNavbarVisible } = useNavbarActions();
  useEffect(() => {
    const shouldHideNavbar =
      isSelectMode || isCreateBoardModalOpen || !!selectedItem;
    setNavbarVisible(!shouldHideNavbar);
    return () => setNavbarVisible(true);
  }, [isSelectMode, isCreateBoardModalOpen, selectedItem, setNavbarVisible]);

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-white">
      {/* Main Content - Scrollable */}
      <div className="flex-1 touch-auto overflow-y-auto pb-24">
        {/* Video Posts Section with Overlay */}
        <div className="relative mt-2 mb-[134px]">
          {/* Background Video Posts */}
          <Swiper
            key={resentDrops.length === 0 ? "empty" : "loaded"}
            modules={[Autoplay]}
            spaceBetween={12}
            slidesPerView={"auto"}
            slidesOffsetBefore={16}
            slidesOffsetAfter={16}
            className="pb-2 [&>.swiper-wrapper]:!ease-linear"
            speed={10000} // 이동 속도
            resistanceRatio={0}
            freeMode={
              resentDrops.length > 0
                ? {
                    enabled: true,
                    momentum: false, // 관성
                    sticky: false,
                  }
                : false
            }
            loop={false}
            allowTouchMove={resentDrops.length > 0} // 데이터 없으면 스와이프 불가
            autoplay={
              resentDrops.length > 0
                ? {
                    delay: 0, // 딜레이 없이 부드럽게 계속 흐르게 설정
                    disableOnInteraction: true, // 사용자가 건드려도 자동 재생이 꺼짐
                    stopOnLastSlide: true,
                    waitForTransition: false,
                  }
                : false
            }
          >
            {/* 데이터가 없을 때 투명 컨테이너 3개 표시 (움직임 없음) */}
            {resentDrops.length === 0
              ? Array.from({ length: 3 }).map((_, index) => (
                  <SwiperSlide
                    key={`placeholder-${index}`}
                    className="!w-[165px]"
                  >
                    <div className="relative h-[220px] w-[165px] overflow-hidden rounded-[10px] bg-gray-900">
                      <div className="absolute inset-0 rounded-[10px] border border-dashed border-gray-700" />
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent to-black mask-[linear-gradient(to_bottom,transparent,black_60%)] backdrop-blur-[1px]" />
                  </SwiperSlide>
                ))
              : resentDrops.map((post) => (
                  <SwiperSlide key={post.id} className="!w-[165px]">
                    <div
                      className="relative h-[220px] w-full cursor-pointer overflow-hidden rounded-[10px] backdrop-blur-[2px]"
                      onClick={() => handleImageClick(post)}
                    >
                      <img
                        src={post.thumbnail}
                        alt={post.tag}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                      <div className="H3 absolute top-1 left-1 flex flex-col rounded-lg px-2 py-1">
                        <span className="bg-[linear-gradient(90deg,#F7F7F7_35.59%,rgba(247,247,247,0.3)_105%)] bg-clip-text leading-[150%] tracking-[-0.045em] text-transparent">
                          #{post.tag}
                        </span>
                        <div className="font-italic text-[10px] leading-[150%] font-light text-[#F7F7F7] italic">
                          {post.uploadedAt}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>
          <div className="pointer-events-none absolute top-[260px] left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            {/* 프로필 이미지 */}
            {profileImage === DefaultProfileImage ? (
              <div className="pointer-events-auto h-[76.14px] w-[76.14px]">
                <img
                  src={profileImage}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <ProfileImageDisplay
                src={profileImage}
                className="pointer-events-auto h-[76.14px] w-[76.14px]"
              />
            )}
            <div className="mt-1 text-[28.42px] leading-[140%] font-[500] tracking-[-0.03em] text-[#F7F7F7]">
              {/* user.nickname */}
              {nickname}
            </div>
          </div>
        </div>

        {/* Vibe Tone */}
        <div className="px-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="H2 leading-[150%] tracking-[-0.025em] text-gray-200">
              {nickname}'s 바이브 톤
            </p>
            <button
              onClick={handleVibeTone}
              className="flex items-center gap-[12px]" // flex(가로 정렬) + 세로 중앙 + 간격 12px
            >
              <span className="B2 leading-[150%] tracking-[-0.025em] text-gray-500">
                더보기
              </span>
              <ChevronRightIcon />
            </button>
          </div>

          {/* Tags */}
          <div className="w-full">
            {tags.length === 0 ? (
              <button
                className="flex h-[30px] w-[80px] items-center justify-center gap-2 rounded-[5px] border border-dashed border-gray-700 bg-gray-900 transition-all"
                onClick={handleDropVibe}
              >
                <Plusbutton className="h-4 w-4" />
              </button>
            ) : (
              <Swiper
                spaceBetween={8}
                slidesPerView={"auto"}
                className="px-4"
                freeMode={true}
              >
                {tags.map((tag) => (
                  <SwiperSlide key={tag} className="!w-auto">
                    <div className="ST2 mb-7.5 rounded-[5px] bg-gray-900 px-3 py-1.5 whitespace-nowrap">
                      <span className="bg-[linear-gradient(90deg,rgba(247,247,247,0.8)_35.59%,rgba(247,247,247,0.4)_105%)] bg-clip-text leading-[150%] tracking-[-0.025em] text-transparent">
                        #{tag}
                      </span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        {/* Archive Section */}
        <div className="flex flex-1 flex-col">
          {/* Fixed Header */}
          <div className="sticky top-0 z-50 bg-black p-5 px-4 pb-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="H2 leading-[150%] tracking-[-0.025em] text-gray-200">
                아카이브 보드
              </div>
              <div className="flex gap-[24px]">
                <button
                  className={`B2 ${isSelectMode ? "text-gray-200" : "text-gray-200"}`}
                  onClick={toggleSelectMode}
                >
                  {isSelectMode ? "취소" : "선택"}
                </button>
                <button onClick={handleCreateBoard}>
                  <Plusbutton className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2" />
              <input
                type="text"
                placeholder="아카이브 보드명을 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[48px] w-full rounded-[5px] bg-gray-900 py-3 pr-4 pl-10 placeholder:text-[16px] placeholder:leading-[150%] placeholder:font-normal placeholder:tracking-[-0.025em] placeholder:text-gray-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Scrollable Grid */}
          <div className="px-4">
            {archiveboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-7">
                <NoArchiveDataIcon className="mb-2 h-12 w-12 text-gray-700" />
                <p className="B1 text-gray-500">아직 생성된 보드가 없어요.</p>
              </div>
            ) : (
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
                          navigate(`/archive-board/${board.id}`);
                        }
                      }}
                      className={`flex cursor-pointer flex-col items-center gap-2 transition-all ${isSelectMode ? "active:scale-95" : ""} `}
                    >
                      {/* 폴더 컨테이너 */}
                      <div className="relative aspect-square w-full max-w-[110px] shrink-0 overflow-hidden rounded-[5px] bg-[#212224]/80">
                        {/* 내부 이미지 (썸네일) */}
                        {board.image ? (
                          <img
                            src={board.image}
                            alt="thumbnail"
                            className="absolute top-[3%] left-[16%] h-[88%] w-[66%] py-2"
                          />
                        ) : (
                          <div className="absolute top-[3%] left-[16%] h-[88%] w-[66%] bg-gray-800" />
                        )}

                        {/* 폴더 오버레이 아이콘 */}
                        <Icon_folder className="pointer-events-none absolute bottom-0 left-0 z-10 h-auto w-full" />

                        {/* 폴더 제목 (하단) */}
                        <div className="absolute right-[6px] bottom-[9.5px] left-[6.39px] z-20 flex justify-between">
                          <p className="line-clamp-2 text-[10px] leading-[150%] font-normal tracking-[-0.025em] text-gray-200 text-white">
                            {board.title}
                          </p>
                          {/* 보드 내의 태그 갯수 */}
                          <p className="flex items-end text-[7px] font-normal text-gray-300">
                            {board.tagCount} 태그
                          </p>
                        </div>

                        {/* 체크표시 */}
                        {isSelectMode && (
                          <div
                            className={`absolute inset-0 z-30 flex items-center justify-center transition-colors ${
                              isSelected ? "bg-white/30" : "bg-transparent"
                            }`}
                          >
                            {isSelected && (
                              <SelectedImageIcon className="h-[32px] w-[32px]" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {isSelectMode && (
        <CountBottomSheet
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

      {/* Image Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ImageDetailModal
            item={{
              id: "", // ImageDetailResponse에는 id가 없지만 모달에서 필요하므로 빈 값 전달
              tag: selectedItem.imageTag,
              thumbnail: selectedItem.imageUrl,
            }}
            onClose={() => setSelectedItem(null)}
            boardTitle={selectedItem.boardName}
            createdAt={selectedItem.createdAt}
            onTagUpdate={(newTag) => {
              const updatedItem = { ...selectedItem, imageTag: newTag };
              setSelectedItem(updatedItem);
              // resentDrops도 업데이트하려면 imageId를 찾아서 업데이트
              // 현재 구조에서는 imageId가 없어서 업데이트하기 어려움
            }}
          />
        )}
      </AnimatePresence>

      {/* Board 생성 Bottom Sheet */}
      <BoardBottomSheet
        isOpen={isCreateBoardModalOpen}
        initialTitle=""
        toptext="아카이브 보드 추가"
        buttontext="추가하기"
        placeholderText="추가할 보드명을 입력해주세요."
        onClose={() => setIsCreateBoardModalOpen(false)}
        onClick={handleCreateBoardSave}
      />
    </div>
  );
};

export default ArchivePage;
