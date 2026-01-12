import ChevronRightIcon2 from '@/assets/icons/icon_chevron_right2.svg?react';
import ChangeProfileIcon from '@/assets/icons/icon_change_profile_picture.svg?react';
import { useUserStore } from '@/hooks/useUserStore';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { nickname, profileImage, setProfileImage } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const navigate = useNavigate();
  const menuGroups = [
    {
      title: "계정관리",
      items: [
        { label: "닉네임", onClick: () => navigate('/profile/edit/nickname'), hasArrow: true },
        { label: "이메일 변경", onClick: () => navigate('/profile/edit/email'), hasArrow: true },
        { label: "비밀번호 변경", onClick: () => navigate('/profile/edit/password'), hasArrow: true },
        { label: "로그아웃", onClick: () => { }, hasArrow: false },
        { label: "계정삭제", onClick: () => { }, hasArrow: false },
      ]
    },
    {
      title: "설정",
      items: [
        { label: "알림", onClick: () => navigate('/profile/setting/notifications'), hasArrow: true },
        { label: "서비스 이용약관", onClick: () => navigate('/profile/info/terms'), hasArrow: true },
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-black text-white flex flex-col overflow-y-auto">
      {/* Profile Header Section */}
      <div className="flex flex-col items-center mt-[100px] mb-8">
        <div className="relative mb-[12px]">
          <div className="w-[89.79px] h-[89.79px] rounded-full overflow-hidden">
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
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

        {/* Name */}
        <div className="
          font-['Pretendard'] 
          font-[500] 
          text-[35.4px] 
          text-[#F7F7F7] 
          leading-[140%] 
          tracking-[-0.03em]
          text-center
        ">
          {nickname}
        </div>
      </div>

      {/* Menu Sections */}
      < div className="flex-1 px-4 pb-24" >
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
    </div>
  );
};

export default ProfilePage;
