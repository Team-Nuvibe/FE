// 사용자 프로필 관련 타입 정의

// 프로필 이미지 조회 응답
export interface UserProfileImageRes {
    profileImage: string;
}

// 닉네임 수정 요청
export interface NicknameUpdateReq {
    nickname: string;
}

// 닉네임 수정 응답
export interface UserNicknameUpdateRes {
    nickname: string;
}

// 이메일 인증 요청
export interface EmailVerificationReq {
    email: string;
}

// 인증 코드 검증 요청
export interface VerifyCodeReq {
    email: string;
    code: string;
}

// 비밀번호 재설정 요청
export interface ReissuePasswordReq {
    password: string;
    confirmPassword: string;
}

// 사용자 설정
export interface UserSetting {
    isServiceAlert: boolean;
    isSecurityAlert: boolean;
    isRecommendAlert: boolean;
    isRecapAlert: boolean;
    isTribeCreateAlert: boolean;
    isTribeChatAlert: boolean;
    isReactionAlert: boolean;
}

// 사용자 설정 수정 요청
export interface UserSettingReq extends UserSetting { }

// 사용자 설정 수정 응답
export interface UserSettingUpdateRes {
    setting: UserSetting;
    changes: string[];
}
