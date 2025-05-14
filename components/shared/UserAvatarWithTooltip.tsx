"use client"

import { useState, useRef, useEffect } from 'react';
import { TooltipComponent } from './TooltipComponent';

interface UserAvatarProps {
    user: {
        name?: string;
        imageUrl?: string;
    } | null;
    size?: number;
    tooltipDistance?: number;
}

const UserAvatarWithTooltip: React.FC<UserAvatarProps> = ({
    user,
    size = 40,
    tooltipDistance = 12
}) => {
    const [showUserName, setShowUserName] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => setShowUserName(true);
    const handleMouseLeave = () => setShowUserName(false);

    const userName = user?.name ?? "Anonymous";

    return (
        <div
            ref={containerRef}
            className='relative flex items-center mb-5'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Avatar container with fixed dimensions */}
            <div
                className='flex items-center justify-center cursor-pointer'
                style={{ width: `${size}px`, height: `${size}px` }}
            >
                <img
                    src={user?.imageUrl ?? `/avatar/default-avatar.png`}
                    alt={`${userName}'s avatar`}
                    className='rounded-lg w-full h-full object-cover'
                />
            </div>

            {/* Right-aligned tooltip */}

            { user && <TooltipComponent showTooltip={showUserName} text={userName} size={size} tooltipDistance={tooltipDistance} />}

        </div>
    );
};

export default UserAvatarWithTooltip;