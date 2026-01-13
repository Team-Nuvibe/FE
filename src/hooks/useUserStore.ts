import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import DefaultProfileImage from '@/assets/images/Default_profile_logo.svg';

interface UserState {
    nickname: string;
    profileImage: string;
    email: string;
    password: string;
    setNickname: (nickname: string) => void;
    setProfileImage: (image: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            nickname: 'Viber',
            profileImage: DefaultProfileImage,
            email: 'nuvibe_test@google.com',
            password: 'password123!',
            setNickname: (nickname) => set({ nickname }),
            setProfileImage: (image) => set({ profileImage: image }),
            setEmail: (email) => set({ email }),
            setPassword: (password) => set({ password }),
        }),
        {
            name: 'user-storage',
        }
    )
);
