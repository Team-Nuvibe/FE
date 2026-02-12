import { useLocation, useNavigate } from "react-router-dom";
import { ImageEditor } from "../../components/features/image-editor/ImageEditor";
import { useEffect, useState, useRef } from "react";
import { TagSelector } from "../../components/features/TagSelector";
import { postPresignedUrl } from "@/apis/vibedrop";
import { BoardSelector } from "../../components/features/BoardSelector";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import IconChevronRightWhiteSquare from "@/assets/icons/icon_chevron_right_white_square.svg?react";
import IconRectangleGray3 from "@/assets/icons/icon_rectangle_gray3.svg?react";
import IconXbuttonGray3 from "@/assets/icons/icon_xbutton_gray3.svg?react";
import "swiper/css";
import "swiper/css/pagination";
import { useNavbarActions } from "@/hooks/useNavbarStore";
import useJoinOrCreateTribe from "@/hooks/mutation/tribe-chat/useJoinOrCreateTribe";
import {
  getWaitingTribeList,
  getActiveTribeList,
} from "@/apis/tribe-chat/usertribe";
import useActivateUserTribe from "@/hooks/mutation/tribe-chat/useActivateUserTribe";
import { checkImageStatus } from "@/apis/tribe-chat/chat";
import useSendChatMessage from "@/hooks/mutation/tribe-chat/useSendChatMessage";

import { addImageToArchiveBoard } from "@/apis/archive-board/archive";

const tagImages = import.meta.glob(
  "@/assets/images/tag-default-images/*.{png,jpg,jpeg,webp}",
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

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

// TODO: 인터페이스 따로 빼야 함
interface Board {
  id: number;
  name: string;
  thumbnailUrl: string;
  tagCount: number;
}

export const QuickdropPage = () => {
  const location = useLocation();
  const {
    file: initialFile,
    tag: preSelectedTag,
    boardId: initialBoardId, // Added boardId from state
    boardName: initialBoardName, // Added boardName from state
    fromTribe,
    tribeId,
  } = location.state || {};
  const { setNavbarVisible } = useNavbarActions();
  useEffect(() => {
    setNavbarVisible(false);
    return () => {
      setNavbarVisible(true);
    };
  }, [setNavbarVisible]);

  const [file, setFile] = useState<File | null>(initialFile);
  const [step, setStep] = useState<
    "pick" | "edit" | "tag" | "board" | "uploaded"
  >(initialFile ? "edit" : "pick");
  const [imageData, setImageData] = useState<{
    image: Blob | null;
    imageUrl: string | null;
    tag: string;
    board: Board | null;
  }>({
    image: null,
    imageUrl: null,
    tag: preSelectedTag === "Tribe" ? "" : preSelectedTag || "",
    board:
      initialBoardId && initialBoardName
        ? {
            id: initialBoardId,
            name: initialBoardName,
            thumbnailUrl: "",
            tagCount: 0,
          }
        : null,
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
  const [uploadedTribeInfo, setUploadedTribeInfo] = useState<{
    tribeId: number;
    userTribeId: number;
    isActivatable: boolean; // counts >= 5
    joinStatus?:
      | "new_waiting"
      | "new_active"
      | "already_waiting"
      | "already_active";
  } | null>(null);

  // Tribe Chat Queries and Mutations
  // const { data: waitingTribesData } = useGetWaitingTribeList(); // Refactored: No longer needed
  const { mutate: joinOrCreateTribe, isPending: isJoiningTribe } =
    useJoinOrCreateTribe();
  const { mutate: activateUserTribe, isPending: isActivating } =
    useActivateUserTribe();
  const { mutate: sendChatMessage } = useSendChatMessage();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imageData.imageUrl) {
        URL.revokeObjectURL(imageData.imageUrl);
      }
    };
  }, [imageData.imageUrl]);

  const navigate = useNavigate();

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pickedFile = e.target.files?.[0];
    if (pickedFile) {
      setFile(pickedFile);
      setStep("edit");
    }
  };

  // 트라이브 챗 입장 핸들러 (버튼 클릭 시)
  const handleJoinTribe = (shouldActivate: boolean = false) => {
    if (!uploadedTribeInfo) {
      console.error("Uploaded tribe info is missing");
      return;
    }

    const { userTribeId, tribeId } = uploadedTribeInfo;

    // 1. 활성화 필요한 경우 (5명 이상 && 입장하기 버튼 클릭)
    if (shouldActivate) {
      // 이미 활성화된 상태라면 바로 이동
      if (uploadedTribeInfo.joinStatus === "already_active") {
        console.log("📌 Already active, navigating to chat room immediately");
        navigate(`/tribe-chat/${tribeId}`, {
          state: { imageTag: imageData.tag },
        });
        return;
      }

      console.log("🔄 Activating tribe...");
      activateUserTribe(userTribeId, {
        onSuccess: () => {
          console.log("✅ Tribe activated, navigating to chat room");
          navigate(`/tribe-chat/${tribeId}`, {
            state: { imageTag: imageData.tag },
          });
        },
        onError: (error) => {
          console.error("❌ Failed to activate tribe:", error);
          alert("트라이브 챗 활성화에 실패했습니다.");
          // 활성화 실패해도 채팅방으로 이동 (혹은 머무르기? 정책 확인 필요. 일단 이동)
          navigate("/tribe-chat");
        },
      });
    } else {
      // 2. 나중에 입장하기 (활성화 X)
      // 이미 joinOrCreateTribe는 handleBoardComplete에서 완료되었으므로 이동만 함
      console.log("📌 Navigating to tribe chat list (waiting)");
      navigate("/home");
    }
  };

  // 이미지 업로드 핸들러
  const handleBoardComplete = async (
    selectedBoard: Board,
    currentImage?: Blob,
    currentTag?: string,
  ) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const imageToUse = currentImage || imageData.image;
    const tagToUse = currentTag || imageData.tag;

    if (!imageToUse || !tagToUse) {
      console.error("Image or tag is missing");
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. 파일명 추출 (원본 파일명 또는 기본값)
      const originalFileName = file?.name || "image.jpg";

      // 2. Presigned URL 발급 API 호출
      // Capitalize: 첫 글자만 대문자 (예: alone → Alone)
      const capitalizedTagForPresigned =
        tagToUse.charAt(0).toUpperCase() + tagToUse.slice(1).toLowerCase();
      const response = await postPresignedUrl(
        capitalizedTagForPresigned,
        originalFileName,
      );
      console.log("Presigned URL Response:", response.data);
      const { imageURL: presignedUrl, imageId } = response.data;
      console.log("Extracted imageId:", imageId);

      if (!imageId) {
        console.error("❌ Critical: imageId is missing from response!");
        alert("이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
        setIsSubmitting(false);
        return;
      }

      // 3. S3에 직접 PUT으로 이미지 업로드 (fetch 사용 - axios는 CORS 이슈 발생)
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: imageToUse,
        headers: {
          "Content-Type": imageToUse.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed: ${uploadResponse.status}`);
      }

      console.log("Image uploaded successfully to S3");

      // 4. TribeChat에서 왔을 경우: 이미지 상태 확인 후 메시지 전송 및 복귀
      if (fromTribe && tribeId) {
        // TribeChat에서 온 경우 addImageToArchiveBoard 호출 생략 (sendChatMessage에서 처리됨)
        // 이미지가 ACTIVE 상태가 될 때까지 폴링
        let isImageActive = false;
        while (!isImageActive) {
          try {
            console.log(`Checking status for imageId: ${imageId}`);
            if (!imageId)
              throw new Error("imageId is missing before status check");

            const statusResponse = await checkImageStatus(imageId);
            console.log("Image Status:", statusResponse.data.status);
            if (statusResponse.data.status === "ACTIVE") {
              isImageActive = true;
            } else {
              // 1초 대기 후 재시도
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          } catch (statusError) {
            console.error("Failed to check image status:", statusError);
            // 에러 발생 시에도 잠시 대기 후 재시도 (또는 중단 정책 결정 필요)
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        // 이미지 상태가 ACTIVE가 되면 메시지 전송
        // sendChatMessage는 이제 imageId를 사용합니다.
        sendChatMessage(
          {
            tribeId: tribeId,
            boardId: selectedBoard.id,
            imageId: imageId,
          },
          {
            onSuccess: () => {
              console.log("✅ Message sent successfully, navigating back");
              navigate(`/tribe-chat/${tribeId}`, {
                state: { imageTag: tagToUse },
              });
            },
            onError: (error) => {
              console.error("❌ Failed to send message:", error);
              alert("메시지 전송에 실패했습니다.");
              navigate(`/tribe-chat/${tribeId}`);
            },
          },
        );
        return; // uploaded 단계로 넘어가지 않음
      }

      // 5. 일반 흐름: 성공 시 보드 정보 저장
      // S3 업로드 성공 시 아카이브 보드에 이미지 추가 (일반 흐름일 때만 여기서 수행)
      await addImageToArchiveBoard(selectedBoard.id, imageId);
      console.log("✅ Image added to archive board successfully");

      setImageData((prev) => ({ ...prev, board: selectedBoard }));

      // 6. 트라이브 입장/생성 및 정보 조회
      // Join/Create Tribe to get updated member counts
      joinOrCreateTribe(
        { imageTag: capitalizedTagForPresigned },
        {
          onSuccess: (joinResponse) => {
            console.log(
              "✅ Joined/Created Tribe (in BoardComplete):",
              joinResponse,
            );
            const data = joinResponse.data;

            setUploadedTribeInfo({
              userTribeId: data.userTribeId,
              tribeId: data.tribeId,
              isActivatable: data.counts >= 5, // 5명 이상이면 활성화 가능
            });

            setStep("uploaded");
          },
          onError: async (joinError: any) => {
            console.error("❌ Failed to join tribe:", joinError);

            // 400 에러 처리: 이미 가입된 경우
            if (
              joinError.response?.status === 400 &&
              joinError.response?.data?.message ===
                "이미 해당 태그의 트라이브에 가입되어 있습니다."
            ) {
              console.log("ℹ️ Already joined, checking lists...");

              try {
                const capitalizedTag =
                  tagToUse.charAt(0).toUpperCase() +
                  tagToUse.slice(1).toLowerCase();

                // 1. 대기 중인 트라이브 목록 확인
                const waitingResponse = await getWaitingTribeList();
                const waitingTribe = waitingResponse.data.items.find(
                  (item) => item.imageTag === capitalizedTag,
                );

                if (waitingTribe) {
                  console.log("✅ Found in waiting list:", waitingTribe);
                  setUploadedTribeInfo({
                    userTribeId: waitingTribe.userTribeId,
                    tribeId: waitingTribe.tribeId,
                    isActivatable: false,
                    joinStatus: "already_waiting",
                  });
                  setStep("uploaded");
                  return;
                }

                // 2. 활성화된 트라이브 목록 확인
                const activeResponse = await getActiveTribeList();
                const activeTribe = activeResponse.data.items.find(
                  (item) => item.imageTag === capitalizedTag,
                );

                if (activeTribe) {
                  console.log("✅ Found in active list:", activeTribe);
                  setUploadedTribeInfo({
                    userTribeId: activeTribe.userTribeId,
                    tribeId: activeTribe.tribeId,
                    isActivatable: true,
                    joinStatus: "already_active",
                  });
                  setStep("uploaded");
                  return;
                }

                // 3. 목록에서 발견되지 않음 (예외 케이스)
                console.warn(
                  "⚠️ Tribe not found in waiting or active lists despite 400 error.",
                );
              } catch (listError) {
                console.error("❌ Failed to fetch tribe lists:", listError);
              }
            }

            alert(
              "트라이브 정보 로딩에 실패했습니다. 잠시 후 다시 시도해주세요.",
            );
            setIsSubmitting(false);
          },
        },
      );
    } catch (error) {
      console.error("Failed to upload image:", error);
      // TODO: 사용자에게 에러 메시지 표시
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-black">
      {step === "pick" && (
        <div className="flex h-full flex-col items-center justify-center gap-6 px-10 text-center">
          <header className="fixed top-0 left-0 flex w-full items-center justify-between px-4 pt-2 pb-6">
            <IconXbuttonGray3
              className="cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h2 className="H2 text-white">바이브 드랍</h2>
            <div className="w-6" />
          </header>
          <p className="ST1 text-gray-300">
            바이브를 기록하기 위해
            <br />
            먼저 사진을 선택해 주세요.
          </p>
          <button
            onClick={() => inputRef.current?.click()}
            className="ST2 h-[52px] w-full rounded-[10px] bg-gray-200 text-black active:bg-gray-400"
          >
            사진 선택하기
          </button>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFilePick}
          />
        </div>
      )}
      {step === "edit" && file && (
        <ImageEditor
          file={file}
          initialState={editorState}
          onNext={(blob: Blob, currentState) => {
            const imageUrl = URL.createObjectURL(blob);
            setImageData((prev) => {
              if (prev.imageUrl) {
                URL.revokeObjectURL(prev.imageUrl);
              }
              return { ...prev, image: blob, imageUrl };
            });
            setEditorState(currentState);
            if (preSelectedTag) {
              // 태그가 있으면 Board 단계로, Board도 있으면 완료 처리
              if (initialBoardId) {
                // Board가 이미 있으면 바로 완료 처리
                if (imageData.board) {
                  handleBoardComplete(imageData.board);
                }
              } else {
                setStep("board");
              }
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
            if (initialBoardId && imageData.board) {
              handleBoardComplete(imageData.board, undefined, selectedTag);
            } else {
              setStep("board");
            }
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
          <div className="relative flex flex-col items-center justify-center gap-4">
            {/* 배경 조명 효과 */}
            <div
              className="pointer-events-none absolute -bottom-50 left-1/2 h-dvh w-full -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.25) 20%, transparent 100%)",
                filter: "blur(30px)",
              }}
            />
            {imageData.board?.tagCount === 0 && (
              <p
                className={`B2 text-white transition-opacity duration-200 ${
                  activeIndex === 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                {imageData.board.name}의 첫 감각이 기록되었어요!
              </p>
            )}
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
                    className="absolute inset-0 rounded-[15px]"
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
                    className="absolute inset-0 rounded-[15px]"
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
                    className="absolute inset-0 rounded-[15px]"
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
                      <p className="mb-8 text-center text-[12px] font-medium text-gray-500">
                        {uploadedTribeInfo?.joinStatus === "already_active" ? (
                          <>
                            이미 참여 중인 채팅방이에요. <br />
                            해당 트라이브 챗으로 이동할까요?
                          </>
                        ) : uploadedTribeInfo?.joinStatus ===
                          "already_waiting" ? (
                          "아직 활성화 되지 않은 트라이브 챗 입니다"
                        ) : uploadedTribeInfo?.isActivatable ? (
                          <>
                            더 많은 사람들과 바이브를 나눌 수 있어요 <br />
                            입장해볼까요?
                          </>
                        ) : (
                          <>
                            아직 인원이 부족해요 <br /> Tribe Chat이 생성되면
                            알려드릴게요!
                          </>
                        )}
                      </p>
                      <div className="relative mt-4 mb-8">
                        <div className="aspect-3/4 w-[96px] -rotate-[20deg] rounded-[5px] bg-gray-300/60 blur-[1px]"></div>
                        <div className="absolute top-0 aspect-3/4 w-[96px] -rotate-[10deg] rounded-[5px] bg-gray-200 blur-[1px]"></div>
                        <div
                          className="absolute top-0 aspect-3/4 w-[96px] rotate-0 rounded-[5px]"
                          style={{
                            backgroundImage: `url(${
                              allTagImages[imageData.tag.toLowerCase()] ||
                              imageData.imageUrl
                            })`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        ></div>
                      </div>
                    </div>
                    {uploadedTribeInfo?.joinStatus === "already_waiting" ? (
                      // 이미 대기 중인 경우: "나중에 입장하기" 버튼만
                      <button
                        className="w-full cursor-pointer rounded-[5px] bg-gray-800 py-[6px]"
                        onClick={() => handleJoinTribe(false)}
                        disabled={isJoiningTribe}
                      >
                        <p className="B2 text-gray-300">나중에 입장하기</p>
                      </button>
                    ) : uploadedTribeInfo?.isActivatable ||
                      uploadedTribeInfo?.joinStatus === "already_active" ? (
                      // 5명 이상 OR 이미 활성화된 경우: 두 버튼
                      <div className="flex justify-center gap-2">
                        <button
                          className="w-30 cursor-pointer rounded-[5px] bg-gray-800 py-[6px]"
                          onClick={() => handleJoinTribe(false)}
                          disabled={isJoiningTribe}
                        >
                          <p className="B2 text-gray-300">
                            {uploadedTribeInfo?.joinStatus === "already_active"
                              ? "홈으로 이동하기"
                              : "나중에 입장하기"}
                          </p>
                        </button>
                        <button
                          className="w-30 cursor-pointer rounded-[5px] bg-gray-300 py-[6px] disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() => handleJoinTribe(true)}
                          disabled={isJoiningTribe || isActivating}
                        >
                          <p className="B2 text-gray-800">
                            {uploadedTribeInfo?.joinStatus === "already_active"
                              ? "채팅으로 이동하기"
                              : isJoiningTribe
                                ? "입장 중..."
                                : "입장하기"}
                          </p>
                        </button>
                      </div>
                    ) : (
                      // 5명 미만 : "나중에 입장하기" 버튼만
                      <button
                        className="w-full cursor-pointer rounded-[5px] bg-gray-300 py-[6px] disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleJoinTribe(false)}
                        disabled={isJoiningTribe}
                      >
                        <p className="B2 text-gray-800">나중에 입장하기</p>
                      </button>
                    )}
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
