import { useNavigate, useParams } from 'react-router-dom';
import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
import ImgPersonalInfo1 from '@/assets/images/img_personal_info1.svg?react';
import ImgPersonalInfo2 from '@/assets/images/img_personal_info2.svg?react';
import ImgPersonalInfo3 from '@/assets/images/img_personal_info3.svg?react';
import NotificationOnIcon from '@/assets/icons/icon_notification_on.svg?react';
import NotificationOffIcon from '@/assets/icons/icon_notification_off.svg?react';
import { useState } from 'react';
import { useUpdateUserSetting } from '@/hooks/mutation/user/useUpdateUserSetting';

const ProfileSettingPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { mutate: updateSettings } = useUpdateUserSetting();

    // 초기 설정값 모두 true로 설정해두었음. (API에서 가져오는 로직 부재로 기본값 사용)
    const [settings, setSettings] = useState({
        service: true,
        security: true,
        recommend: true,
        recap: true,
        tribeCreation: true,
        tribeChat: true,
        imageReaction: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);

        // API 요청 규격에 맞게 매핑
        updateSettings({
            isServiceAlert: newSettings.service,
            isSecurityAlert: newSettings.security,
            isRecommendAlert: newSettings.recommend,
            isRecapAlert: newSettings.recap,
            isTribeCreateAlert: newSettings.tribeCreation,
            isTribeChatAlert: newSettings.tribeChat,
            isReactionAlert: newSettings.imageReaction,
        });
    };

    const getTitle = () => {
        switch (type) {
            case 'notifications': return '알림 설정';
            case 'terms': return '서비스 이용약관';
            case 'privacy-policy': return '개인정보 처리 방침';
            case 'privacy-collection': return '개인정보 수집·이용 동의서';
            default: return '설정';
        }
    };

    const NotificationItem = ({
        title,
        desc,
        isOn,
        onToggle
    }: {
        title: string;
        desc: string;
        isOn: boolean;
        onToggle: () => void;
    }) => (
        <div className="w-full bg-gray-800 rounded-[5px] pl-[12px] pr-[10px] py-[12px] flex items-center justify-between mb-[8px] min-h-[63px]">
            <div className="flex flex-col gap-[4px]">
                <span className="text-gray-100 text-[14px] font-normal leading-[150%] tracking-[-0.025em]">
                    {title}
                </span>
                <span className="text-gray-300 text-[12px] font-normal leading-[140%] tracking-[-0.03em]">
                    {desc}
                </span>
            </div>
            <button onClick={onToggle} className="shrink-0 ml-[12px]">
                {isOn ? (
                    <NotificationOnIcon className="w-[53px] h-[28px]" />
                ) : (
                    <NotificationOffIcon className="w-[53px] h-[28px]" />
                )}
            </button>
        </div>
    );

    return (
        <div className="w-full h-full bg-black text-white flex flex-col px-[20px]">
            <header className="flex items-center justify-between relative mt-[8.06px] mb-[28px] shrink-0 h-[30px]">
                <button
                    onClick={() => navigate(-1)}
                    className="rotate-180 p-2 -ml-2"
                >
                    <ChevronRightIcon2 className="text-gray-300 w-6 h-6" />
                </button>
                <h1 className="text-[20px] font-semibold text-gray-200 leading-[150%] tracking-[-0.025em]">{getTitle()}</h1>
                <div className="w-10"></div>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-hide pb-[120px]">
                {type === 'terms' ? (
                    <div className="mx-[3px] bg-gray-900 rounded-[5px] overflow-hidden py-[14px] px-[21px]">
                        <ImgPersonalInfo2 className="w-full h-auto" />
                    </div>
                ) : type === 'privacy-policy' ? (
                    <div className="mx-[3px] bg-gray-900 rounded-[5px] overflow-hidden py-[14px] px-[21px]">
                        <ImgPersonalInfo1 className="w-full h-auto" />
                    </div>
                ) : type === 'privacy-collection' ? (
                    <div className="mx-[3px] bg-gray-900 rounded-[5px] overflow-hidden py-[14px] px-[21px]">
                        <ImgPersonalInfo3 className="w-full h-auto" />
                    </div>
                ) : type === 'notifications' ? (
                    <div className="flex flex-col">

                        {/* 시스템 알림 */}
                        <div className="mb-[38px]">
                            <h2 className="text-gray-400 text-[18px] font-medium leading-[150%] tracking-[-0.025em] mb-[12px]">
                                시스템 알림
                            </h2>
                            <NotificationItem
                                title="서비스 알림"
                                desc="정책 변경, 시스템 공지 등 꼭 필요한 안내만 전달돼요."
                                isOn={settings.service}
                                onToggle={() => toggleSetting('service')}
                            />
                            <NotificationItem
                                title="계정 보안 알림"
                                desc="비밀번호 변경 등 계정 보호를 위한 중요한 알림이에요."
                                isOn={settings.security}
                                onToggle={() => toggleSetting('security')}
                            />
                            <NotificationItem
                                title="추천 알림"
                                desc="나의 감각에 맞는 태그와 탐색 제안을 알려드려요."
                                isOn={settings.recommend}
                                onToggle={() => toggleSetting('recommend')}
                            />
                        </div>

                        {/* 아카이브 보드 알림 */}
                        <div className="mb-[38px]">
                            <h2 className="text-gray-400 text-[18px] font-medium leading-[150%] tracking-[-0.025em] mb-[12px]">
                                아카이브 보드 알림
                            </h2>
                            <NotificationItem
                                title="Recap 알림"
                                desc="나의 감각이 정리되었을 때 알려드려요."
                                isOn={settings.recap}
                                onToggle={() => toggleSetting('recap')}
                            />
                        </div>

                        {/* 트라이브 챗 알림 */}
                        <div className="mb-[38px]">
                            <h2 className="text-gray-400 text-[18px] font-medium leading-[150%] tracking-[-0.025em] mb-[12px]">
                                트라이브 챗 알림
                            </h2>
                            <NotificationItem
                                title="트라이브 챗 생성 알림"
                                desc="선택한 태그로 새로운 트라이브가 열리면 알려드려요."
                                isOn={settings.tribeCreation}
                                onToggle={() => toggleSetting('tribeCreation')}
                            />
                            <NotificationItem
                                title="트라이브 챗 채팅 알림"
                                desc="참여 중인 채팅에 새로운 이미지가 올라오면 알려드려요."
                                isOn={settings.tribeChat}
                                onToggle={() => toggleSetting('tribeChat')}
                            />
                            <NotificationItem
                                title="이미지 반응 알림"
                                desc="내가 드롭한 이미지에 반응이 남겨졌을 때 알려드려요."
                                isOn={settings.imageReaction}
                                onToggle={() => toggleSetting('imageReaction')}
                            />
                        </div>

                    </div>
                ) : (
                    <div className="text-gray-500 text-center mt-10">
                        페이지 준비 중입니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSettingPage;
