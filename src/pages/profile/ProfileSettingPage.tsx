import { useNavigate, useParams } from 'react-router-dom';
import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
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

    const NotificationSettingItem = ({
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

    const BulletItem = ({ children }: { children: React.ReactNode }) => (
        <div className="flex items-start">
            <span className="shrink-0 mr-[4px]">•</span>
            <p className="text-gray-300 font-normal break-keep">
                {children}
            </p>
        </div>
    );

    const renderContent = () => {
        switch (type) {
            case 'terms':
                return (
                    <div className="bg-gray-900 rounded-[10px] overflow-hidden p-[20px] min-h-[500px]">
                        <h2 className="text-[20px] font-semibold text-white leading-[150%] tracking-[-0.025em] mb-[8px]">
                            서비스 이용 약관
                        </h2>
                        <p className="text-gray-300 text-[12px] font-medium leading-[150%] tracking-[-0.025em] mb-[12px]">
                            최종 업데이트: 2025년 12월 30일
                        </p>
                        <div className="flex flex-col text-[12px] leading-[150%] tracking-[-0.025em]">
                            <p className="text-white font-normal mb-[28px]">
                                본 약관은 nuvibe가 제공하는 서비스의 이용 조건과 이용자 및<br /> 서비스의 권리·의무를 규정합니다.
                            </p>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">1. 서비스 이용</p>
                                <BulletItem>nuvibe는 이미지와 태그를 기반으로 감각을 기록하고 연결하는 네트워킹 서비스입니다.</BulletItem>
                                <BulletItem>이용자는 이메일을 통해 계정을 생성하고 서비스를 이용할 수 있습니다.</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">2. 계정 관리</p>
                                <BulletItem>계정 정보는 이용자 본인이 관리해야 합니다.</BulletItem>
                                <BulletItem>계정 도용 또는 부정 사용이 의심될 경우 즉시 서비스에 알려야 합니다.</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">3. 콘텐츠 업로드</p>
                                <BulletItem>이용자는 본인이 권리를 보유한 콘텐츠만 업로드할 수 있습니다.</BulletItem>
                                <BulletItem>타인의 권리를 침해하거나 불법적인 콘텐츠는 제한될 수 있습니다.</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">4. 콘텐츠 권리</p>
                                <BulletItem>이용자가 업로드한 콘텐츠의 저작권은 이용자에게 귀속됩니다.</BulletItem>
                                <BulletItem>서비스 운영 및 노출을 위해 필요한 범위 내에서 nuvibe에 사용 권한이 부여됩니다.</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">5. 금지 행위</p>
                                <p className="text-gray-300 font-normal mb-[2px]">다음 행위는 금지됩니다.</p>
                                <BulletItem>타인 사칭</BulletItem>
                                <BulletItem>불법·유해 콘텐츠 업로드</BulletItem>
                                <BulletItem>서비스 운영을 방해하는 행위</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">6. 서비스 변경 및 중단</p>
                                <p className="text-gray-300 font-normal">
                                    nuvibe는 서비스 개선 또는 운영상 필요에 따라 일부 기능을 변경하거나 중단할 수 있습니다.
                                </p>
                            </div>

                            <div className="flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">7. 책임 제한</p>
                                <p className="text-gray-300 font-normal">
                                    천재지변, 시스템 장애 등 불가항력적인 사유에 대해 서비스는 책임을 지지 않습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'privacy-policy':
                return (
                    <div className="bg-gray-900 rounded-[10px] overflow-hidden p-[20px] min-h-[500px]">
                        <h2 className="text-[20px] font-semibold text-white leading-[150%] tracking-[-0.025em] mb-[8px]">
                            개인정보 처리 방침
                        </h2>
                        <p className="text-gray-300 text-[12px] font-medium leading-[150%] tracking-[-0.025em] mb-[12px]">
                            최종 업데이트: 2025년 12월 30일
                        </p>
                        <div className="flex flex-col text-[12px] leading-[150%] tracking-[-0.025em]">
                            <p className="text-white font-normal mb-[28px]">
                                nuvibe(이하 “서비스”)는 이용자의 개인정보를 중요하게 생각하며,<br />
                                「개인정보 보호법」 등 관련 법령을 준수합니다.<br />
                                본 방침은 nuvibe가 어떤 정보를 수집하고, 어떻게 사용하며, 어떻게<br /> 보호하는지를 설명합니다.
                            </p>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">1. 수집하는 개인정보</p>
                                <p className="text-gray-300 font-normal">nuvibe는 서비스 제공을 위해 아래의 개인정보를 수집합니다.</p>
                                <BulletItem>필수 정보</BulletItem>
                                <BulletItem>이메일 주소</BulletItem>
                                <BulletItem>비밀번호(암호화 처리)</BulletItem>
                                <BulletItem>닉네임</BulletItem>
                                <BulletItem>서비스 이용 기록</BulletItem>
                                <BulletItem>선택 정보</BulletItem>
                                <BulletItem>이미지 콘텐츠</BulletItem>
                                <BulletItem>태그 선택 정보</BulletItem>
                                <BulletItem>알림 설정 정보</BulletItem>
                                <p className="text-gray-300 font-normal"><br />※ nuvibe는 전화번호, 위치정보를 요구하지 않습니다.</p>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">2. 개인정보 이용 목적</p>
                                <p className="text-gray-300 font-normal mb-[2px]">수집한 개인정보는 다음의 목적에만 사용됩니다.</p>
                                <BulletItem>회원 식별 및 로그인 처리</BulletItem>
                                <BulletItem>이미지 드롭, 태그, 트라이브 기능 제공</BulletItem>
                                <BulletItem>아카이브 보드 및 리캡 제공</BulletItem>
                                <BulletItem>서비스 안정성 확보 및 품질 개선</BulletItem>
                                <BulletItem>보안 및 부정 이용 방지</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">3. 개인정보 보관 및 파기</p>
                                <BulletItem>회원 탈퇴 시 개인정보는 즉시 삭제됩니다.</BulletItem>
                                <BulletItem>관련 법령에 따라 보관이 필요한 경우에만 해당 기간 보관됩니다.</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">4. 개인정보 제공 및 위탁</p>
                                <BulletItem>nuvibe는 이용자의 개인정보를 외부에 제공하지 않습니다.</BulletItem>
                                <BulletItem>현재 개인정보 처리 업무를 외부에 위탁하지 않습니다.</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">5. 이용자의 권리</p>
                                <p className="text-gray-300 font-normal">이용자는 언제든지 아래 항목을 요청할 수 있습니다.</p>
                                <BulletItem>개인정보 열람</BulletItem>
                                <BulletItem>수정</BulletItem>
                                <BulletItem>삭제</BulletItem>
                                <BulletItem>회원 탈퇴</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">6. 개인정보 보호 조치</p>
                                <BulletItem>비밀번호 암호화 저장</BulletItem>
                                <BulletItem>접근 권한 최소화</BulletItem>
                                <BulletItem>보안 점검 및 기록 관리</BulletItem>
                            </div>

                            <div className="flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">7. 문의</p>
                                <p className="text-gray-300 font-normal mb-[2px]">개인정보 관련 문의는 아래 이메일로 연락해 주세요.</p>
                                <div className="flex items-center">
                                    <span className="text-gray-300 font-normal">📧 nuvibe.official@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'privacy-collection':
                return (
                    <div className="bg-gray-900 rounded-[10px] overflow-hidden p-[20px] min-h-[500px]">
                        <h2 className="text-[20px] font-semibold text-white leading-[150%] tracking-[-0.025em] mb-[8px]">
                            개인정보 수집·이용 동의
                        </h2>
                        <p className="text-gray-300 text-[12px] font-medium leading-[150%] tracking-[-0.025em] mb-[12px]">
                            최종 업데이트: 2025년 12월 30일
                        </p>
                        <div className="flex flex-col text-[12px] leading-[150%] tracking-[-0.025em]">
                            <p className="text-white font-normal mb-[28px]">
                                nuvibe는 서비스 제공을 위해 꼭 필요한 정보만을 수집·이용합니다.
                            </p>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">1. 수집 항목 및 목적</p>
                                <BulletItem>이메일: 로그인 및 계정 식별</BulletItem>
                                <BulletItem>닉네임: 서비스 내 사용자 구분</BulletItem>
                                <BulletItem>이용 기록: 접속 로그, 이미지 업로드 기록 등 서비스 이용 과정에서 생성되는 정보</BulletItem>
                            </div>

                            <div className="mb-[12px] flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">개인정보 보관 및 이용 기간</p>
                                <BulletItem>회원 탈퇴 시까지 보관하며, 탈퇴 후 즉시 파기합니다.</BulletItem>
                                <BulletItem>단, 관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관 후 파기합니다.</BulletItem>
                            </div>

                            <div className="flex flex-col gap-[2px]">
                                <p className="text-gray-100 font-medium">개인정보 처리 위탁</p>
                                <BulletItem>현재 개인정보 처리 위탁은 없습니다.</BulletItem>
                                <BulletItem>향후 서비스 운영을 위해 위탁이 발생할 경우, 사전 고지 후 동의를 받겠습니다.</BulletItem>
                            </div>

                            <div className="mt-[28px]">
                                <p className="text-white font-normal">
                                    이용자는 언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있으며,<br />
                                    문의는 서비스 고객 문의 메일 support@nuvibe.com을 통해<br /> 가능합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="flex flex-col">
                        {/* 시스템 알림 */}
                        <div className="mb-[38px]">
                            <h2 className="text-gray-400 text-[18px] font-medium leading-[150%] tracking-[-0.025em] mb-[12px]">
                                시스템 알림
                            </h2>
                            <NotificationSettingItem
                                title="서비스 알림"
                                desc="정책 변경, 시스템 공지 등 꼭 필요한 안내만 전달돼요."
                                isOn={settings.service}
                                onToggle={() => toggleSetting('service')}
                            />
                            <NotificationSettingItem
                                title="계정 보안 알림"
                                desc="비밀번호 변경 등 계정 보호를 위한 중요한 알림이에요."
                                isOn={settings.security}
                                onToggle={() => toggleSetting('security')}
                            />
                            <NotificationSettingItem
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
                            <NotificationSettingItem
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
                            <NotificationSettingItem
                                title="트라이브 챗 생성 알림"
                                desc="선택한 태그로 새로운 트라이브가 열리면 알려드려요."
                                isOn={settings.tribeCreation}
                                onToggle={() => toggleSetting('tribeCreation')}
                            />
                            <NotificationSettingItem
                                title="트라이브 챗 채팅 알림"
                                desc="참여 중인 채팅에 새로운 이미지가 올라오면 알려드려요."
                                isOn={settings.tribeChat}
                                onToggle={() => toggleSetting('tribeChat')}
                            />
                            <NotificationSettingItem
                                title="이미지 반응 알림"
                                desc="내가 드롭한 이미지에 반응이 남겨졌을 때 알려드려요."
                                isOn={settings.imageReaction}
                                onToggle={() => toggleSetting('imageReaction')}
                            />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-gray-500 text-center mt-10">
                        페이지 준비 중입니다.
                    </div>
                );
        }
    };

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
                {renderContent()}
            </div>
        </div>
    );
};

export default ProfileSettingPage;
