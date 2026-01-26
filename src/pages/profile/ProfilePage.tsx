import ChevronRightIcon2 from "@/assets/icons/icon_chevron_right2.svg?react";
import ChangeProfileIcon from "@/assets/icons/icon_change_profile_picture.svg?react";
import { useUserStore } from "@/hooks/useUserStore";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import { ProfileImageDisplay } from "@/components/common/ProfileImageDisplay";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { LogoutModal } from "@/components/profile/LogoutModal";
import useLogout from "@/hooks/mutation/auth/useLogout";
import useDeleteUser from "@/hooks/mutation/auth/useDeleteUser";

import { DeleteAccountModal } from "@/components/profile/DeleteAccountModal";

const ProfilePage = () => {
  const { nickname, profileImage, setProfileImage, reset } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { mutate: deleteUser } = useDeleteUser();

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToastMessage(location.state.toastMessage);
      const timer = setTimeout(() => {
        setToastMessage(null);
        window.history.replaceState({}, document.title);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    reset(); // 저장된 데이터 초기화
    logout();
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    reset(); // 저장된 데이터 초기화
    deleteUser();
  };

  const menuGroups = [
    {
      title: "계정관리",
      items: [
        {
          label: "닉네임",
          onClick: () => navigate("/profile/edit/nickname"),
          hasArrow: true,
        },
        {
          label: "이메일 변경",
          onClick: () => navigate("/profile/edit/email"),
          hasArrow: true,
        },
        {
          label: "비밀번호 변경",
          onClick: () => navigate("/profile/edit/password"),
          hasArrow: true,
        },
        {
          label: "로그아웃",
          onClick: () => setIsLogoutModalOpen(true),
          hasArrow: false,
        },
        {
          label: "계정삭제",
          onClick: () => setIsDeleteModalOpen(true),
          hasArrow: false,
        },
      ],
    },
    {
      title: "설정",
      items: [
        {
          label: "알림",
          onClick: () => navigate("/profile/setting/notifications"),
          hasArrow: true,
        },
        {
          label: "서비스 이용약관",
          onClick: () => navigate("/profile/info/terms"),
          hasArrow: true,
        },
        {
          label: "개인정보 처리 방침",
          onClick: () => navigate("/profile/info/privacy-policy"),
          hasArrow: true,
        },
        {
          label: "개인정보 수집 및 이용 동의",
          onClick: () => navigate("/profile/info/privacy-collection"),
          hasArrow: true,
        },
      ],
    },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-black text-white">
      <div className="mt-[38.06px] mb-8 flex flex-col items-center">
        <div className="relative mb-[12px]">
          {profileImage === DefaultProfileImage ? (
            <div className="h-[89.79px] w-[89.79px] overflow-visible">
              <img
                src={profileImage}
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <ProfileImageDisplay
              src={profileImage}
              className="h-[89.79px] w-[89.79px]"
            />
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={handleCameraClick}
            className="absolute right-0 bottom-0 flex h-[21.22px] w-[21.22px] items-center justify-center rounded-full bg-[#9C9C9C]"
            aria-label="Change profile picture"
          >
            <ChangeProfileIcon className="h-[14px] w-[14px] text-black" />
          </button>
        </div>

        <div className="text-center font-['Pretendard'] text-[28px] leading-[140%] font-[500] tracking-[-0.03em] text-[#F7F7F7]">
          {nickname}
        </div>
      </div>

      <div className="flex-1 px-4 pb-24">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <h2 className="ST1 mb-2 px-1 leading-[150%] tracking-[-0.025em] text-gray-200">
              {group.title}
            </h2>
            <div className="flex flex-col gap-2">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="flex h-[48px] w-full items-center justify-between rounded-[5px] bg-gray-900 py-[12px] pr-[10px] pl-[12px] transition-transform active:scale-[0.99]"
                >
                  <span className="B2 leading-[150%] tracking-[-0.025em] text-gray-300">
                    {item.label}
                  </span>
                  {item.hasArrow && (
                    <ChevronRightIcon2 className="h-[24px] w-[24px] text-gray-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {toastMessage && (
        <div className="animate-fade-in-out pointer-events-none fixed bottom-[113px] left-1/2 z-[9999] flex w-full max-w-[393px] -translate-x-1/2 justify-center px-[24.5px]">
          <div className="flex h-[48px] w-full items-center justify-center rounded-[5px] bg-[#D0D3D7]/85 px-[12px] py-[10px] text-[14px] leading-[150%] font-normal tracking-[-0.025em] text-black shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[30px]">
            {toastMessage}
          </div>
        </div>
      )}

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};
export default ProfilePage;
