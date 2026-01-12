import { useNavigate, useParams } from 'react-router-dom';
import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';

const ProfileSettingPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();

    const getTitle = () => {
        switch (type) {
            case 'notifications': return '알림 설정';
            case 'terms': return '서비스 이용약관';
            default: return '설정';
        }
    };

    return (
        <div className="w-full h-full bg-black text-white flex flex-col px-[20px]">
            <header className="flex items-center justify-center relative mt-[70px] mb-[58px]">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 rotate-180 p-2 -ml-2"
                >
                    <ChevronRightIcon2 className="text-white w-6 h-6" />
                </button>
                <h1 className="text-[20px] font-semibold text-gray-200 leading-[150%] tracking-[-0.025em]">{getTitle()}</h1>
            </header>

            <div className="flex-1">
                {type === 'notifications' && (
                    <div className="text-gray-500 text-center mt-10">
                        알림 설정 페이지 준비 중입니다.
                    </div>
                )}
                {type === 'terms' && (
                    <div className="text-gray-500 text-center mt-10">
                        이용약관 페이지 준비 중입니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileSettingPage;
