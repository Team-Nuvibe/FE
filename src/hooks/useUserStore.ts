import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import DefaultProfileImage from '@/assets/images/Default_profile_logo.svg';

interface UserState {
    nickname: string;
    profileImage: string;
    setNickname: (nickname: string) => void;
    setProfileImage: (image: string) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            nickname: 'Viber',
            profileImage: DefaultProfileImage,
            setNickname: (nickname) => set({ nickname }),
            setProfileImage: (image) => set({ profileImage: image }),
        }),
        {
            name: 'user-storage',
        }
    )
);
