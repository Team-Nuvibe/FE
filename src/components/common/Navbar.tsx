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
    // shadow: blur 32, #121212, Opacity 50% 반영
    <nav className="z-50 flex h-16.25 w-70.5 items-center justify-center -space-x-2.5 rounded-[40px] bg-gray-900/90 py-1.25 backdrop-blur-[20px] border-t border-gray-800 shadow-[0_0_32px_0_rgba(18,18,18,0.5)]">  
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex w-19.5 flex-col items-center justify-center gap-1.5 pt-1.5 pb-1.75 px-2 transition-colors ${
              isActive ? "text-white" : "text-gray-600"
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
              <span className={`text-[10px] leading-3 font-normal font-weight-400 text-align-center transition-colors ${
              isActive ? "text-gray-100" : "text-gray-600"}`}>
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
