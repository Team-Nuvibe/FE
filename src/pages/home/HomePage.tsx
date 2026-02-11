import { useEffect, useRef, useState } from "react";
import Icon_shortcut_quickdrop from "@/assets/icons/icon_shortcut_quickdrop.svg?react";
import Icon_plus from "@/assets/icons/icon_plus.svg?react";
import Icon_notification from "@/assets/icons/icon_notification.svg?react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import useGetAllCategoriesTags from "@/hooks/queries/useGetAllCategoriesTags";
import useGetDropMission from "@/hooks/queries/useGetDropMission";
import useGetArchiveList from "@/hooks/queries/archive-board/useGetArchiveList";
import IconFolderHome from "@/assets/icons/icon_folder_home.svg?react";
import { BoardBottomSheet } from "@/components/archive-board/BoardBottomSheet";
import { createArchiveBoard } from "@/apis/archive-board/archive";
import { useNavbarActions } from "@/hooks/useNavbarStore";

const tagImages = import.meta.glob(
  "@/assets/images/tag-default-images/*.{webp,jpg,jpeg}",
  {
    import: "default",
    eager: true,
  },
) as unknown as Record<string, string>;

const allTagImages: Record<string, string> = {};

Object.entries(tagImages).forEach(([path, imageUrl]) => {
  const parts = path.split("/");
  const fileName = parts[parts.length - 1];

  if (fileName.length > 4) {
    const tagNameWithExt = fileName.substring(4);
    const tagName = tagNameWithExt.split(".")[0].toLowerCase();

    allTagImages[tagName] = imageUrl;
  }
});

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  const swiperRef = useRef<SwiperType | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navigate = useNavigate();
  const { setNavbarVisible } = useNavbarActions();

  const { categories, categoryQueries } = useGetAllCategoriesTags();
  const { data: dropMission } = useGetDropMission();
  const { data: archiveListData, refetch: refetchArchiveList } =
    useGetArchiveList();

  useEffect(() => {
    setNavbarVisible(!isCreateBoardModalOpen);
  }, [isCreateBoardModalOpen, setNavbarVisible]);

  const isSuccess = categoryQueries.every((query) => query.isSuccess);

  useEffect(() => {
    if (isSuccess && swiperRef.current) {
      swiperRef.current.update();
      swiperRef.current.updateAutoHeight(150);
    }
  }, [isSuccess]);

  useEffect(() => {
    const isNewUser = sessionStorage.getItem("isNewUser");
    if (isNewUser === "true") {
      setShowTutorial(true);
      sessionStorage.removeItem("isNewUser");
    }
  }, []);

  const handleCategoryClick = (index: number) => {
    swiperRef.current?.slideTo(index);
    scrollToTab(index);
  };

  const scrollToTab = (index: number) => {
    const container = tabsContainerRef.current;
    const tab = tabRefs.current[index];

    if (container && tab) {
      const scrollLeft =
        tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      // 오차 범위를 고려해 1px 정도 여유를 둡니다.
      // 스크롤 위치 + 보이는 너비 >= 전체 너비라면 끝에 도달한 것입니다.
      setIsScrollEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const handleCreateBoardSave = async (boardName: string) => {
    if (!boardName || boardName.trim() === "") return;

    try {
      const response = await createArchiveBoard(boardName.trim());
      if (response.data) {
        await refetchArchiveList();
      }
    } catch (error) {
      console.error("Failed to create archive board:", error);
      // TODO: Show error toast to user
    } finally {
      setIsCreateBoardModalOpen(false);
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col">
      {/* 헤더 */}
      <header className="relative flex h-[50dvh] shrink-0 flex-col justify-between bg-cover bg-bottom bg-no-repeat">
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-bottom bg-no-repeat object-cover"
          style={{
            backgroundImage: `url(${
              (dropMission?.data.tag &&
                allTagImages[dropMission.data.tag.toLowerCase()]) ||
              dropMission?.data.imageUrl
            })`,
            maskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 70%, transparent 100%)",
          }}
        />
        <div className="z-10 flex justify-end p-6">
          <Icon_notification
            className="cursor-pointer"
            onClick={() => navigate("/notification")}
          />
        </div>
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col">
            <div className="B0 z-10 px-4 tracking-tight text-gray-100">
              <p className="text-[24px] leading-4">Drop</p>
              <p className="text-[24px]">your vibe</p>
            </div>
            <div className="H1 z-10 px-4 pt-[10px] pb-4">
              <h1 className="inline-block bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-[28px] tracking-tight text-transparent">
                #{dropMission?.data.tag}
              </h1>
            </div>
          </div>
          <div className="relative z-10 mr-4 mb-7 cursor-pointer">
            <Icon_shortcut_quickdrop
              onClick={() => navigate(`/tag/${dropMission?.data.tag}`)}
            />
          </div>
        </div>
      </header>
      {/* My Trace */}
      <section className="flex flex-col gap-3 px-4 pt-4 pb-4">
        <h2 className="H2 tracking-tight text-gray-200">나의 기록</h2>
        <div className="scrollbar-hide flex gap-[10px] overflow-x-auto">
          {archiveListData?.data.length === 0 && (
            <div
              className="flex h-[123px] w-[123px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] border-[1px] border-dashed border-gray-800 bg-gray-900"
              onClick={() => setIsCreateBoardModalOpen(true)}
            >
              <Icon_plus className="h-[16px]" />
            </div>
          )}
          {archiveListData?.data.map((board) => (
            <div
              key={board.boardId}
              onClick={() => navigate(`/archive-board/${board.boardId}`)}
              className={`flex w-[123px] shrink-0 cursor-pointer flex-col items-center gap-2 transition-all`}
            >
              {/* 폴더 컨테이너 */}
              <div className="relative aspect-square w-full max-w-[123px] shrink-0 overflow-hidden rounded-[5px] bg-[#212224]/80">
                {/* 내부 이미지 (썸네일) */}
                {board.thumbnailUrl ? (
                  <img
                    src={board.thumbnailUrl}
                    alt="thumbnail"
                    className="absolute top-[3%] left-[16%] h-[88%] w-[66%] py-2"
                  />
                ) : (
                  <div className="absolute top-[3%] left-[16%] h-[88%] w-[66%] bg-gray-800" />
                )}

                {/* 폴더 오버레이 아이콘 */}
                <IconFolderHome className="pointer-events-none absolute bottom-0 left-0 z-10 h-auto w-full" />

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
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Categories */}
      <section className="flex flex-col pb-4">
        <div className="sticky top-0 z-40 bg-black pt-4 pb-4">
          <div className="relative mx-4">
            <div className="absolute bottom-[0.5px] left-0 h-[0.5px] w-full bg-gray-400" />
            <div
              ref={tabsContainerRef}
              onScroll={handleScroll} // 스크롤 이벤트 연결
              className="scrollbar-hide flex gap-3 overflow-x-auto"
              style={{
                // 끝에 도달하면 마스킹 제거 (none), 아니면 기존 효과 적용
                maskImage: isScrollEnd
                  ? "none"
                  : "linear-gradient(to right, black 90%, transparent 100%)",
                WebkitMaskImage: isScrollEnd
                  ? "none"
                  : "linear-gradient(to right, black 90%, transparent 100%)",
              }}
            >
              {categories.map((category, index) => (
                <button
                  key={index}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  onClick={() => handleCategoryClick(index)}
                  className={`relative flex shrink-0 cursor-pointer flex-col items-center px-[6px] pb-1 transition-colors`}
                >
                  <p
                    className={`ST2 tracking-tight transition-colors duration-200 ${
                      activeIndex === index
                        ? "B1 text-gray-200"
                        : "B1 text-gray-600"
                    }`}
                  >
                    {category.name[0] + category.name.slice(1).toLowerCase()}
                  </p>
                  {activeIndex === index && (
                    <motion.div
                      layoutId="homeTabIndicator"
                      className="absolute bottom-0 z-10 h-[1.5px] w-full bg-white"
                      transition={{ stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className=""></div>
        <div className="mx-4"></div>

        <Swiper
          modules={[Scrollbar]}
          scrollbar={{
            hide: false,
            draggable: true,
            el: ".home-scrollbar",
          }}
          slidesPerView={1}
          spaceBetween={12}
          autoHeight={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
            scrollToTab(swiper.activeIndex);
          }}
          className="w-full"
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-2 gap-x-[10px] gap-y-[10px] px-[16px]">
                {category.items.map((item, itemIndex) => {
                  const localImage = allTagImages[item.tag.toLowerCase()];
                  const imageUrl = localImage || item.imageUrl;

                  return (
                    <div
                      key={itemIndex}
                      className="relative flex aspect-[177/236] w-full cursor-pointer items-end justify-center overflow-hidden rounded-[5px]"
                      onClick={() =>
                        navigate(`/tag/${item.tag}`, {
                          state: { imageUrl },
                        })
                      }
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.tag}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(135deg,#3A3A3A_0%,#1C1C1C_100%)]" />
                      )}
                      <div className="relative z-10 mb-[10px] flex w-fit items-center justify-center rounded-[5px] bg-gray-900 px-[9px] py-[3px]">
                        <p className="ST2 bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text leading-[1.4] tracking-tight text-transparent">
                          #{item.tag}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <div className="pointer-events-none fixed bottom-0 left-0 z-50 h-[12dvh] w-full bg-gradient-to-b from-transparent to-[#121212]" />
      {showTutorial && (
        <div
          className="animate-fade-in fixed inset-0 z-50 flex h-full w-full touch-none justify-center bg-black/70"
          onClick={() => setShowTutorial(false)}
        >
          <div className="relative h-full w-full max-w-[393px]">
            <div className="absolute right-4 bottom-30 rounded-[5px] border-[1px] border-gray-800 bg-gray-600/80 bg-gradient-to-t from-gray-900/80 to-gray-900/80 px-4 py-3">
              <p className="B2 text-right tracking-tight text-gray-100">
                바이브 드랍을 통해
                <br />
                오늘의 바이브를 드랍해보세요!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="h-[calc(env(safe-area-inset-bottom)+12rem)] w-full shrink-0" />
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

export default HomePage;
