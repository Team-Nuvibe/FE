import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '@/hooks/useUserStore';
import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
import { useState } from 'react';
import { EmailVerificationModal } from '@/components/profile/EmailVerificationModal';

const ProfileEditPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { setNickname, email, setEmail, password: storedPassword, setPassword } = useUserStore();

    const [newNickname, setNewNickname] = useState('');

    const [newEmail, setNewEmail] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);

    const [passwordStep, setPasswordStep] = useState<'verify' | 'change'>('verify');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(newPassword);
    const isPasswordMatch = newPassword === confirmPassword;
    const isSameAsCurrent = newPassword === storedPassword;

    const handleSave = () => {
        if (type === 'nickname' && newNickname.length > 0) {
            setNickname(newNickname);
            navigate('/profile', {
                replace: true,
                state: { toastMessage: '닉네임이 성공적으로 변경되었습니다.' }
            });
        } else if (type === 'email' && isEmailVerified) {
            setEmail(newEmail);
            navigate('/profile', {
                replace: true,
                state: { toastMessage: '이메일이 성공적으로 변경되었습니다.' }
            });
        } else if (type === 'password' && passwordStep === 'change' && isValidPassword && isPasswordMatch && !isSameAsCurrent) {
            setPassword(newPassword);
            navigate('/profile', {
                replace: true,
                state: { toastMessage: '비밀번호가 성공적으로 변경되었습니다.' }
            });
        }
    };

    const handleVerifyEmail = () => {
        setIsModalOpen(true);
    };

    const handleModalConfirm = () => {
        setIsModalOpen(false);
        setIsEmailVerified(true);
    };

    const handleNextStep = () => {
        if (type === 'password') {
            if (currentPassword === storedPassword) {
                setPasswordStep('change');
                setPasswordError('');
            } else {
                setPasswordError('비밀번호가 일치하지 않습니다.');
            }
        }
    };

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
                                닉네임은 변경 후, 14일 뒤에 다시 변경할 수 있어요.
                            </p>
                        </div>

                        <button
                            disabled={newNickname.length === 0}
                            onClick={handleSave}
                            className={`
                                w-full rounded-[5px] h-[48px] px-[50px] py-[6px] mt-[24px] text-[16px] font-semibold leading-[150%] tracking-[-0.025em] flex items-center justify-center
                                ${newNickname.length > 0
                                    ? 'bg-gray-200 text-gray-900'
                                    : 'bg-gray-700 text-gray-900 cursor-not-allowed'}
                            `}
                        >
                            저장하기
                        </button>
                    </div>
                )}

                {type === 'email' && (
                    <div className="flex flex-col">
                        <label className="text-gray-300 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[8px]">
                            현재 이메일
                        </label>
                        <div className="w-full bg-gray-800 rounded-[5px] px-[12px] h-[48px] flex items-center mb-[12px]">
                            <span className="text-gray-100 text-[16px] font-medium leading-[150%] tracking-[-0.025em]">
                                {email}
                            </span>
                        </div>

                        <label className="text-gray-300 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[8px]">
                            새로운 이메일
                        </label>
                        <div className="relative w-full bg-gray-800 rounded-[5px] pl-[12px] pr-[6px] h-[48px] flex items-center justify-between">
                            <input
                                type="text"
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    setIsEmailVerified(false);
                                }}
                                placeholder="새로운 이메일을 입력해주세요."
                                className="flex-1 bg-transparent text-gray-100 placeholder:text-gray-600 text-[16px] outline-none font-medium placeholder:text-[14px] placeholder:font-normal leading-[150%] tracking-[-0.025em] p-0 border-none focus:ring-0 mr-2"
                            />
                            <button
                                onClick={handleVerifyEmail}
                                disabled={!isValidEmail || isEmailVerified}
                                className={`w-[73px] h-[28px] rounded-[4px] text-[10px] font-medium leading-[150%] tracking-[-0.025em] whitespace-nowrap
                                    ${isEmailVerified
                                        ? 'bg-gray-600 text-gray-900 cursor-default'
                                        : isValidEmail
                                            ? 'bg-gray-300 text-gray-900'
                                            : 'bg-gray-600 text-gray-900'}
                                `}
                            >
                                {isEmailVerified ? '인증 완료' : '이메일 인증'}
                            </button>
                        </div>

                        <button
                            className={`w-full rounded-[5px] h-[48px] px-[50px] py-[6px] mt-[24px] text-[16px] font-semibold leading-[150%] tracking-[-0.025em] flex items-center justify-center
                                ${isEmailVerified
                                    ? 'bg-gray-200 text-gray-900'
                                    : 'bg-gray-700 text-gray-900 cursor-not-allowed'}
                            `}
                            disabled={!isEmailVerified}
                            onClick={handleSave}
                        >
                            저장하기
                        </button>

                        <EmailVerificationModal
                            isOpen={isModalOpen}
                            title="메일함을 확인해주세요"
                            message="메일이 보이지 않는다면 스팸함을 함께 확인해주세요"
                            onClose={handleModalConfirm}
                        />
                    </div>
                )}

                {type === 'password' && (
                    <div className="flex flex-col">
                        {passwordStep === 'verify' ? (
                            <>
                                <label className="text-gray-400 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[8px]">
                                    현재 비밀번호
                                </label>
                                <div className="w-full bg-gray-800 rounded-[5px] pl-[12px] pr-[11px] py-[6px] h-[48px] flex items-center mb-[24px]">
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="현재 비밀번호를 입력해주세요."
                                        className="w-full bg-transparent text-white placeholder:text-gray-500 text-[14px] outline-none font-normal leading-[150%] tracking-[-0.025em] p-0 border-none focus:ring-0"
                                    />
                                </div>
                                {passwordError && (
                                    <p className="text-red-500 text-[12px] font-normal leading-[150%] tracking-[-0.025em] mb-[24px]">
                                        {passwordError}
                                    </p>
                                )}
                                <button
                                    onClick={handleNextStep}
                                    disabled={currentPassword.length < 8}
                                    className={`
                                        w-full rounded-[5px] h-[48px] px-[50px] py-[6px] text-[16px] font-semibold leading-[150%] tracking-[-0.025em] flex items-center justify-center
                                        ${currentPassword.length >= 8
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'bg-gray-700 text-gray-900 cursor-not-allowed'}
                                    `}
                                >
                                    다음
                                </button>
                            </>
                        ) : (
                            <>
                                <label className="text-gray-400 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[8px]">
                                    새 비밀번호
                                </label>
                                <div className="w-full bg-gray-800 rounded-[5px] pl-[12px] pr-[11px] py-[6px] h-[48px] flex items-center mb-[12px]">
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="8~20자의 영문, 숫자, 특수문자를 조합해 주세요."
                                        className="w-full bg-transparent text-white placeholder:text-gray-500 text-[14px] outline-none font-normal leading-[150%] tracking-[-0.025em] p-0 border-none focus:ring-0"
                                    />
                                </div>
                                {isSameAsCurrent && newPassword.length > 0 && (
                                    <p className="text-red-500 text-[12px] font-normal leading-[150%] tracking-[-0.025em] mb-[12px]">
                                        현재 비밀번호와 다른 비밀번호를 입력해주세요.
                                    </p>
                                )}

                                <label className="text-gray-400 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[8px]">
                                    새 비밀번호 확인
                                </label>
                                <div className="w-full bg-gray-800 rounded-[5px] pl-[12px] pr-[11px] py-[6px] h-[48px] flex items-center mb-[8px]">
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="동일한 비밀번호를 입력해주세요."
                                        className="w-full bg-transparent text-white placeholder:text-gray-500 text-[14px] outline-none font-normal leading-[150%] tracking-[-0.025em] p-0 border-none focus:ring-0"
                                    />
                                </div>

                                {confirmPassword.length > 0 && (
                                    <p className={`text-[12px] font-normal leading-[150%] tracking-[-0.025em] mb-[24px] ${isPasswordMatch ? 'text-green-500' : 'text-red-500'}`}>
                                        {isPasswordMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                                    </p>
                                )}
                                {confirmPassword.length === 0 && <div className="mb-[24px]"></div>}

                                <button
                                    onClick={handleSave}
                                    disabled={!isValidPassword || !isPasswordMatch || isSameAsCurrent}
                                    className={`
                                        w-full rounded-[5px] h-[48px] px-[50px] py-[6px] text-[16px] font-semibold leading-[150%] tracking-[-0.025em] flex items-center justify-center
                                        ${isValidPassword && isPasswordMatch && !isSameAsCurrent
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'bg-gray-700 text-gray-900 cursor-not-allowed'}
                                    `}
                                >
                                    저장하기
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileEditPage;
