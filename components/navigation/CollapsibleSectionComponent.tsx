"use client"

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CollapsibleSectionComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState('auto');

    useEffect(() => {
        if (contentRef.current) {
            // Store the full height of the content
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, []);

    const toggleContent = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`p-2 border border-[#D8D1DE52] rounded-2xl mt-7 transition-all
            ${ isOpen ? 'bg-[#f5f4f6]' : 'bg-[#33164C]' }`
        }         
        >
            <div className="flex items-center justify-between">
                <Image src="/icon/generate.svg" alt="generate icon" width={22} height={22} />
                <p className={`text-sm  font-semibold transition-all ${ isOpen ? 'text-[#33164C]' : 'text-white' }`}>Creator's Studio</p>
                <button
                    className='trigger h-6 w-6 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 hover:text-white transition-colors duration-300'
                    onClick={toggleContent}
                >
                    <i className={`bx ${isOpen ? 'bx-chevron-up' : 'bx-chevron-down'} text-2xl text-gray-500 transition-transform duration-300`}></i>
                </button>
            </div>

            <div
                ref={contentRef}
                className={`target overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    maxHeight: isOpen ? `${contentHeight}px` : '0px',
                    marginTop: isOpen ? '1.75rem' : '0'
                }}
            >
                <div className="bg-white p-2 rounded-2xl">
                    <Link href="/dashboard/write-original-story"  className='flex gap-2 p-1 bg-[#f5f5f5] rounded-xl mb-3 cursor-pointer border transition-all border-[#f5f5f5] hover:border-gray-200'>
                        <div className='bg-[#101010] flex items-center justify-center p-2 rounded-lg'>
                            <Image src="/icon/pen.svg" alt="generate icon" width={17} height={17} />
                        </div>
                        <div>
                            <p className="text-xs">Original</p>
                            <p className="text-[9px] font-light text-gray-600">Write original stories.</p>
                        </div>
                    </Link>

                    <Link href="/dashboard/write-ai-story" className='flex gap-2 p-1 bg-[#f5f5f5] rounded-xl cursor-pointer border transition-all border-[#f5f5f5] hover:border-gray-200'>
                        <div className='flex items-center justify-center p-2 rounded-lg bg-gradient-to-br from-[#AA4A41] to-[#33164C]'>
                            <Image src="/icon/magic-pen.svg" alt="generate icon" width={17} height={17} />
                        </div>
                        <div>
                            <p className="text-xs">With AI</p>
                            <p className="text-[9px] font-light text-gray-600">Leverage our AI tool.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default CollapsibleSectionComponent
