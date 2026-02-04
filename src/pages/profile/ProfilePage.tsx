import ChevronRightIcon2 from "@/assets/icons/icon_chevron_right2.svg?react";
import CameraFrame from "@/assets/icons/icon-camera-frame.svg";
import CameraInside from "@/assets/icons/icon-camera-inside.svg";
import { useUserStore } from "@/hooks/useUserStore";
import DefaultProfileImage from "@/assets/images/Default_profile_logo.svg";
import { ProfileImageDisplay } from "@/components/common/ProfileImageDisplay";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { LogoutModal } from "@/components/profile/LogoutModal";
import useLogout from "@/hooks/mutation/auth/useLogout";
import { deleteUser } from "@/apis/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useUserProfileImage, useUserNickname } from "@/hooks/queries/useUser";
import { useUpdateProfileImage } from "@/hooks/mutation/user/useUpdateProfileImage";

import { DeleteAccountModal } from "@/components/profile/DeleteAccountModal";

const ProfilePage = () => {
  const { nickname, profileImage, setProfileImage, setNickname, reset } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();
  const { clearSession } = useAuth();

  // 프로필 이미지 조회
  const { data: profileData } = useUserProfileImage();
  // 닉네임 조회
  const { data: nicknameData } = useUserNickname();

  const { mutate: updateImage } = useUpdateProfileImage();

  // API로부터 프로필 이미지 동기화
  useEffect(() => {
    if (profileData?.data?.profileImage) {
      setProfileImage(profileData.data.profileImage);
    }
  }, [profileData, setProfileImage]);

  // API로부터 닉네임 동기화
  useEffect(() => {
    if (nicknameData?.data?.nickname) {
      // useUserStore의 setNickname 사용
      // 하지만 useUserStore는 export되지 않은 set함수들만 있음 -> destructuring 필요
      // 이미 useUserStore()에서 nickname 등 가져옴. 
      // 여기서 setNickname을 가져와야 함.
      setNickname(nicknameData.data.nickname);
    }
  }, [nicknameData, setNickname]);

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
      // API로 이미지 업로드
      updateImage(file, {
        onSuccess: () => {
          setToastMessage("프로필 이미지가 변경되었습니다.");
          setTimeout(() => setToastMessage(null), 3000);
        },
        onError: (error) => {
          console.error("프로필 이미지 업로드 실패:", error);
          setToastMessage("이미지 업로드에 실패했습니다.");
          setTimeout(() => setToastMessage(null), 3000);
        },
      });

      // 미리보기용 로컬 업데이트
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

  const handleDeleteAccount = async () => {
    setIsDeleteModalOpen(false);
    try {
      await deleteUser();
      // 성공 시 세션 정리 및 로그인 페이지로 이동
      reset();
      clearSession();
      queryClient.clear();

      navigate("/login", {
        replace: true,
        state: {
          toastMessage: "계정이 삭제되었습니다."
        }
      });
    } catch (error) {
      console.error("Account deletion failed:", error);
      setToastMessage("계정 삭제에 실패했습니다.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const menuGroups = [
    {
      title: "계정관리",
      items: [
        {
          label: "닉네임 변경",
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
          label: "개인정보 수집·이용 동의서",
          onClick: () => navigate("/profile/info/privacy-collection"),
          hasArrow: true,
        },
      ],
    },
  ];

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-black text-white">
      <div className="mt-[38.06px] mb-8 flex flex-col items-center">
        <div className="relative mb-[12px] w-[89.79px] h-[89.79px]">
          {profileImage === DefaultProfileImage ? (
            <div className="h-full w-full overflow-visible">
              <img
                src={profileImage}
                alt="profile"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <ProfileImageDisplay
              src={profileImage}
              className="h-full w-full"
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
            className="absolute left-[68.58px] top-[67.37px] h-[24px] w-[24px] p-0 bg-transparent block"
            aria-label="Change profile picture"
          >
            <img src={CameraFrame} alt="" className="absolute inset-0 w-full h-full" />
            <img
              src={CameraInside}
              alt=""
              className="absolute z-10 w-[16.6px] h-[16.8px] left-[3.53px] top-[3.84px]"
            />
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
