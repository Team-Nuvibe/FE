import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '@/hooks/useUserStore';
import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
import { useEffect, useState } from 'react';
import { useNavbarActions } from '@/hooks/useNavbarStore';

const ProfileEditPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { setNickname } = useUserStore();
    const { setNavbarVisible } = useNavbarActions();
    const [newNickname, setNewNickname] = useState('');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        setNavbarVisible(false);
        return () => setNavbarVisible(true);
    }, [setNavbarVisible]);

    const handleSave = () => {
        if (newNickname.length > 0) {
            setNickname(newNickname);
            setShowToast(true);
            setTimeout(() => {
                navigate(-1);
            }, 1000); // 1초 후 뒤로가기
        }
    };

    // 타입에 따른 제목 매핑
    const getTitle = () => {
        switch (type) {
            case 'nickname': return '닉네임 변경';
            case 'email': return '이메일 변경';
            case 'password': return '비밀번호 변경';
            default: return '설정';
        }
    };

    return (
        <div className="w-full h-full bg-black text-white flex flex-col px-[20px] relative">
            <header className="flex items-center justify-center relative mt-[70px] mb-[42px]">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 rotate-180 p-2 -ml-2"
                >
                    <ChevronRightIcon2 className="text-white w-6 h-6" />
                </button>
                <h1 className="text-[20px] font-semibold text-gray-200 leading-[150%] tracking-[-0.025em]">{getTitle()}</h1>
            </header>

            <div className="flex-1">
                {type === 'nickname' && (
                    <div className="flex flex-col">
                        <div className="bg-gray-900 rounded-[5px] p-[12px] flex flex-col">
                            <label className="text-gray-300 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[12px]">새 닉네임</label>

                            <div className="relative w-full bg-gray-800 rounded-[5px] px-[12px] h-[44px] flex items-center mb-[8px]">
                                <input
                                    type="text"
                                    value={newNickname}
                                    onChange={(e) => setNewNickname(e.target.value.slice(0, 15))}
                                    placeholder="새로운 닉네임을 입력해주세요."
                                    className="w-full bg-transparent text-white placeholder:text-gray-600 text-[14px] outline-none font-normal leading-[150%] tracking-[-0.025em] p-0 border-none focus:ring-0"
                                />
                                <span className="absolute right-[12px] text-gray-400 text-[10px] leading-[150%] tracking-[-0.025em]">
                                    ({newNickname.length}/15)
                                </span>
                            </div>

                            <p className="text-[#828282] text-[12px] font-normal leading-[150%] tracking-[-0.025em]">
                                *닉네임은 변경 후, 14일 뒤에 다시 변경할 수 있어요.
                            </p>
                        </div>

                        <button
                            disabled={newNickname.length === 0}
                            onClick={handleSave}
                            className={`
                                w-full rounded-[5px] h-[48px] px-[50px] py-[6px] mt-[24px] text-[16px] font-semibold leading-[150%] tracking-[-0.025em] transition-colors flex items-center justify-center
                                ${newNickname.length > 0
                                    ? 'bg-gray-200 text-gray-900'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
                            `}
                        >
                            저장하기
                        </button>
                    </div>
                )}

                {/* 다른 타입에 대한 컨텐츠는 추후 구현 */}
                {type !== 'nickname' && (
                    <div className="text-gray-500 text-center mt-10">
                        페이지 준비 중입니다.
                    </div>
                )}
            </div>

            {/* Toast Message */}
            {showToast && (
                <div className="absolute left-0 right-0 bottom-[122px] px-[16px] z-50 animate-fade-in-out flex justify-center">
                    <div className="w-full h-[46px] bg-[#36383E]/80 backdrop-blur-[20px] text-white text-[14px] font-normal leading-[150%] tracking-[-0.025em] flex items-center justify-center rounded-[5px] shadow-lg">
                        닉네임이 성공적으로 변경되었습니다.
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileEditPage;
