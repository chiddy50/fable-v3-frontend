"use client"

import React, { useEffect, useRef, useState } from 'react'

const RatingBtnComponent = () => {
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

    return (
        <>
            <div 
            ref={triggerBoxRef}
            onClick={() => setShowRating(true)}  className='flex relative items-center gap-2 bg-[#F5F5F5] rounded-xl p-2 cursor-pointer border border-[#F5F5F5] transition-all hover:border-amber-400'>				
                <i className='bx bxs-star text-amber-400 text-md'></i>
                <span className="text-gray-600 text-[10px]">4/5</span>
                
                
                {showRating && 
                    <div 
                    ref={ratingBoxRef}
                    className="absolute top-10 right-0 w-[200px] shadow-2xl rounded-2xl bg-white z-10">
                        <div className='p-4'>
                            <h1 className='text-md font-bold mb-2'>Rate it.</h1>

                            <p className='text-xs font-light leading-5 text-gray-700'>Show this creator how much you appreciate their work, by clicking the stars below </p>
                        </div>
                        <div className='flex items-center gap-3 px-5 py-3 border-t border-gray-100'>
                            <div className="flex items-center gap-1">
                                <i className='bx bx-star text-amber-400 text-md opacity-50'></i>
                                <i className='bx bx-star text-amber-400 text-md opacity-50'></i>
                                <i className='bx bx-star text-amber-400 text-md opacity-50'></i>
                                <i className='bx bx-star text-amber-400 text-md opacity-50'></i>
                                <i className='bx bx-star text-amber-400 text-md opacity-50'></i>
                            </div>
                            <p className='text-gray-600 text-sm'>0/5</p>
                        </div>
                    </div>
                }
            </div>

        </>
    )
}

export default RatingBtnComponent
