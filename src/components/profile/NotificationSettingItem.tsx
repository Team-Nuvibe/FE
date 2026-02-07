import NotificationOnIcon from '@/assets/icons/icon_notification_on.svg?react';
import NotificationOffIcon from '@/assets/icons/icon_notification_off.svg?react';

interface NotificationSettingItemProps {
    title: string;
    desc: string;
    isOn: boolean;
    onToggle: () => void;
}

export const NotificationSettingItem = ({
    title,
    desc,
    isOn,
    onToggle
}: NotificationSettingItemProps) => (
    <div className="w-full bg-gray-800 rounded-[5px] pl-[12px] pr-[10px] py-[12px] flex items-center justify-between mb-[8px] min-h-[63px]">
        <div className="flex flex-col gap-[4px]">
            <span className="text-gray-100 text-[14px] font-normal leading-[150%] tracking-[-0.025em]">
                {title}
            </span>
            <span className="text-gray-300 text-[12px] font-normal leading-[140%] tracking-[-0.03em]">
                {desc}
            </span>
        </div>
        <button onClick={onToggle} className="shrink-0 ml-[12px]">
            {isOn ? (
                <NotificationOnIcon className="w-[53px] h-[28px]" />
            ) : (
                <NotificationOffIcon className="w-[53px] h-[28px]" />
            )}
        </button>
    </div>
);
