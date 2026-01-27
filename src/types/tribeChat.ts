export interface ChatRoom {
    id: string;
    title: string;
    memberCount: number;
    lastMessageTime?: string;
    unreadCount?: number;
    isPinned?: boolean;
    isMuted?: boolean;
    thumbnailUrl?: string;
    tags?: string[];
}
