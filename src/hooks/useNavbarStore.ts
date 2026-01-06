import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface NavbarActions {
  setNavbarVisible: (isVisible: boolean) => void;
}

interface NavbarState {
  isNavbarVisible: boolean;
  actions: NavbarActions;
}

export const useNavbarStore = create<NavbarState>()(
  /* eslint-disable @typescript-eslint/no-unused-vars */
  immer((set, _) => ({
    isNavbarVisible: true,
    actions: {
      setNavbarVisible: (isVisible) =>
        set((state) => {
          state.isNavbarVisible = isVisible;
        }),
    },
  }))
);

export const useNavbarInfo = () =>
  useNavbarStore((state) => state.isNavbarVisible);
export const useNavbarActions = () => useNavbarStore((state) => state.actions);
