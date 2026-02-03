import { useLocation, useNavigate } from "react-router-dom";
import { ImageEditor } from "../../components/features/image-editor/ImageEditor";
import { useEffect, useState } from "react";
import { TagSelector } from "../../components/features/TagSelector";
import { postPresignedUrl } from "@/apis/vibedrop";
import axios from "axios";
import { BoardSelector } from "../../components/features/BoardSelector";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import IconChevronRightWhiteSquare from "@/assets/icons/icon_chevron_right_white_square.svg?react";
import IconRectangleGray3 from "@/assets/icons/icon_rectangle_gray3.svg?react";
import ImgTempUploaded from "@/assets/images/img_temp_uploaded.svg?react";
import "swiper/css";
import "swiper/css/pagination";
import { useNavbarActions } from "@/hooks/useNavbarStore";

// TODO: 인터페이스 따로 빼야 함
interface Board {
  id: number;
  name: string;
  thumbnailUrl: string;
  tagCount: number;
}

export const QuickdropPage = () => {
  const location = useLocation();
  const { file, tag: preSelectedTag } = location.state || {};
  const { setNavbarVisible } = useNavbarActions();
  useEffect(() => {
    setNavbarVisible(false);
    return () => {
      setNavbarVisible(true);
    };
  }, [setNavbarVisible]);

  const [step, setStep] = useState<"edit" | "tag" | "board" | "uploaded">(
    "edit",
  );
  const [imageData, setImageData] = useState<{
    image: Blob | null;
    imageUrl: string | null;
    tag: string;
    board: Board | null;
  }>({
    image: null,
    imageUrl: null,
    tag: preSelectedTag || "",
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
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (imageData.imageUrl) {
        URL.revokeObjectURL(imageData.imageUrl);
      }
    };
  }, [imageData.imageUrl]);

  const navigate = useNavigate();

  // 이미지 업로드 핸들러
  const handleBoardComplete = async (selectedBoard: Board) => {
    if (!imageData.image || !imageData.tag) {
      console.error("Image or tag is missing");
      return;
    }

    setIsUploading(true);

    try {
      // 1. 파일명 추출 (원본 파일명 또는 기본값)
      const originalFileName = file?.name || "image.jpg";

      // 2. Presigned URL 발급 API 호출
      const response = await postPresignedUrl(imageData.tag, originalFileName);
      const presignedUrl = response.data.imageURL;

      console.log("Presigned URL:", presignedUrl);

      // 3. S3에 직접 PUT으로 이미지 업로드 (fetch 사용 - axios는 CORS 이슈 발생)
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: imageData.image,
        headers: {
          "Content-Type": imageData.image.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed: ${uploadResponse.status}`);
      }

      console.log("Image uploaded successfully to S3");

      // 4. 성공 시 보드 정보 저장하고 uploaded 단계로 이동
      setImageData((prev) => ({ ...prev, board: selectedBoard }));
      setStep("uploaded");
    } catch (error) {
      console.error("Failed to upload image:", error);
      // TODO: 사용자에게 에러 메시지 표시
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col">
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
            if (preSelectedTag) {
              setStep("board");
            } else {
              setStep("tag");
            }
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
          onNext={handleBoardComplete}
          onPrevious={() => setStep(preSelectedTag ? "edit" : "tag")}
        />
      )}
      {step === "uploaded" && (
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <p
              className={`B2 text-white transition-opacity duration-200 ${
                activeIndex === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              Viber의 첫 감각이 기록되었어요!
            </p>
            <Swiper
              modules={[Pagination]}
              className="h-[388px] w-[291px]"
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
                <div className="relative h-full w-full overflow-hidden rounded-[15px]">
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
                  <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-4">
                    <div className="flex items-center">
                      <p className="text-[10px] font-normal tracking-tight text-white">
                        {imageData.board?.name}
                      </p>
                      <IconChevronRightWhiteSquare className="w-4" />
                    </div>
                    {/* TODO: 그라데이션 안되는 버그 픽스 */}
                    <p className="ST0 mb-3 inline-block bg-[linear-gradient(to_right,white_50%,#8F9297_100%)] bg-clip-text tracking-tight text-transparent">
                      #{imageData.tag}
                    </p>
                    <p className="font-[Montserrat] text-[10px] font-light italic">
                      2025. 03. 21.
                      {"\u00A0\u00A0\u00A0"}|{"\u00A0\u00A0\u00A0"}09:41
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative h-full w-full overflow-hidden rounded-[15px] bg-gray-900">
                  <div className="relative z-10 flex h-full flex-col justify-between px-5 py-6 tracking-tight">
                    <div className="flex flex-col items-center justify-center">
                      <IconRectangleGray3 />
                      <p className="B0 mb-2 text-gray-300">
                        #{imageData.tag} 트라이브챗
                      </p>
                      <p className="mb-8 text-[12px] font-medium text-gray-500">
                        더 많은 사람들과 바이브를 나눌 수 있어요
                      </p>
                      <ImgTempUploaded />
                    </div>
                    <div className="flex justify-center gap-2">
                      <button className="w-30 cursor-pointer rounded-[5px] bg-gray-800 py-[6px]">
                        <p className="B2 text-gray-300">나중에 입장하기</p>
                      </button>
                      <button
                        className="w-30 cursor-pointer rounded-[5px] bg-gray-300 py-[6px]"
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
              className="quickdrop-pagination z-10 flex w-full items-center justify-center gap-[6px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
