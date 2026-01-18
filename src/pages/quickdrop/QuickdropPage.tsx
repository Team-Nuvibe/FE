import { useLocation, useNavigate } from "react-router-dom";
import { ImageEditor } from "../../components/features/image-editor/ImageEditor";
import { useEffect, useState } from "react";
import { TagSelector } from "../../components/features/TagSelector";
import { BoardSelector } from "../../components/features/BoardSelector";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import IconChevronRightWhiteSquare from "@/assets/icons/icon_chevron_right_white_square.svg?react";
import IconRectangleGray3 from "@/assets/icons/icon_rectangle_gray3.svg?react";
import ImgTempUploaded from "@/assets/images/img_temp_uploaded.svg?react";
import "swiper/css";
import "swiper/css/pagination";

// TODO: 인터페이스 따로 빼야 함
interface Board {
  id: number;
  name: string;
  createdAt: string;
  thumbnailUrl: string;
  tagCount: number;
}

export const QuickdropPage = () => {
  const location = useLocation();
  const { file } = location.state || {};

  const [step, setStep] = useState<"edit" | "tag" | "board" | "uploaded">(
    "edit"
  );
  const [imageData, setImageData] = useState<{
    image: Blob | null;
    imageUrl: string | null;
    tag: string;
    board: Board | null;
  }>({
    image: null,
    imageUrl: null,
    tag: "",
    board: null,
  });
  const [editorState, setEditorState] = useState<{
    brightness: number;
    contrast: number;
    structure: number;
    temperature: number;
    saturation: number;
    exposure: number;
  }>({
    brightness: 0,
    contrast: 0,
    structure: 0,
    temperature: 0,
    saturation: 0,
    exposure: 0,
  });
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return () => {
      if (imageData.imageUrl) {
        URL.revokeObjectURL(imageData.imageUrl);
      }
    };
  }, [imageData.imageUrl]);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-dvh">
      {step === "edit" && (
        <ImageEditor
          file={file}
          initialState={editorState}
          onNext={(blob: Blob, currentState) => {
            const imageUrl = URL.createObjectURL(blob);
            console.log(imageUrl, imageData.imageUrl);
            setImageData((prev) => {
              if (prev.imageUrl) {
                URL.revokeObjectURL(prev.imageUrl);
              }
              return { ...prev, image: blob, imageUrl };
            });
            setEditorState(currentState);
            setStep("tag");
          }}
        />
      )}
      {step === "tag" && (
        <TagSelector
          onNext={(selectedTag) => {
            setImageData((prev) => ({ ...prev, tag: selectedTag }));
            setStep("board");
          }}
          onPrevious={() => setStep("edit")}
        />
      )}
      {step === "board" && (
        <BoardSelector
          image={imageData.image}
          imageUrl={imageData.imageUrl}
          tag={imageData.tag}
          onNext={(selectedBoard: Board) => {
            setImageData((prev) => ({ ...prev, board: selectedBoard }));
            setStep("uploaded");
          }}
          onPrevious={() => setStep("tag")}
        />
      )}
      {step === "uploaded" && (
        <div className="flex h-full justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-4">
            <p
              className={`B2 text-white transition-opacity duration-200 ${
                activeIndex === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              Viber의 첫 감각이 기록되었어요!
            </p>
            <Swiper
              modules={[Pagination]}
              className="w-[291px] h-[388px]"
              pagination={{
                clickable: true,
                el: paginationEl,
                type: "bullets",
              }}
              spaceBetween={100}
              slidesPerView={1}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              <SwiperSlide>
                <div className="relative w-full h-full rounded-[15px] overflow-hidden">
                  {/* 선명한 이미지 레이어 (상단) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${imageData.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      maskImage:
                        "linear-gradient(to bottom, black 50%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, black 50%, transparent 100%)",
                    }}
                  />
                  {/* 블러 + 어두운 이미지 레이어 (하단) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${imageData.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(15px)",
                      maskImage:
                        "linear-gradient(to bottom, transparent 50%, black 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 50%, black 100%)",
                    }}
                  />
                  {/* 어두운 그라데이션 오버레이 */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.8) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col justify-end h-full px-4 pb-4">
                    <div className="flex items-center">
                      <p className="font-normal text-[10px] text-white tracking-tight">
                        {imageData.board?.name}
                      </p>
                      <IconChevronRightWhiteSquare className="w-4" />
                    </div>
                    {/* TODO: 그라데이션 안되는 버그 픽스 */}
                    <p className="ST0 inline-block bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text text-transparent tracking-tight mb-3">
                      #{imageData.tag}
                    </p>
                    <p className="text-[10px]">
                      {imageData.board?.createdAt} / 09:41
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative w-full h-full rounded-[15px] overflow-hidden bg-gray-900">
                  <div className="relative z-10 flex flex-col justify-between h-full px-5 py-6 tracking-tight">
                    <div className="flex flex-col justify-center items-center">
                      <IconRectangleGray3 />
                      <p className="B0 text-gray-300 mb-2">
                        #{imageData.tag} 트라이브챗
                      </p>
                      <p className="font-medium text-[12px] text-gray-500 mb-8">
                        더 많은 사람들과 바이브를 나눌 수 있어요
                      </p>
                      <ImgTempUploaded />
                    </div>
                    <div className="flex justify-center gap-2">
                      <button className="bg-gray-800 w-30 py-[6px] rounded-[5px] cursor-pointer">
                        <p className="B2 text-gray-300">나중에 입장하기</p>
                      </button>
                      <button
                        className="bg-gray-300 w-30 py-[6px] rounded-[5px] cursor-pointer"
                        onClick={() => navigate("/home")}
                      >
                        <p className="B2 text-gray-800">입장하기</p>
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
            <div
              ref={setPaginationEl}
              className="quickdrop-pagination w-full flex justify-center items-center gap-[6px] z-10"
            />
          </div>
        </div>
      )}
    </div>
  );
};
