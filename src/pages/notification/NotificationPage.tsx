import React from "react";
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
        <div className="w-full h-[100dvh] bg-black text-white flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pb-24 touch-auto">
                {/* Header */}
                <header className="sticky top-0 z-20 bg-black flex items-center justify-between px-4 h-[30px] mt-[20px] mb-[20px] relative">
                    <Icon_backbutton
                        className="cursor-pointer text-white"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="absolute left-1/2 -translate-x-1/2 H2 text-gray-200 leading-[150%] tracking-[-0.025em] text-center">
                        알림
                    </h1>
                    <button className="ST2 text-gray-600 leading-[150%] tracking-[-0.025em] cursor-pointer hover:text-gray-400 transition-colors">
                        선택
                    </button>
                </header>

                {/* Notification List */}
                <div className="flex flex-col gap-[20px]">
                    {dummyNotifications.map((it) => (
                        <div
                            key={it.id}
                            className={`flex items-center gap-5 px-4 h-[95px] w-full border-b border-gray-800/50 cursor-pointer active:bg-gray-900/50 transition-colors ${it.isRead ? "opacity-30" : "opacity-100"
                                }`}
                        >
                            {/* 폴더 형태 이미지 (레이어 구현) */}
                            <div className="relative w-[70px] h-[70px] shrink-0 rounded-[2.84px] border-[0.28px] border-[#36383E] bg-[#212224] overflow-hidden">
                                {/* 이미지 레이어 */}
                                <img
                                    src={it.image}
                                    alt="thumbnail"
                                    className="absolute w-[46.64px] h-[61.92px] top-[2.3px] left-[11.65px] object-cover"
                                />
                                {/* 폴더 오버레이 */}
                                <Icon_folder
                                    className="absolute left-0 z-10 w-[69.93px] h-[48.92px] top-[21.01px] pointer-events-none text-[#D9D9D9]"
                                />
                            </div>

                            {/* content */}
                            <div className="flex flex-col flex-1 gap-[2px]">
                                <div className="flex">
                                    <span className="w-[50px] h-[17px] flex justify-center items-center rounded-[5px] bg-gray-900 text-[12px] font-medium leading-[150%] tracking-[-0.025em]">
                                        <span className="bg-gradient-to-b from-[#F7F7F7] to-[#F7F7F780] text-transparent bg-clip-text">
                                            #{it.tag}
                                        </span>
                                    </span>
                                </div>
                                <p className="H4 text-gray-100 mt-0.5 leading-[150%] tracking-[-0.025em]">
                                    {it.title}
                                </p>
                                <p className="text-[10px] font-normal text-gray-100 leading-[150%] tracking-[-0.025em]">
                                    {it.description}
                                </p>
                            </div>

                            {/* 바로가기 버튼 */}
                            <Icon_rightarrow className="text-gray-600 w-6 h-6 shrink-0" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
