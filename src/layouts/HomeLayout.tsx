import { Outlet } from "react-router-dom";

export const HomeLayout = () => {
  return (
    <div className="relative flex flex-col w-full min-h-[100dvh]">
      <Outlet />
    </div>
  );
};