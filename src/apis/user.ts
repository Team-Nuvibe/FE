import { axiosInstance } from "./axios";
import type { ApiResponse } from "@/types/common";
import type {
    UserProfileImageRes,
    NicknameUpdateReq,
    UserNicknameUpdateRes,
    EmailVerificationReq,
    VerifyCodeReq,
    ReissuePasswordReq,
    UserSettingReq,
    UserSettingUpdateRes,
} from "@/types/user";

// 프로필 이미지 조회
export const getUserProfileImage = async () => {
    const { data } = await axiosInstance.get<ApiResponse<UserProfileImageRes>>(
        "/api/users/profile-image"
    );
    return data;
};

// 프로필 이미지 수정
export const updateProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosInstance.patch<ApiResponse<string>>(
        "/api/users/profile-image",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return data;
};

// 닉네임 수정
export const updateUserNickname = async (request: NicknameUpdateReq) => {
    const { data } = await axiosInstance.patch<
        ApiResponse<UserNicknameUpdateRes>
    >("/api/users/nickname", request);
    return data;
};

// 이메일 변경 - Step 1: 인증 코드 발송
export const sendEmailVerification = async (request: EmailVerificationReq) => {
    const { data } = await axiosInstance.post<ApiResponse<string>>(
        "/api/users/email/verification",
        request
    );
    return data;
};

// 이메일 변경 - Step 2: 인증 코드 검증
export const verifyEmailCode = async (request: VerifyCodeReq) => {
    const { data } = await axiosInstance.post<ApiResponse<string>>(
        "/api/users/email/verify-code",
        request
    );
    return data;
};

// 이메일 변경 - Step 3: 이메일 변경
export const updateEmail = async (request: EmailVerificationReq) => {
    const { data } = await axiosInstance.patch<ApiResponse<string>>(
        "/api/users/email",
        request
    );
    return data;
};

// 비밀번호 재설정
export const reissuePassword = async (request: ReissuePasswordReq) => {
    const { data } = await axiosInstance.patch<ApiResponse<string>>(
        "/api/users/password",
        request
    );
    return data;
};

// 사용자 설정 변경
export const updateUserSettings = async (request: UserSettingReq) => {
    const { data } = await axiosInstance.patch<
        ApiResponse<UserSettingUpdateRes>
    >("/api/users/settings", request);
    return data;
};

// 사용자 닉네임 조회 (archive/vibe 엔드포인트 활용)
export const getUserNickname = async () => {
    const { data } = await axiosInstance.get<ApiResponse<{ nickname: string }>>(
        "/api/archive/vibe"
    );
    return data;
};
