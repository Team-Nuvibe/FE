import React from 'react';

interface BulletItemProps {
    children: React.ReactNode;
}

export const BulletItem = ({ children }: BulletItemProps) => (
    <div className="flex items-start">
        <span className="shrink-0 mr-[4px]">•</span>
        <p className="text-gray-300 font-normal break-keep">
            {children}
        </p>
    </div>
);
