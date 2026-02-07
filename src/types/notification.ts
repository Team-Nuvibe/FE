export type NotificationCategory = "채팅" | "미션" | "알림";

// 명세서(NOTI-01 ~ 11)에 맞춘 확정된 타입 정의
export type NotificationType =
  | "TRIBE_CHAT_JOINED"          // NOTI-01: 참여 대기 중 트라이브 생성
  | "TRIBE_CHAT_IMAGE_UPLOADED"  // NOTI-02: 새 이미지 업로드
  | "IMAGE_REACTION"             // NOTI-03: 이미지 반응 발생
  | "TRIBE_CHAT_CLOSING"         // NOTI-04: 종료 예고 (D-1)
  | "TRIBE_CHAT_CLOSED"          // NOTI-05: 종료됨
  | "MISSION_REMINDER"           // NOTI-06: 드랍 미션 리마인드
  | "TAG_RECOMMENDATION"         // NOTI-07: 태그 추천 알림
  | "WEEKLY_RECAP_CREATED"       // NOTI-08: 주간 리캡 생성
  | "FULL_RECAP_UPDATED"         // NOTI-09: 전체 리캡 갱신
  | "PASSWORD_CHANGED"           // NOTI-10: 비밀번호 변경 완료
  | "NICKNAME_CHANGED";          // NOTI-11: 닉네임 변경 완료

// 응답 인터페이스
export interface NotificationResponse {
    notificationId: number;
    type: NotificationType;
    category: NotificationCategory;
    mainMessage: string;
    actionMessage: string;
    relatedId: number | null;
    tribeId: number | null;
    isRead: boolean;
    createdAt: string;
}