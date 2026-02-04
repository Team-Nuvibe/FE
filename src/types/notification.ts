export type NotificationCategory = "채팅" | "미션" | "알림";

// 세부 알림 타입
export type ChatNotificationType =
    | "TRIBE_CHAT_OPENED"      // 트라이브챗이 열렸어요
    | "TRIBE_CHAT_CLOSING"     // 트라이브챗이 1시간 후 종료돼요
    | "TRIBE_CHAT_CLOSED"      // 트라이브챗이 종료되었어요
    | "TRIBE_CHAT_MESSAGE";    // 새 메시지가 있어요

export type MissionNotificationType =
    | "MISSION_COMPLETED"      // 미션이 달성되었어요
    | "MISSION_AVAILABLE"      // 새로운 미션이 있어요
    | "MISSION_REWARD";        // 미션 보상을 받으세요

export type AlertNotificationType =
    | "ARCHIVE_COMMENT"        // 아이디어에 댓글이 달렸어요
    | "ARCHIVE_LIKED"          // 아이디어에 좋아요가 눌렸어요
    | "ACCOUNT_PASSWORD"       // 비밀번호가 변경되었어요
    | "ACCOUNT_NICKNAME"       // 닉네임이 변경되었어요
    | "PROFILE_UPDATED";       // 프로필이 업데이트되었어요

export type NotificationSubType =
    | ChatNotificationType
    | MissionNotificationType
    | AlertNotificationType;

export interface Notification {
    id: number;
    category: NotificationCategory;
    type: NotificationSubType;
    image: string;
    tribeName?: string;        // 채팅일 경우 트라이브 이름 (예: "Grain", "비싼")
    title: string;
    description: string;
    isRead: boolean;
    createdAt: string;
    relatedId?: string;        // 연관된 채팅방/게시글 ID
}
