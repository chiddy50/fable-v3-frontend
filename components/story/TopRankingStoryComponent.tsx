'use client'; 
import Image from 'next/image';
import { Heart, MessageCircle, Share2, BookmarkPlus } from 'lucide-react';
import { UserAvatarComponent } from '../shared/UserAvatarComponent';
import AuthorComponent from './AuthorComponent';
import Link from 'next/link';

const TopRankingStoryComponent = ({ image }: { image: string }) => {
  
    return (
        <div className="max-w-4xl mx-auto my-8 font-sans">
            <div className=" mb-4">
				<AuthorComponent count={1} />
   
            </div>

            <div className="relative w-full h-[130px] rounded-2xl overflow-hidden">
                <div className='absolute bottom-2 right-2 z-10 flex items-center gap-2 bg-[#F5F5F5] rounded-xl py-1 px-2 cursor-pointer'>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="gold" stroke="gold">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>              
                    <span className="text-gray-600 text-[10px]">4/5</span>
                </div>
      
                <Image 
                src={`${image}`} 
                alt="The deathly hallows of North Seria"
                fill
                className="object-cover w-full"
                />
            </div>
            <Link href="/read-story">
                <h1 className="text-lg font-bold text-gray-800 my-3 hover:underline">The deathly hallows of North Seria</h1>
            </Link>
            <div className="flex item-center justify-between">
                <p className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px]">25 Pieces</p>

                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px]">Adventure</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px]">Erotic</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px]">Fantasy</span>
                </div>
            </div>
        </div>
    );
};

export default TopRankingStoryComponent;