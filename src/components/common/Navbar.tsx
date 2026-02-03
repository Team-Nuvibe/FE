import { NavLink } from "react-router-dom";
import IconHome from "../../assets/icons/icon_navbar_home.svg?react";
import IconHomeActive from "../../assets/icons/icon_navbar_home_active.svg?react";
import IconArchive from "../../assets/icons/icon_navbar_archive.svg?react";
import IconArchiveActive from "../../assets/icons/icon_navbar_archive_active.svg?react";
import IconTribe from "../../assets/icons/icon_navbar_tribe.svg?react";
import IconTribeActive from "../../assets/icons/icon_navbar_tribe_active.svg?react";
import IconProfile from "../../assets/icons/icon_navbar_profile.svg?react";
import IconProfileActive from "../../assets/icons/icon_navbar_profile_active.svg?react";

const Navbar = () => {
  const navItems = [
    {
      path: "/home",
      icon: IconHome,
      activeIcon: IconHomeActive,
      label: "홈",
    },
    {
      path: "/archive-board",
      icon: IconArchive,
      activeIcon: IconArchiveActive,
      label: "아카이브",
    },
    {
      path: "/tribe-chat",
      icon: IconTribe,
      activeIcon: IconTribeActive,
      label: "트라이브 챗",
    },
    {
      path: "/profile",
      icon: IconProfile,
      activeIcon: IconProfileActive,
      label: "프로필",
    },
  ];

  return (
    <nav className="z-50 flex h-[65px] w-[282px] items-center justify-between rounded-[40px] bg-[var(--color-gray-900)]/90 px-6 backdrop-blur-[20px]">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? "text-white" : "text-[#8A8A8A]"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <item.activeIcon width={24} height={24} />
              ) : (
                <item.icon width={24} height={24} />
              )}
              <span className="text-[10px] leading-[12px] font-normal">
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
