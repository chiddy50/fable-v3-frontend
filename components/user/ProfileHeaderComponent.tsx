'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RatingBtnComponent from '../shared/RatingBtnComponent';
import { UserInterface } from '@/interfaces/UserInterface';
import SafeImage from '../shared/SafeImage';

interface ProfileHeaderProps {
    user: UserInterface | null;
}

const ProfileHeaderComponent: FC<ProfileHeaderProps> = ({ user }) => {

    const returnToLastPage = () => {
        window?.history?.back();
    }
    return (
        <div className="w-full bg-gray-50">
            {/* Banner Image */}
            <div className="relative w-full h-[200px] rounded-b-3xl">
                {/* <Image
                    src={user?.backgroundImage ?? `/img/placeholder6.jpg`}
                    alt={`${user?.name ?? "Anonymous"}'s banner`}
                    fill
                    className="object-cover rounded-b-3xl"
                    priority
                /> */}
                <SafeImage 
                src={user?.backgroundImage} 
                alt={`${user?.name ?? "Anonymous"}'s banner`} 
                fill 
                className="rounded-b-3xl" 
                priority 
                />

                <div onClick={returnToLastPage} className="absolute bottom-4 left-4 cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg bg-white">
                    <ArrowLeft size={16} />
                </div>
                
            </div>

            {/* Profile Section */}
            <div className="flex flex-col items-center px-4 pb-6 -mt-16">
                {/* Avatar */}
                <div className="relative w-30 h-30 mb-3">
                    <div className="absolute inset-0 bg-white rounded-full p-1">
                        {/* <Image
                            src={user?.imageUrl ?? "/avatar/default-avatar.png"}
                            alt={`${user?.name ?? "Anonymous"}'s avatar`}
                            width={96}
                            height={96}
                            className="rounded-2xl"
                            priority
                        /> */}
                        <img
                            src={user?.imageUrl ?? "/avatar/default-avatar.png"}
                            alt={`${user?.name ?? "Anonymous"}'s avatar`}
                            className="rounded-full w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = user?.imageUrl ?? "/avatar/default-avatar.png";
                            }}
                        />
                    </div>
                </div>

                {/* Username */}
                <h1 className="text-2xl font-bold text-gray-800 mt-4">@{user?.name ?? "Anonymous"}</h1>

                {/* Publications count */}
                <div className="flex items-center text-xs mt-1">
                    <span className="font-bold text-gray-800">{user?._count?.stories ?? 0}</span>
                    <span className="text-gray-600 ml-1">Publications</span>
                </div>

                {/* Bio */}
                <p className="text-center text-xs text-gray-600 mt-3 max-w-md">
                    {user?.bio ?? ""}
                </p>

                <div className="flex items-center gap-6 mt-5">
                    <Image 
                        src="/icon/x-solid.svg" 
                        alt="X solid icon"
                        width={16}
                        height={16}
                        className="rounded-xl cursor-pointer"
                    />
                    <Image 
                        src="/icon/instagram-solid.svg" 
                        alt="Instagram solid icon"
                        width={16}
                        height={16}
                        className="rounded-xl cursor-pointer"
                    />
                    <Image 
                        src="/icon/facebook-solid.svg" 
                        alt="Facebook solid icon"
                        width={16}
                        height={16}
                        className="rounded-xl cursor-pointer"
                    />
                    {/* <div className='flex items-center gap-2 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer transition-all border border-[#F5F5F5] hover:border-amber-400'>
                        <i className='bx bxs-star text-amber-400 text-md'></i>
                        <span className="text-gray-600 text-[10px]">4/5</span>
                    </div> */}

                    <RatingBtnComponent />
                </div>


            </div>
        </div>
    );
};

export default ProfileHeaderComponent;

// Example usage in a page component:
/*
import ProfileHeader from '@/components/ProfileHeader';

export default function UserProfilePage() {
  return (
    <div>
      <ProfileHeader 
        username="wususu"
        publicationsCount={25}
        bio="Aspiring writer and storyteller, leveraging AI to bring my creative visions to life. Passionate about crafting."
        avatarUrl="/images/avatar.png"
        bannerUrl="/images/banner.jpg"
      />
      {/* Rest of the profile page *//*}
</div>
);
}
*/