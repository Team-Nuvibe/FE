import type { ChatRoom } from '../types/tribeChat';

export const MY_ROOMS: ChatRoom[] = [
    {
        id: '1',
        title: '#Soft',
        memberCount: 94,
        lastMessageTime: '9:15 p.m',
        unreadCount: 3,
        isPinned: true,
        isMuted: true,
        tags: ['#Soft']
    },
    {
        id: '2',
        title: '#Soft',
        memberCount: 94,
        lastMessageTime: '9:15 p.m',
        unreadCount: 0,
        tags: ['#Soft']
    }
];

export const WAITING_ROOMS: ChatRoom[] = [
    {
        id: 'w1',
        title: '#Heavy',
        memberCount: 5, // >= 5 (입장 가능)
        lastMessageTime: '',
        unreadCount: 0,
        tags: ['#Heavy']
    },
    {
        id: 'w2',
        title: '#Warm',
        memberCount: 2, // < 5 (대기중)
        lastMessageTime: '',
        unreadCount: 0,
        tags: ['#Warm']
    },
    {
        id: 'w3',
        title: '#Soft',
        memberCount: 4,
        lastMessageTime: '',
        unreadCount: 0,
        tags: ['#Soft']
    },
    {
        id: 'w4',
        title: '#Soft',
        memberCount: 3,
        lastMessageTime: '',
        unreadCount: 0,
        tags: ['#Soft']
    }
];
