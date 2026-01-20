import { useNavigate } from "react-router-dom";
import Icon_backbutton from "@/assets/icons/icon_backbutton.svg?react";
import Icon_rightarrow from "@/assets/icons/icon_rightarrow.svg?react";
import Icon_folder from "@/assets/icons/icon_folder.svg?react";
import Img_3 from "@/assets/images/img_3.png";

interface Notification {
  id: number;
  image: string;
  tag: string;
  title: string;
  description: string;
  isRead: boolean;
}

const dummyNotifications: Notification[] = Array(5)
  .fill(null)
  .map((_, index) => ({
    id: index,
    image: Img_3,
    tag: "Grain",
    title: "트라이브챗이 열렸어요",
    description: "지금 입장해보세요!",
    isRead: index !== 0, // 첫 번째 알림은 읽지 않음(신규), 나머지는 읽음 처리 (임시; 추후 로직 따라 변경)
  }));

export const NotificationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-black text-white">
      <div className="flex-1 touch-auto overflow-y-auto pb-24">
        {/* Header */}
        <header className="relative sticky top-0 z-20 mt-[20px] mb-[20px] flex h-[30px] items-center justify-between bg-black px-4">
          <Icon_backbutton
            className="cursor-pointer text-white"
            onClick={() => navigate(-1)}
          />
          <h1 className="H2 absolute left-1/2 -translate-x-1/2 text-center leading-[150%] tracking-[-0.025em] text-gray-200">
            알림
          </h1>
          <button className="ST2 cursor-pointer leading-[150%] tracking-[-0.025em] text-gray-600 transition-colors hover:text-gray-400">
            선택
          </button>
        </header>

        {/* Notification List */}
        <div className="flex flex-col gap-[20px]">
          {dummyNotifications.map((it) => (
            <div
              key={it.id}
              className={`flex h-[95px] w-full cursor-pointer items-center gap-5 border-b border-gray-800/50 px-4 transition-colors active:bg-gray-900/50 ${
                it.isRead ? "opacity-30" : "opacity-100"
              }`}
            >
              {/* 폴더 형태 이미지 (레이어 구현) */}
              <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[2.84px] border-[0.28px] border-[#36383E] bg-[#212224]">
                {/* 이미지 레이어 */}
                <img
                  src={it.image}
                  alt="thumbnail"
                  className="absolute top-[2.3px] left-[11.65px] h-[61.92px] w-[46.64px] object-cover"
                />
                {/* 폴더 오버레이 */}
                <Icon_folder className="pointer-events-none absolute top-[21.01px] left-0 z-10 h-[48.92px] w-[69.93px] text-[#D9D9D9]" />
              </div>

              {/* content */}
              <div className="flex flex-1 flex-col gap-[2px]">
                <div className="flex">
                  <span className="flex h-[17px] w-[50px] items-center justify-center rounded-[5px] bg-gray-900 text-[12px] leading-[150%] font-medium tracking-[-0.025em]">
                    <span className="bg-gradient-to-b from-[#F7F7F7] to-[#F7F7F780] bg-clip-text text-transparent">
                      #{it.tag}
                    </span>
                  </span>
                </div>
                <p className="H4 mt-0.5 leading-[150%] tracking-[-0.025em] text-gray-100">
                  {it.title}
                </p>
                <p className="text-[10px] leading-[150%] font-normal tracking-[-0.025em] text-gray-100">
                  {it.description}
                </p>
              </div>

              {/* 바로가기 버튼 */}
              <Icon_rightarrow className="h-6 w-6 shrink-0 text-gray-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
