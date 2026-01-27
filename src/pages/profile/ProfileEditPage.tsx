import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '@/hooks/useUserStore';
import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
import { useState, useEffect } from 'react';
import { EmailVerificationModal } from '@/components/profile/EmailVerificationModal';
import { EmailVerificationCodeSheet } from '@/components/profile/EmailVerificationCodeSheet';
import PwChangeProcess1 from '@/assets/icons/icon_pwchange_process1.svg?react';
import PwChangeProcess2 from '@/assets/icons/icon_pwchange_process2.svg?react';
import { useUpdateNickname } from '@/hooks/mutation/user/useUpdateNickname';
import {
    useSendEmailVerification,
    useVerifyEmailCode,
    useUpdateEmail,
} from '@/hooks/mutation/user/useUpdateEmail';
import { useUpdatePassword } from '@/hooks/mutation/user/useUpdatePassword';
import { checkPassword } from '@/apis/auth';
import { useNavbarActions } from '@/hooks/useNavbarStore';

const ProfileEditPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { nickname, email, setEmail } = useUserStore();
    const { setNavbarVisible } = useNavbarActions();

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // API Hooks
    const { mutate: updateNickname, isPending: isNicknamePending } = useUpdateNickname();
    const { mutate: sendEmailCode, isPending: isSendingEmail } = useSendEmailVerification();
    const { mutate: verifyCode, isPending: isVerifyingCode } = useVerifyEmailCode();
    const { mutate: updateEmailMutation, isPending: isUpdatingEmail } = useUpdateEmail();
    const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword();

    const [newNickname, setNewNickname] = useState('');

    const [newEmail, setNewEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);

    const [passwordStep, setPasswordStep] = useState<'verify' | 'change'>('verify');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);

    const isSaving = isNicknamePending || isSendingEmail || isVerifyingCode || isUpdatingEmail || isUpdatingPassword;

    const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(newPassword);
    const isPasswordMatch = newPassword === confirmPassword;
    const isSameAsCurrent = newPassword === currentPassword && newPassword.length > 0;

    // Reset password state when entering password edit page
    useEffect(() => {
        if (type === 'password') {
            setPasswordStep('verify');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordError('');
        }
    }, [type]);

    // Hide Navbar on mount, show on unmount
    useEffect(() => {
        setNavbarVisible(false);
        return () => {
            setNavbarVisible(true);
        };
    }, [setNavbarVisible]);

    const handleSave = () => {
        // 모바일 키보드 닫기
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        if (type === 'nickname' && newNickname.length > 0) {
            updateNickname(
                { nickname: newNickname },
                {
                    onSuccess: () => {
                        setTimeout(() => {
                            navigate('/profile', {
                                replace: true,
                                state: { toastMessage: '닉네임이 성공적으로 변경되었습니다.' }
                            });
                        }, 100);
                    },
                    onError: (error: any) => {
                        let message = error.response?.data?.message || error.message;
                        // 14일 제한 에러 메시지 커스텀
                        if (message.includes('14일')) {
                            message = '닉네임은 변경 후, 14일 뒤에 다시 변경할 수 있어요.';
                        }
                        setToastMessage(message);
                        setTimeout(() => setToastMessage(null), 3000);
                        console.error('닉네임 변경 실패:', message);
                    },
                }
            );
        } else if (type === 'email' && isEmailVerified) {
            updateEmailMutation(
                { email: newEmail },
                {
                    onSuccess: () => {
                        setTimeout(() => {
                            navigate('/profile', {
                                replace: true,
                                state: { toastMessage: '이메일이 성공적으로 변경되었습니다.' }
                            });
                        }, 100);
                    },
                    onError: (error: any) => {
                        console.error('이메일 변경 실패:', error.response?.data?.message || error.message);
                    },
                }
            );
        } else if (type === 'password' && passwordStep === 'change' && isValidPassword && isPasswordMatch && !isSameAsCurrent) {
            updatePassword(
                {
                    password: newPassword,
                    confirmPassword: confirmPassword,
                },
                {
                    onSuccess: () => {
                        setTimeout(() => {
                            navigate('/profile', {
                                replace: true,
                                state: { toastMessage: '비밀번호가 성공적으로 변경되었습니다.' }
                            });
                        }, 100);
                    },
                    onError: (error: any) => {
                        console.error('비밀번호 변경 실패:', error.response?.data?.message || error.message);
                    },
                }
            );
        }
    };

    const handleVerifyEmail = () => {
        if (!isValidEmail || newEmail === email) return;

        sendEmailCode(
            { email: newEmail },
            {
                onSuccess: () => {
                    setIsModalOpen(true);
                },
                onError: (error: any) => {
                    const message = error.response?.data?.message || '인증 코드 발송에 실패했습니다.';
                    setToastMessage(message);
                    setTimeout(() => setToastMessage(null), 3000);
                    console.error('이메일 인증 코드 발송 실패:', message);
                },
            }
        );
    };

    // 모달 확인 누르면 시트 오픈
    const handleModalConfirm = () => {
        setIsModalOpen(false);
        setIsSheetOpen(true);
    };

    // 시트에서 코드 입력 후 확인
    const handleSheetConfirm = (code: string) => {
        verifyCode(
            { email: newEmail, code },
            {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    setIsEmailVerified(true);
                },
                onError: (error: any) => {
                    console.error('이메일 인증 코드 검증 실패:', error.response?.data?.message || error.message);
                    setToastMessage('인증 코드가 올바르지 않습니다.');
                    setTimeout(() => setToastMessage(null), 3000);
                },
            }
        );
    };

    const handleResendCode = () => {
        sendEmailCode(
            { email: newEmail },
            {
                onSuccess: () => {
                    setToastMessage('인증 코드가 재전송되었습니다.');
                    setTimeout(() => setToastMessage(null), 3000);
                },
                onError: (error: any) => {
                    setToastMessage('인증 코드 재전송 실패');
                    setTimeout(() => setToastMessage(null), 3000);
                }
            }
        );
    };

    const handleNextStep = async () => {
        if (type === 'password' && currentPassword.length >= 8) {
            setIsVerifyingPassword(true);
            setPasswordError('');

            try {
                await checkPassword(currentPassword);
                setPasswordStep('change');
                setPasswordError('');
            } catch (error: any) {
                setPasswordError('비밀번호가 일치하지 않습니다.');
                console.error('비밀번호 확인 실패:', error.response?.data?.message || error.message);
            } finally {
                setIsVerifyingPassword(false);
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
        <div className="w-full h-full bg-black text-white flex flex-col items-center relative">
            <div className="w-full max-w-[393px] h-full flex flex-col px-[16px]">
                <header className="flex items-center justify-center relative mt-[8.06px]">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-0 rotate-180 p-2 -ml-2"
                    >
                        <ChevronRightIcon2 className="text-white w-6 h-6" />
                    </button>
                    <h1 className="text-[20px] font-semibold text-gray-200 leading-[150%] tracking-[-0.025em]">{getTitle()}</h1>
                </header>

                <div className="flex-1 w-full">
                    {type === 'nickname' && (
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col mt-[24px]">
                                <label className="text-gray-300 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[12px]">닉네임 변경</label>

                                <div className="relative w-full bg-gray-800 rounded-[5px] px-[12px] h-[48px] flex items-center mb-[8px]">
                                    <input
                                        type="text"
                                        value={newNickname}
                                        onChange={(e) => setNewNickname(e.target.value.slice(0, 15))}
                                        placeholder="닉네임을 입력해주세요."
                                        className="w-full bg-transparent text-white placeholder:text-gray-600 text-[14px] outline-none font-normal leading-[150%] tracking-[-0.025em] p-0 border-none focus:ring-0"
                                    />
                                    <span className={`absolute right-[12px] text-[10px] leading-[150%] tracking-[-0.025em] ${newNickname.length > 0 ? 'text-gray-100' : 'text-gray-400'}`}>
                                        ({newNickname.length}/15)
                                    </span>
                                </div>

                                <p className="text-[#828282] text-[12px] font-normal leading-[150%] tracking-[-0.025em]">
                                    닉네임은 변경 후, 14일 뒤에 다시 변경할 수 있어요.
                                </p>
                            </div>

                            <div className="flex-1" />

                            <div className="fixed bottom-0 left-0 right-0 w-full max-w-[393px] mx-auto pb-[env(safe-area-inset-bottom)] px-[16px] bg-black">
                                <div className="w-full h-[20px] bg-gradient-to-b from-transparent to-black" />
                                <button
                                    disabled={newNickname.length === 0 || isSaving}
                                    onClick={handleSave}
                                    className={`
                                        w-full rounded-[5px] h-[48px] px-[50px] py-[6px] text-[16px] font-semibold leading-[150%] tracking-[-0.025em] flex items-center justify-center mb-[32px]
                                        ${newNickname.length > 0
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'bg-gray-700 text-gray-900 cursor-not-allowed'}
                                    `}
                                >
                                    저장하기
                                </button>
                            </div>
                        </div>
                    )}

                    {type === 'email' && (
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col mt-[24px]">
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
                                        disabled={!isValidEmail || isEmailVerified || newEmail === email || isSendingEmail}
                                        className={`w-[73px] h-[28px] rounded-[4px] text-[10px] font-medium leading-[150%] tracking-[-0.025em] whitespace-nowrap
                                            ${isEmailVerified
                                                ? 'bg-gray-600 text-gray-900 cursor-default'
                                                : isValidEmail && newEmail !== email
                                                    ? 'bg-gray-300 text-gray-900'
                                                    : 'bg-gray-600 text-gray-900'}
                                        `}
                                    >
                                        {isSendingEmail ? '전송 중...' : isEmailVerified ? '인증 완료' : '인증 코드 받기'}
                                    </button>
                                </div>
                                {newEmail === email && newEmail.length > 0 && !isEmailVerified && (
                                    <p className="text-gray-300 text-[12px] font-normal leading-[150%] tracking-[-0.025em] mt-[8px]">
                                        이미 가입된 이메일이에요.
                                    </p>
                                )}
                            </div>

                            <div className="flex-1" />

                            <div className="fixed bottom-0 left-0 right-0 w-full max-w-[393px] mx-auto pb-[env(safe-area-inset-bottom)] px-[16px] bg-black">
                                <div className="w-full h-[20px] bg-gradient-to-b from-transparent to-black" />
                                <button
                                    className={`w-full rounded-[5px] h-[48px] px-[50px] py-[6px] text-[16px] font-semibold leading-[150%] tracking-[-0.025em] flex items-center justify-center mb-[32px]
                                        ${isEmailVerified
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'bg-gray-700 text-gray-900 cursor-not-allowed'}
                                    `}
                                    disabled={!isEmailVerified || isSaving}
                                    onClick={handleSave}
                                >
                                    저장하기
                                </button>
                            </div>
                            <EmailVerificationModal
                                isOpen={isModalOpen}
                                title="메일함을 확인해주세요"
                                message="메일이 보이지 않는다면 스팸함을 함께 확인해주세요"
                                onClose={handleModalConfirm}
                            />
                        </div>
                    )}

                    {type === 'password' && (
                        <>
                            <div className="flex-1 overflow-y-auto">
                                {/* Progress Bar */}
                                <div className="w-full mb-[20px]">
                                    {passwordStep === 'verify' ? (
                                        <PwChangeProcess1 className="w-full h-auto" />
                                    ) : (
                                        <PwChangeProcess2 className="w-full h-auto" />
                                    )}
                                </div>

                                {passwordStep === 'verify' ? (
                                    <>
                                        <label className="text-gray-400 text-[14px] font-normal leading-[150%] tracking-[-0.025em] mb-[8px]">
                                            현재 비밀번호
                                        </label>
                                        <div className="w-full bg-gray-800 rounded-[5px] pl-[12px] pr-[11px] py-[6px] h-[48px] flex items-center">
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="현재 비밀번호를 입력해주세요."
                                                className="w-full bg-transparent text-white placeholder:text-gray-500 text-[14px] outline-none font-normal leading-[150%] tracking-[-0.025em] p-0 border-none focus:ring-0"
                                            />
                                        </div>
                                        {passwordError && (
                                            <p className="text-red-500 text-[12px] font-normal leading-[150%] tracking-[-0.025em] mt-[8px]">
                                                {passwordError}
                                            </p>
                                        )}
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
                                        {isSameAsCurrent && newPassword.length > 0 && !isSaving && (
                                            <p className="text-red-500 text-[12px] font-normal leading-[150%] tracking-[-0.025em] mb-[12px]">
                                                새로운 비밀번호를 입력해주세요.
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
                                            <p className={`text-[12px] font-normal leading-[150%] tracking-[-0.025em] mt-[8px] ${isPasswordMatch ? 'text-green-500' : 'text-red-500'}`}>
                                                {isPasswordMatch ? '비밀번호가 일치합니다.' : '동일한 비밀번호를 입력해주세요.'}
                                            </p>
                                        )}
                                        {confirmPassword.length === 0 && <div className="mb-[24px]"></div>}
                                    </>
                                )}
                            </div>

                            {/* Fixed Bottom Button */}
                            <div className="fixed bottom-0 left-0 right-0 w-full max-w-[393px] mx-auto pb-[env(safe-area-inset-bottom)] px-[16px] bg-black">
                                <button
                                    onClick={passwordStep === 'verify' ? handleNextStep : handleSave}
                                    disabled={
                                        passwordStep === 'verify'
                                            ? currentPassword.length < 8
                                            : !isValidPassword || !isPasswordMatch || isSameAsCurrent || isSaving
                                    }
                                    className={`
                                        w-full rounded-[5px] h-[48px] px-[50px] py-[6px] text-[16px] font-semibold leading-[150%] tracking-[-0.025em] flex items-center justify-center
                                        ${(
                                            passwordStep === 'verify'
                                                ? currentPassword.length >= 8
                                                : isValidPassword && isPasswordMatch && !isSameAsCurrent
                                        )
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'bg-gray-700 text-gray-900 cursor-not-allowed'}
                                    `}
                                >
                                    {passwordStep === 'verify' ? '다음' : '저장하기'}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Email Verification Modal & Sheet */}
                <EmailVerificationModal
                    isOpen={isModalOpen}
                    title="메일함을 확인해주세요"
                    message="메일이 보이지 않는다면 스팸함을 함께 확인해주세요"
                    onClose={handleModalConfirm}
                />
                <EmailVerificationCodeSheet
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                    onConfirm={handleSheetConfirm}
                    onResend={handleResendCode}
                    isVerifying={isVerifyingCode}
                />

                {
                    toastMessage && (
                        <div className="animate-fade-in-out pointer-events-none fixed bottom-[113px] left-1/2 z-[9999] flex w-full max-w-[393px] -translate-x-1/2 justify-center px-[24.5px]">
                            <div className="flex h-[48px] w-full items-center justify-center rounded-[5px] bg-[#D0D3D7]/85 px-[12px] py-[10px] text-[14px] leading-[150%] font-normal tracking-[-0.025em] text-black shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[30px]">
                                {toastMessage}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ProfileEditPage;
