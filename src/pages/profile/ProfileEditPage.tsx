import { useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '@/hooks/useUserStore';
import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
import IconPasswordEyeClose from '@/assets/icons/icon_password_eyeclose.svg?react';
import IconPasswordEyeOpen from '@/assets/icons/icon_password_eyeopen.svg?react';
import IconPasswordAvailable from '@/assets/icons/icon_password_change_available.svg?react';
import { useState, useEffect } from 'react';
import { EmailVerificationModal } from '@/components/profile/EmailVerificationModal';
import { EmailVerificationCodeSheet } from '@/components/profile/EmailVerificationCodeSheet';
import { BaseModal } from '@/components/onboarding/BaseModal';
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
    const { email, nickname } = useUserStore();

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
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
    const [nextAvailableDate, setNextAvailableDate] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);

    const [passwordStep, setPasswordStep] = useState<'verify' | 'change'>('verify');

    // Password Visibility States
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isConfirmBlurred, setIsConfirmBlurred] = useState(false);
    const [isNewPwFocused, setIsNewPwFocused] = useState(false);
    const [isNewPwBlurred, setIsNewPwBlurred] = useState(false);
    const [isConfirmFocused, setIsConfirmFocused] = useState(false);

    const isSaving = isNicknamePending || isSendingEmail || isVerifyingCode || isUpdatingEmail || isUpdatingPassword;

    const isValidPassword = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/.test(newPassword);
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
            setIsConfirmBlurred(false);
            setIsNewPwFocused(false);
            setIsNewPwBlurred(false);
            setIsConfirmFocused(false);
        }
    }, [type]);

    useEffect(() => {
        setNavbarVisible(false); // 페이지 진입 시 네비바 숨기기
        return () => setNavbarVisible(true); // 페이지 나갈 때 네비바 다시 보이기
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
                        const message = error.response?.data?.message || error.message;
                        const nextDate = error.response?.data?.data?.nextAvailableDate;

                        // 14일 제한 에러인 경우
                        if (message.includes('14일') && nextDate) {
                            setNextAvailableDate(nextDate);
                            setIsNicknameModalOpen(true);
                            return;
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
                    setVerificationError('인증 코드가 일치하지 않아요.');
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
                onError: () => {
                    setToastMessage('인증 코드 재전송 실패');
                    setTimeout(() => setToastMessage(null), 3000);
                }
            }
        );
    };

    const handleNextStep = async () => {
        if (type === 'password' && currentPassword.length >= 8) {
            setPasswordError('');
            try {
                await checkPassword(currentPassword);
                setPasswordStep('change');
                setPasswordError('');
            } catch (error: any) {
                setPasswordError('비밀번호가 일치하지 않아요.');
                console.error('비밀번호 확인 실패:', error.response?.data?.message || error.message);
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
        <div className="w-full h-dvh bg-black text-white flex flex-col items-center relative overflow-hidden">
            <div className="w-full max-w-98.25 h-full flex flex-col px-4">
                <header className="flex items-center justify-center relative mt-[8.06px] h-14 shrink-0">
                    <button
                        onClick={() => {
                            if (type === 'password' && passwordStep === 'change') {
                                setPasswordStep('verify');
                                setNewPassword('');
                                setConfirmPassword('');
                                return;
                            }
                            navigate(-1);
                        }}
                        className="absolute left-0 rotate-180 p-2 -ml-2"
                    >
                        <ChevronRightIcon2 className="text-white w-6 h-6" />
                    </button>
                    <h1 className="text-[20px] font-semibold text-gray-200 leading-[150%] tracking-[-0.25px]">{getTitle()}</h1>
                </header>

                <div className="flex-1 w-full overflow-y-auto scrollbar-hide flex flex-col">
                    {type === 'nickname' && (
                        <div className="flex flex-col flex-1 pb-8">
                            <div className="flex flex-col mt-6">
                                <label className="text-gray-300 text-[14px] font-normal leading-[150%] tracking-[-0.25px] mb-3">닉네임 변경</label>

                                <div className="relative w-full bg-gray-900 rounded-[5px] px-3 h-12 flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={newNickname}
                                        onChange={(e) => setNewNickname(e.target.value.slice(0, 15))}
                                        placeholder="닉네임을 입력해주세요."
                                        className="w-full bg-transparent text-gray-100 placeholder:text-gray-600 text-[16px] outline-none font-normal leading-[150%] tracking-[-0.4px] border-none focus:ring-0"
                                    />
                                    <span className={`absolute right-3 text-[10px] leading-[150%] tracking-[-0.25px] ${newNickname.length > 0 ? 'text-gray-100' : 'text-gray-600'}`}>
                                        ({newNickname.length}/15)
                                    </span>
                                </div>

                                <p className="text-gray-600 text-[12px] font-normal leading-[150%] tracking-[-0.3px]">
                                    닉네임은 변경 후, 14일 뒤에 다시 변경할 수 있어요.
                                </p>
                            </div>
                            <div className="flex-1 min-h-5" />
                            <button
                                onClick={() => {
                                    if (newNickname.length === 0) return;
                                    if (isSaving) return;
                                    if (newNickname === nickname) {
                                        setToastMessage('동일한 닉네임입니다. 새로운 닉네임을 입력해주세요.');
                                        setTimeout(() => setToastMessage(null), 3000);
                                        return;
                                    }
                                    handleSave();
                                }}
                                className={`
                                    w-full rounded-[5px] h-12 px-12.5 py-1.5 text-[16px] font-semibold leading-[150%] tracking-[-0.04px] flex items-center justify-center
                                    ${newNickname.length > 0 && newNickname !== nickname && !isSaving
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'bg-gray-700 text-gray-900 cursor-not-allowed'
                                    }
                                `}
                            >
                                저장하기
                            </button>
                        </div>
                    )}

                    {type === 'email' && (
                        <div className="flex flex-col flex-1 pb-8">
                            <div className="flex flex-col mt-6">
                                <label className="text-gray-300 text-[14px] font-normal leading-[150%] tracking-[-0.35px] mb-3">
                                    현재 이메일
                                </label>
                                <div className="w-full bg-gray-900 rounded-[5px] px-3 py-2.5 h-12 flex items-center mb-4">
                                    <span className="text-gray-100 text-[16px] font-normal leading-[150%] tracking-[-0.4px]">
                                        {email}
                                    </span>
                                </div>

                                <label className="text-gray-300 text-[14px] font-normal leading-[150%] tracking-[-0.35px] mb-3">
                                    새로운 이메일
                                </label>
                                <div className={`relative w-full bg-gray-900 rounded-[5px] px-3 py-2.5 h-12 flex items-center justify-between border ${newEmail === email && newEmail.length > 0 && !isEmailVerified ? 'border-gray-300' : 'border-transparent'} `}>
                                    <input
                                        type="text"
                                        value={newEmail}
                                        onChange={(e) => {
                                            setNewEmail(e.target.value);
                                            setIsEmailVerified(false);
                                        }}
                                        placeholder="이메일을 입력해주세요."
                                        className="flex-1 bg-transparent text-gray-100 placeholder:text-gray-600 text-[16px] outline-none font-normal leading-[150%] tracking-[-0.4px] p-0 border-none focus:ring-0 mr-2"
                                    />
                                    <button
                                        onClick={handleVerifyEmail}
                                        disabled={!isValidEmail || isEmailVerified || newEmail === email || isSendingEmail}
                                        className={`w-18.25 h-7 rounded-sm text-[10px] font-medium leading-[150%] tracking-[-0.025em] whitespace-nowrap
                                            ${isEmailVerified
                                                ? 'bg-gray-600 text-gray-900 cursor-default'
                                                : isValidEmail && newEmail !== email
                                                    ? 'bg-gray-300 text-gray-900'
                                                    : 'bg-gray-600 text-gray-800'
                                            }
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
                            <div className="flex-1 min-h-5" />
                            <button
                                className={`mt-6 w-full rounded-[5px] h-12 px-12.5 py-1.5 text-[16px] font-semibold leading-[150%] tracking-[-0.025em] flex items-center justify-center
                                    ${isEmailVerified
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'bg-gray-700 text-gray-900 cursor-not-allowed'
                                    }
                                `}
                                disabled={!isEmailVerified || isSaving}
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
                        <div className="flex flex-col flex-1 pb-8">
                            {/* Progress Bar */}
                            <div className="w-full mt-[23.5px] mb-5">
                                {passwordStep === 'verify' ? (
                                    <PwChangeProcess1 className="w-full h-auto" />
                                ) : (
                                    <PwChangeProcess2 className="w-full h-auto" />
                                )}
                            </div>

                            {passwordStep === 'verify' ? (
                                <>
                                    <label className="block text-gray-300 text-[14px] font-normal font-weight-400 leading-[150%] tracking-[-0.35px] mb-3">
                                        현재 비밀번호
                                    </label>
                                    <div className={`w-full bg-gray-900 rounded-[5px] px-3 py-3 h-12 flex items-center border ${passwordError ? 'border-gray-300' : 'border-transparent'} `}>
                                        <input
                                            type={showCurrentPw ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => {
                                                setCurrentPassword(e.target.value);
                                                if (passwordError) setPasswordError('');
                                            }}
                                            placeholder="현재 비밀번호를 입력해주세요."
                                            className="flex-1 bg-transparent text-white placeholder:text-gray-600 text-[16px] font-weight-500 outline-none font-normal leading-[150%] tracking-[-0.4px] p-0 border-none focus:ring-0 mr-2"
                                        />
                                        <button onClick={() => setShowCurrentPw(!showCurrentPw)} type="button">
                                            {showCurrentPw ? <IconPasswordEyeOpen className="w-6 h-6" /> : <IconPasswordEyeClose className="w-6 h-6" />}
                                        </button>
                                    </div>
                                    {passwordError && (
                                        <p className="text-gray-300 text-[12px] font-normal font-weight-400 leading-[150%] tracking-[-0.3px] mt-2">
                                            {passwordError}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <label className="block text-gray-300 text-[14px] font-normal font-weight-400 leading-[150%] tracking-[-0.35px] mb-3">
                                        새 비밀번호
                                    </label>
                                    <div className={`w-full bg-gray-900 rounded-[5px] px-3 py-3 h-12 flex items-center mb-2 border ${newPassword.length > 0 && (!isValidPassword || isSameAsCurrent) && isNewPwBlurred ? 'border-gray-300' : 'border-transparent'}`}>
                                        <input
                                            type={showNewPw ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                setIsConfirmBlurred(false);
                                                setIsNewPwBlurred(false);
                                            }}
                                            onFocus={() => setIsNewPwFocused(true)}
                                            onBlur={() => {
                                                setIsNewPwFocused(false);
                                                setIsNewPwBlurred(true);
                                            }}
                                            placeholder="8~20자의 영문, 숫자, 특수문자를 조합해 주세요."
                                            className="flex-1 bg-transparent text-white placeholder:text-gray-600 font-weight-500 text-[16px] outline-none font-normal leading-[150%] tracking-[-0.4px] p-0 border-none focus:ring-0 mr-2"
                                        />
                                        {isValidPassword && !isNewPwFocused && (!isConfirmBlurred || isPasswordMatch) && !isSameAsCurrent ? (
                                            <IconPasswordAvailable className="w-6 h-6" />
                                        ) : (
                                            <button
                                                onClick={() => setShowNewPw(!showNewPw)}
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {showNewPw ? <IconPasswordEyeOpen className="w-6 h-6" /> : <IconPasswordEyeClose className="w-6 h-6" />}
                                            </button>
                                        )}
                                    </div>
                                    {newPassword.length > 0 && (!isValidPassword || isSameAsCurrent) && isNewPwBlurred && (
                                        <p className="text-gray-300 text-[12px] font-normal font-weight-400 leading-[150%] tracking-[-0.3px] mb-4">
                                            {isSameAsCurrent ? "현재 비밀번호와 다른 비밀번호를 입력해 주세요." :
                                                newPassword.length < 8 ? "비밀번호는 8자 이상 입력해 주세요." :
                                                    newPassword.length > 20 ? "비밀번호는 20자 이하 입력해 주세요." :
                                                        "영문, 숫자, 특수문자를 모두 포함해 주세요."}
                                        </p>
                                    )}
                                    {/* Spacer */}
                                    {!(newPassword.length > 0 && (!isValidPassword || isSameAsCurrent) && isNewPwBlurred) ? <div className="mb-4"></div> : null}

                                    <label className="block text-gray-300 text-[14px] font-normal font-weight-400 leading-[150%] tracking-[-0.35px] mb-3">
                                        새 비밀번호 확인
                                    </label>
                                    <div className={`w-full bg-gray-900 rounded-[5px] px-3 py-3 h-12 flex items-center mb-2 border ${confirmPassword.length > 0 && !isPasswordMatch && isConfirmBlurred ? 'border-gray-300' : 'border-transparent'}`}>
                                        <input
                                            type={showConfirmPw ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                if (isConfirmBlurred) setIsConfirmBlurred(false);
                                            }}
                                            onFocus={() => setIsConfirmFocused(true)}
                                            onBlur={() => {
                                                setIsConfirmBlurred(true);
                                                setIsConfirmFocused(false);
                                            }}
                                            placeholder="동일한 비밀번호를 입력해주세요."
                                            className="flex-1 bg-transparent text-white placeholder:text-gray-600 text-[16px] outline-none font-normal leading-[150%] tracking-[-0.4px] p-0 border-none focus:ring-0 mr-2"
                                        />
                                        {isPasswordMatch && confirmPassword.length > 0 && !isConfirmFocused ? (
                                            <IconPasswordAvailable className="w-6 h-6" />
                                        ) : (
                                            <button
                                                onClick={() => setShowConfirmPw(!showConfirmPw)}
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                {showConfirmPw ? <IconPasswordEyeOpen className="w-6 h-6" /> : <IconPasswordEyeClose className="w-6 h-6" />}
                                            </button>
                                        )}
                                    </div>

                                    {confirmPassword.length > 0 && !isPasswordMatch && isConfirmBlurred && (
                                        <p className="text-gray-300 text-[12px] font-normal leading-[150%] tracking-[-0.3px]">
                                            비밀번호를 다시 확인해 주세요.
                                        </p>
                                    )}
                                    {confirmPassword.length === 0 && <div className="mb-6"></div>}
                                </>
                            )}
                            <div className="flex-1 min-h-5" />
                            <button
                                onClick={passwordStep === 'verify' ? handleNextStep : handleSave}
                                disabled={
                                    passwordStep === 'verify'
                                        ? currentPassword.length < 8 || !!passwordError
                                        : !isValidPassword || !isPasswordMatch || isSameAsCurrent || isSaving
                                }
                                className={`
                                    mt-6 w-full rounded-[5px] h-12 px-12.5 py-1.5 text-[16px] font-semibold leading-[150%] tracking-[-0.4px] flex items-center justify-center
                                    ${(
                                        passwordStep === 'verify'
                                            ? currentPassword.length >= 8 && !passwordError
                                            : isValidPassword && isPasswordMatch && !isSameAsCurrent
                                    )
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'bg-gray-700 text-gray-900 cursor-not-allowed'
                                    }
                                `}
                            >
                                {passwordStep === 'verify' ? '다음' : '저장하기'}
                            </button>
                        </div>
                    )}

                    {(() => {
                        if (!nextAvailableDate) return null;

                        // nextAvailableDate는 "2026-02-17" 형식
                        const availableDate = new Date(nextAvailableDate);
                        const formattedDate = `${availableDate.getMonth() + 1}월 ${availableDate.getDate()}일`;

                        return (
                            <BaseModal
                                isOpen={isNicknameModalOpen}
                                onClose={() => setIsNicknameModalOpen(false)}
                                maintext="아직 닉네임을 변경할 수 없어요"
                                subtext={`${formattedDate}부터 다시 변경 가능해요.`}
                            />
                        );
                    })()}
                </div>

                {/* 이메일 인증 모달 및 바텀시트 */}
                <EmailVerificationModal
                    isOpen={isModalOpen}
                    title="메일함을 확인해주세요"
                    message="메일이 보이지 않는다면 스팸함을 함께 확인해주세요"
                    onClose={handleModalConfirm}
                />
                <EmailVerificationCodeSheet
                    isOpen={isSheetOpen}
                    onClose={() => {
                        setIsSheetOpen(false);
                        setVerificationError(null);
                    }}
                    onConfirm={handleSheetConfirm}
                    onResend={handleResendCode}
                    isVerifying={isVerifyingCode}
                    errorMessage={verificationError}
                    onInputChange={() => setVerificationError(null)}
                />

                {
                    toastMessage && (
                        <div className="animate-fade-in-out pointer-events-none fixed bottom-[113px] left-1/2 z-[9999] flex w-full max-w-[393px] -translate-x-1/2 justify-center px-[24.5px]">
                            <div className="flex h-12 w-full items-center justify-center rounded-[5px] bg-[#D0D3D7]/85 px-3 py-2.5 text-[14px] leading-[150%] font-normal tracking-[-0.025em] text-black shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[30px]">
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
