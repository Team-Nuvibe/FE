import IconChevronLeft from "@/assets/icons/icon_chevron_left.svg?react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useGetAllScrapedImages from "@/hooks/queries/tribe-chat/useGetAllScrapedImages";
import useGetTribeScrapedImages from "@/hooks/queries/tribe-chat/useGetTribeScrapedImages";
import useGetChatGrid from "@/hooks/queries/tribe-chat/useGetChatGrid";
import { type ChatGridItem, type ScrapedImageItem } from "@/types/tribeChat";

type DisplayItem = ChatGridItem | ScrapedImageItem;

export const ScrapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { tribeId?: number; tags?: string[] };
  const tribeId = state?.tribeId;
  const passedTags = state?.tags ?? [];

  // Global Mode State
  const [currentTag, setCurrentTag] = useState<string | undefined>(undefined);

  // Tribe Mode State
  const [viewMode, setViewMode] = useState<"recent" | "scrap">("recent");

  // 1. Global Mode: Fetch all scraped images
  const { data: allData } = useGetAllScrapedImages({
    imageTag: currentTag,
  });

  // 2. Tribe Mode (Recent): Fetch chat grid
  const { data: chatGridData } = useGetChatGrid({
    tribeId: tribeId ?? 0,
  });

  // 3. Tribe Mode (Scrap): Fetch tribe scraped images
  const { data: tribeScrapData } = useGetTribeScrapedImages({
    tribeId: tribeId ?? 0,
  });

  // 디버깅용 로그
  console.log("🔍 ScrapPage Debug Info:");
  console.log("State:", { tribeId, passedTags, currentTag, viewMode });
  console.log("Fetched Data:", {
    allData: allData?.data,
    chatGridData: chatGridData?.data,
    tribeScrapData: tribeScrapData?.data,
  });

  // Determine data source and items
  let items: DisplayItem[] = [];
  if (tribeId) {
    if (viewMode === "recent") {
      items = chatGridData?.data.items ?? [];
    } else {
      items = tribeScrapData?.data.items ?? [];
    }
  } else {
    items = allData?.data.items ?? [];
  }

  // 날짜별 그룹화 (YYYY.MM.DD)
  const groupedItems = items.reduce(
    (acc, item) => {
      const date = new Date(item.createdAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .replace(/\.$/, ""); // 2024.01.01 형식

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, DisplayItem[]>,
  );

  return (
    <div className="flex h-full min-h-screen flex-col bg-black text-white">
      <header className="relative mx-4 mt-2 mb-6 flex items-center justify-center pt-[50px]">
        <h2 className="H2 tracking-tight text-gray-200">
          {tribeId ? "사진 모아보기" : "스크랩 모아보기"}
        </h2>
        <button
          className="absolute left-0 h-6 w-6 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <IconChevronLeft className="text-white" />
        </button>
      </header>

      {/* Filter Section */}
      <section className="scrollbar-hide mx-4 flex gap-2 overflow-x-auto pb-2">
        {tribeId ? (
          // Tribe Mode Filters
          <>
            <button
              className={`flex shrink-0 cursor-pointer items-center justify-center rounded-[5px] px-[8px] py-[3px] transition-colors ${viewMode === "recent" ? `bg-gray-200` : `border border-gray-700 bg-gray-900`}`}
              onClick={() => setViewMode("recent")}
            >
              <p
                className={`ST2 tracking-tight ${viewMode === "recent" ? `text-gray-900` : `text-gray-400`}`}
              >
                최근 항목
              </p>
            </button>
            <button
              className={`flex shrink-0 cursor-pointer items-center justify-center rounded-[5px] px-[8px] py-[3px] transition-colors ${viewMode === "scrap" ? `bg-gray-200` : `border border-gray-700 bg-gray-900`}`}
              onClick={() => setViewMode("scrap")}
            >
              <p
                className={`ST2 tracking-tight ${viewMode === "scrap" ? `text-gray-900` : `text-gray-400`}`}
              >
                스크랩 모아보기
              </p>
            </button>
          </>
        ) : (
          // Global Mode Tag Filters
          <>
            <button
              className={`flex shrink-0 cursor-pointer items-center justify-center rounded-[5px] px-[8px] py-[3px] transition-colors ${!currentTag ? `bg-gray-200` : `border border-gray-700 bg-gray-900`}`}
              onClick={() => setCurrentTag(undefined)}
            >
              <p
                className={`ST2 tracking-tight ${!currentTag ? `text-gray-900` : `text-gray-400`}`}
              >
                전체
              </p>
            </button>
            {passedTags.map((tag) => (
              <button
                key={tag}
                className={`flex shrink-0 cursor-pointer items-center justify-center rounded-[5px] px-[8px] py-[3px] transition-colors ${currentTag === tag ? `bg-gray-200` : `border border-gray-700 bg-gray-900`}`}
                onClick={() => setCurrentTag(tag)}
              >
                <p
                  className={`ST2 tracking-tight ${currentTag === tag ? `text-gray-900` : `text-gray-400`}`}
                >
                  #{tag}
                </p>
              </button>
            ))}
          </>
        )}
      </section>

      <div className="mx-4 mt-4 flex flex-1 flex-col gap-6 overflow-y-auto pb-20">
        {Object.entries(groupedItems).length > 0 ? (
          Object.entries(groupedItems).map(([date, groupItems]) => (
            <div key={date} className="flex flex-col gap-3">
              <p className="B2 tracking-tight text-gray-500">{date}</p>
              <div className="grid grid-cols-3 gap-2">
                {groupItems.map((item) => {
                  const key =
                    "scrapedImageId" in item
                      ? item.scrapedImageId
                      : item.chatId;
                  return (
                    <div
                      key={key}
                      className="aspect-[3/4] w-full overflow-hidden rounded-[5px] bg-gray-800"
                    >
                      <img
                        src={item.imageUrl}
                        alt={`img-${item.imageId}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="mt-20 flex w-full flex-col items-center justify-center gap-2">
            <p className="B1 text-gray-500">
              {tribeId && viewMode === "recent"
                ? "이미지가 없습니다."
                : "스크랩한 이미지가 없습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
