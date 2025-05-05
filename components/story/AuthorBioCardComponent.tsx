"use client"

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';

interface AuthorBioCardProps {
    setShowBio: React.Dispatch<React.SetStateAction<boolean>>;
    bioCardRef: React.RefObject<HTMLDivElement>;
}

const AuthorBioCardComponent: React.FC<AuthorBioCardProps> = ({ 
    setShowBio,
    bioCardRef
}) => {

    const [showRating, setShowRating] = useState(false);
    const ratingBoxRef = useRef(null);
    const triggerBoxRef = useRef(null);
    
    useEffect(() => {
        // Function to handle clicks outside the rating box
        const handleClickOutside = (event) => {
            // If the rating box is shown and the click is outside both the rating box and trigger box
            if (
                showRating &&
                ratingBoxRef?.current &&
                !ratingBoxRef?.current?.contains(event.target) &&
                !triggerBoxRef?.current?.contains(event.target)
            ) {
                setShowRating(false);
            }
        };

        // Add event listener when the component mounts or showRating changes
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRating]);

    // Handle mouse leave with a slight delay
    const handleMouseLeave = () => {
        setTimeout(() => {
            setShowBio(false);
        }, 300);
    };
    
    return (
        <div 
            ref={bioCardRef || undefined}
            className="absolute z-20 top-6 left-6 p-4 w-60 shadow-md bg-white rounded-2xl transition-all duration-200 ease-in-out"
            onMouseEnter={() => setShowBio(true)}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex items-center justify-between">
                <Image 
                    src="/avatar/male_avatar1.svg" 
                    alt="Cole Palmer"
                    width={45}
                    height={45}
                    className="rounded-xl"
                />
                <i className='bx bx-link-alt text-2xl'></i>
            </div>

            <div className="flex items-center mt-3 justify-between">
                <Link href="/creator">
                    <p className='text-sm font-bold cursor-pointer hover:underline'>Cole Palmer</p>
                </Link>
                <p className='text-xs'>@Jmoos</p>
            </div>
            
            <div className="mt-3 flex items-center gap-1 text-xs">
                <span className='font-bold'>20</span>
                <span className='text-gray-400'>Publications</span>
            </div>
            
            <p className="py-3 text-xs font-light leading-5">
                Aspiring writer and storyteller, leveraging AI to bring my creative visions to life. Passionate about crafting...
            </p>

            <div className='border-t relative flex items-center justify-between pt-4 border-gray-100'>
                <div className="flex items-center gap-3">
                    <Image 
                        src="/icon/x-solid.svg" 
                        alt="X solid icon"
                        width={20}
                        height={20}
                        className="rounded-xl"
                    />
                    <Image 
                        src="/icon/instagram-solid.svg" 
                        alt="Instagram solid icon"
                        width={20}
                        height={20}
                        className="rounded-xl"
                    />
                    <Image 
                        src="/icon/facebook-solid.svg" 
                        alt="Facebook solid icon"
                        width={20}
                        height={20}
                        className="rounded-xl"
                    />
                </div>

                <div 
                ref={triggerBoxRef}
                onClick={() => setShowRating(true)} className='flex items-center gap-2 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer transition-all border border-[#F5F5F5] hover:border-amber-400'>
                    {/* <svg width="14" height="14" viewBox="0 0 24 24" fill="gold" stroke="gold">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>               */}
                    <i className='bx bxs-star text-amber-400 text-md'></i>
                    <span className="text-gray-600 text-[10px]">4/5</span>
                </div>

                {showRating && 
                <div 
                ref={ratingBoxRef}
                className="absolute -top-3 -right-3 shadow-2xl rounded-2xl p-3 bg-white flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <i className='bx bx-star text-amber-400 text-md'></i>
                        <i className='bx bx-star text-amber-400 text-md'></i>
                        <i className='bx bx-star text-amber-400 text-md'></i>
                        <i className='bx bx-star text-amber-400 text-md'></i>
                        <i className='bx bx-star text-amber-400 text-md'></i>
                    </div>
                    <p className='text-gray-600 text-xs'>0/5</p>
                </div>
                }
            </div>
        </div>
    )
}

export default AuthorBioCardComponent