import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
import XButtonIcon from '@/assets/icons/icon_xbutton.svg?react';
import ImgPersonalInfo1 from '@/assets/images/img_personal_info1.svg?react';
import ImgPersonalInfo2 from '@/assets/images/img_personal_info2.svg?react';
import ImgPersonalInfo3 from '@/assets/images/img_personal_info3.svg?react';
import { useNavbarActions } from '@/hooks/useNavbarStore';

const ProfileSettingPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { setNavbarVisible } = useNavbarActions();

    useEffect(() => {
        setNavbarVisible(false);
        return () => setNavbarVisible(true);
    }, [setNavbarVisible]);

    const getTitle = () => {
        switch (type) {
            case 'notifications': return '알림 설정';
            case 'terms': return '서비스 이용약관';
            default: return '설정';
        }
    };

    return (
        <div className="w-full h-full bg-black text-white flex flex-col px-[16px]">
            <header className="flex items-center justify-between relative mt-[70px] mb-[28px] shrink-0 h-[30px]">
                <button
                    onClick={() => navigate(-1)}
                    className="rotate-180 p-2 -ml-2"
                >
                    <ChevronRightIcon2 className="text-gray-300 w-6 h-6" />
                </button>
                <h1 className="text-[20px] font-semibold text-gray-200 leading-[150%] tracking-[-0.025em]">{getTitle()}</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -mr-2"
                >
                    <XButtonIcon className="text-gray-300 w-6 h-6" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-hide pb-[40px]">
                {type === 'terms' ? (
                    <div className="mx-[7px] bg-gray-700 rounded-[5px] overflow-hidden">
                        <ImgPersonalInfo1 className="w-full h-auto" />
                        <ImgPersonalInfo2 className="w-full h-auto" />
                        <ImgPersonalInfo3 className="w-full h-auto" />
                    </div>
                ) : type === 'notifications' ? (
                    <div className="text-gray-500 text-center mt-10">
                        알림 설정 페이지 준비 중입니다.
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
