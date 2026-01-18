import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
import ChangeProfileIcon from '@/assets/icons/icon_change_profile_picture.svg?react';
import { useUserStore } from '@/hooks/useUserStore';
import DefaultProfileImage from '@/assets/images/Default_profile_logo.svg';
import { ProfileImageDisplay } from '@/components/common/ProfileImageDisplay';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { LogoutModal } from '@/components/profile/LogoutModal';

import { DeleteAccountModal } from '@/components/profile/DeleteAccountModal';

const ProfilePage = () => {
  const { nickname, profileImage, setProfileImage, reset } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

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
    navigate('/login', { state: { toastMessage: '로그아웃 되었습니다.' } });
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(false);
    reset(); // 저장된 데이터 초기화
    navigate('/login', { state: { toastMessage: '계정이 성공적으로 삭제 되었습니다.' } });
  };

  const menuGroups = [
    {
      title: "계정관리",
      items: [
        { label: "닉네임", onClick: () => navigate('/profile/edit/nickname'), hasArrow: true },
        { label: "이메일 변경", onClick: () => navigate('/profile/edit/email'), hasArrow: true },
        { label: "비밀번호 변경", onClick: () => navigate('/profile/edit/password'), hasArrow: true },
        { label: "로그아웃", onClick: () => setIsLogoutModalOpen(true), hasArrow: false },
        { label: "계정삭제", onClick: () => setIsDeleteModalOpen(true), hasArrow: false },
      ]
    },
    {
      title: "설정",
      items: [
        { label: "알림", onClick: () => navigate('/profile/setting/notifications'), hasArrow: true },
        { label: "서비스 이용약관", onClick: () => navigate('/profile/info/terms'), hasArrow: true },
        { label: "개인정보 처리 방침", onClick: () => navigate('/profile/info/privacy-policy'), hasArrow: true },
        { label: "개인정보 수집 및 이용 동의", onClick: () => navigate('/profile/info/privacy-collection'), hasArrow: true },
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-black text-white flex flex-col overflow-y-auto">
      <div className="flex flex-col items-center mt-[38.06px] mb-8">
        <div className="relative mb-[12px]">
          {profileImage === DefaultProfileImage ? (
            <div className="w-[89.79px] h-[89.79px] overflow-visible">
              <img
                src={profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <ProfileImageDisplay
              src={profileImage}
              className="w-[89.79px] h-[89.79px]"
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
            className="absolute bottom-0 right-0 w-[21.22px] h-[21.22px] bg-[#9C9C9C] rounded-full flex items-center justify-center"
            aria-label="Change profile picture"
          >
            <ChangeProfileIcon className="w-[14px] h-[14px] text-black" />
          </button>
        </div>

        <div className="
          font-['Pretendard'] 
          font-[500] 
          text-[28px] 
          text-[#F7F7F7] 
          leading-[140%] 
          tracking-[-0.03em]
          text-center
        ">
          {nickname}
        </div>
      </div>

      <div className="flex-1 px-4 pb-24">
        {
          menuGroups.map((group) => (
            <div key={group.title} className="mb-8">
              <h2 className="ST1 text-gray-200 mb-2 px-1 leading-[150%] tracking-[-0.025em]">{group.title}</h2>
              <div className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="w-full bg-gray-900 rounded-[5px] pl-[12px] pr-[10px] py-[12px] h-[48px] flex items-center justify-between active:scale-[0.99] transition-transform"
                  >
                    <span className="text-gray-300 B2 leading-[150%] tracking-[-0.025em]">{item.label}</span>
                    {item.hasArrow && <ChevronRightIcon2 className="text-gray-500 w-[24px] h-[24px]" />}
                  </button>
                ))}
              </div>
            </div>
          ))
        }
      </div>
      {toastMessage && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[113px] w-full max-w-[393px] px-[24.5px] z-[9999] animate-fade-in-out flex justify-center pointer-events-none">
          <div className="w-full h-[48px] bg-[#D0D3D7]/85 backdrop-blur-[30px] text-black text-[14px] font-normal leading-[150%] tracking-[-0.025em] flex items-center justify-center px-[12px] py-[10px] rounded-[5px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
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
