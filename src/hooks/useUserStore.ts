import { create } from "zustand";
import { persist } from "zustand/middleware";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";

interface UserState {
  nickname: string;
  profileImage: string;
  email: string;
  provider: string;
  password: string;
  setNickname: (nickname: string) => void;
  setProfileImage: (image: string) => void;
  setEmail: (email: string) => void;
  setProvider: (provider: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      nickname: "",
      profileImage: DefaultProfileImage,
      email: "",
      provider: "",
      password: "",
      setNickname: (nickname) => set({ nickname }),
      setProfileImage: (image) => set({ profileImage: image }),
      setEmail: (email) => set({ email }),
      setProvider: (provider) => set({ provider }),
      setPassword: (password) => set({ password }),
      reset: () =>
        set({
          nickname: "",
          profileImage: DefaultProfileImage,
          email: "",
          provider: "",
          password: "",
        }),
    }),
    {
      name: "user-storage",
    },
  ),
);
