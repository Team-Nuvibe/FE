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
    <div className="w-full bg-gray-900 rounded-[5px] px-2.5 py-3 flex items-center justify-between mb-2 min-h-15.75">
        <div className="flex flex-col">
            <span className="text-gray-100 text-[14px] font-normal font-weight-400 leading-[150%] tracking-[-0.35px]">
                {title}
            </span>
            <span className="text-gray-300 text-[12px] font-normal font-weight-400 leading-[140%] tracking-[-0.36px]">
                {desc}
            </span>
        </div>
        <button onClick={onToggle} className="shrink-0 ml-2.5">
            {isOn ? (
                <NotificationOnIcon className="w-13.25 h-7" />
            ) : (
                <NotificationOffIcon className="w-13.25 h-7" />
            )}
        </button>
    </div>
);
