import { useParams, useNavigate } from "react-router-dom";
import Img_3 from "@/assets/images/img_3.png";
import IconChevronLeft from "@/assets/icons/icon_chevron_left.svg?react";
import useGetAllCategoriesTags from "@/hooks/queries/useGetAllCategoriesTags";
import useGetTagDetails from "@/hooks/queries/useGetTagDetails";
import { useNavbarActions } from "@/hooks/useNavbarStore";
import { useEffect, useRef, useState } from "react";
import { DropYourVibe } from "@/components/common/DropYourVibe";
import { VibeDropModal } from "@/components/home/VibeDropModal";
import useGetChatGrid from "@/hooks/queries/tribe-chat/useGetChatGrid";

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

export const TagDetailPage = () => {
  const { tagid } = useParams<{ tagid: string }>();
  const navigate = useNavigate();
  useEffect(() => {
    if (tagid && /^[a-z]/.test(tagid)) {
      const capitalizedTag = tagid.charAt(0).toUpperCase() + tagid.slice(1);
      navigate(`/tag/${capitalizedTag}`, { replace: true });
    }
  }, [tagid, navigate]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { categories } = useGetAllCategoriesTags();

  const imageUrl =
    allTagImages[tagid?.toLowerCase() || ""] ||
    categories.flatMap((cat) => cat.items).find((item) => item.tag === tagid)
      ?.imageUrl;
  const { data: tagDetails } = useGetTagDetails(tagid || "");
  const { setNavbarVisible } = useNavbarActions();
  const { data: chatGridData, isError: isChatGridError } = useGetChatGrid({
    tribeId: tagDetails?.data.tribeId || 0,
    size: 5,
  });

  console.log(chatGridData);

  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("파일을 선택하지 않았습니다.");
      return;
    }
    // 태그 정보도 함께 전달
    navigate("/quickdrop", {
      state: { file: file, tag: tagDetails?.data.tag },
    });
  };

  useEffect(() => {
    setNavbarVisible(false);
    return () => {
      setNavbarVisible(true);
    };
  }, [setNavbarVisible]);

  return (
    <div className="flex min-h-full w-full flex-col justify-between">
      <main className="flex flex-col">
        <section className="relative flex h-[50dvh] shrink-0 flex-col justify-between bg-cover bg-bottom bg-no-repeat">
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-bottom bg-no-repeat object-cover"
            style={{
              backgroundImage: `url(${imageUrl || Img_3})`,
              maskImage:
                "linear-gradient(to bottom, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 70%, transparent 100%)",
            }}
          />
          <div className="z-10 m-[18px] flex justify-start">
            <div
              className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-gray-900 opacity-50"
              onClick={() => navigate(-1)}
            >
              <IconChevronLeft className="h-[24px] text-gray-100" />
            </div>
          </div>
          <div className="flex w-full items-end justify-between">
            <div className="flex flex-col px-4">
              <div className="z-10 mb-2">
                <h1 className="inline-block bg-[linear-gradient(to_right,white_70%,#8F9297_100%)] bg-clip-text text-[28px] font-medium tracking-tight text-transparent">
                  #{tagDetails?.data.tag}
                </h1>
              </div>
              <div className="z-10">
                <p className="B2 tracking-tight text-gray-200">
                  {tagDetails?.data.description}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-4 py-6 pl-4">
          <h2 className="H2 text-gray-200">트라이브 챗 속 이미지</h2>
          {/* {tagDetails?.data.hasImages && (
            <div className="mt-3 flex gap-2"></div>
          )} */}
          {(!tagDetails?.data.hasImages || isChatGridError) && (
            <div className="flex w-full flex-col items-center justify-center rounded-[5px] border-[1px] border-dashed border-gray-700 bg-gray-900 py-[50px] text-[12px] font-medium tracking-tight text-gray-300">
              <p>아직 드랍된 이미지가 없어요.</p>
              <p>첫 번째 #{tagDetails?.data.tag}을 드랍해보세요!</p>
            </div>
          )}
          {tagDetails?.data.hasImages && !isChatGridError && (
            <div className="flex gap-2 overflow-x-auto">
              {chatGridData?.data.items.map((item) => (
                <div
                  className="aspect-3/4 w-[101px] shrink-0 cursor-pointer rounded-[5px] opacity-70 blur-[1px]"
                  style={{
                    backgroundImage: `url(${item.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => setIsModalOpen(true)}
                ></div>
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className="flex flex-col items-center justify-center pb-7">
        <input
          type="file"
          accept="image/*"
          ref={inputImageRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button className="" onClick={() => inputImageRef.current?.click()}>
          <DropYourVibe />
        </button>
      </footer>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsModalOpen(false)}
        >
          <VibeDropModal
            tag={tagDetails?.data.tag || ""}
            onClose={() => setIsModalOpen(false)}
            imageUrl={imageUrl || ""}
          />
        </div>
      )}
    </div>
  );
};
