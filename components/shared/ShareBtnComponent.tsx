"use client"

import { Share2 } from 'lucide-react'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'

const ShareBtnComponent = () => {
    const [showShare, setShowShare] = useState(false);
    const shareBoxRef = useRef(null);
    const triggerBoxRef = useRef(null);

    useEffect(() => {
        // Function to handle clicks outside the rating box
        const handleClickOutside = (event) => {
            // If the rating box is shown and the click is outside both the rating box and trigger box
            if (
                showShare &&
                shareBoxRef?.current &&
                !shareBoxRef?.current?.contains(event.target) &&
                !triggerBoxRef?.current?.contains(event.target)
            ) {
                setShowShare(false);
            }
        };

        // Add event listener when the component mounts or showShare changes
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShare]);

    return (
        <div 
        ref={triggerBoxRef}   
        onClick={() => setShowShare(true)}      
        className='bg-[#F5F5F5] relative rounded-xl p-2 cursor-pointer border transition-all border-[#F5F5F5] text-gray-500 hover:text-red-700 hover:border-red-100 '>
            <Share2 size={14} />

            {showShare && 
                <div 
                ref={shareBoxRef}
                className="absolute w-[200px] shadow-2xl rounded-3xl bg-white z-10"
                style={{
                    top: "-19rem",
                    left: "-12rem"
                }}>
                    <div className='p-3'>
                        <div>
                            <h1 className='text-xs text-gray-600 mb-2'>Share Link</h1>
                            <div className="grid grid-cols-4 gap-3">

                                <div className=" hover:bg-gray-200 transition-all rounded-xl">                        
                                    <Image src="/icon/link.svg" alt="link icon" className="cursor-pointer" width={40} height={40} />                            
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <h1 className='text-xs text-gray-600 mb-2'>Socials</h1>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="flex items-center justify-center hover:bg-gray-200 transition-all rounded-xl">
                                    <Image src="/icon/x.svg" alt="x icon" className="cursor-pointer" width={26} height={26} />                            
                                </div>
                                <div className="flex items-center justify-center hover:bg-gray-200 transition-all rounded-xl">
                                    <Image src="/icon/instagram-solid.svg" alt="instagram icon" className="cursor-pointer" width={20} height={20} />                            
                                </div>
                                <div className="flex items-center justify-center hover:bg-gray-200 transition-all rounded-xl">
                                    <Image src="/icon/whatsapp.svg" alt="whatsapp icon" className="cursor-pointer" width={43} height={43} />                            
                                </div>
                                <div className="flex items-center justify-center hover:bg-gray-200 transition-all rounded-xl">
                                    <Image src="/icon/facebook-solid.svg" alt="facebook icon" className="cursor-pointer" width={18} height={18} />                            
                                </div>

                            </div>
                        </div>

                        <div className="mt-3">
                            <h1 className='text-xs text-gray-600 mb-2'>Export As:</h1>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="flex items-center justify-center hover:bg-gray-200 transition-all rounded-xl">
                                    <Image src="/icon/pdf.svg" alt="pdf icon" className="cursor-pointer" width={35} height={35} />                            
                                </div>
                                <div className="flex items-center justify-center hover:bg-gray-200 transition-all rounded-xl">
                                    <Image src="/icon/ebook.svg" alt="ebook icon" className="cursor-pointer" width={35} height={35} />                            
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h1 className='text-xs text-gray-600 mb-2'>Websites:</h1>
                            <button className="bg-[#F5F5F5] py-2 px-3 rounded-xl flex items-center gap-2 cursor-pointer text-gray-500 hover:text-red-700">                               
                                <Image src="/icon/embed-link.svg" alt="ebook icon" className="cursor-pointer" width={17} height={17} />                            
                                <span className="text-xs ">Embed link</span>
                            </button>
                        </div>
                    </div>
                    
                </div>
            }

        </div>
    )
}

export default ShareBtnComponent
