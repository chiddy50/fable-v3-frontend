"use client"

import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { UserAvatarComponent } from '@/components/shared/UserAvatarComponent';
import ShareBtnComponent from '@/components/shared/ShareBtnComponent';
import GenrePillsComponent from '@/components/shared/GenrePillsComponent';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { AppContext } from '@/context/MainContext';
import { formatDate } from '@/lib/helper';
import { ChapterInterface } from '@/interfaces/ChapterInterface';

interface Props {
    showPreview: boolean;
    setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPreviewChapter: React.Dispatch<React.SetStateAction<boolean>>;     
    setChapterInPreview: React.Dispatch<React.SetStateAction< ChapterInterface | null>>;
    story: StoryInterface | null;       
}

const PreviewStoryComponent: React.FC<Props> = ({
    showPreview,
    setShowPreview,
    setShowPreviewChapter,
    story,
    setChapterInPreview
}) => {
    const [loaded, setLoaded] = useState(false);

    const { user } = useContext(AppContext)
    
    useEffect(() => {
        setLoaded(true);
        
        // Prevent body scrolling when modal is open
        if (showPreview) {
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            // Re-enable body scrolling when component unmounts
            document.body.style.overflow = 'auto';
        };
    }, [showPreview]);

    // Close modal when clicking outside
    const handleBackdropClick = () => {
        setShowPreview(false);
    };

    const previewChapter = (chapter: ChapterInterface) => {
        console.log(chapter);
        
        setChapterInPreview(chapter);
        setShowPreview(false);
        setShowPreviewChapter(true)
    }

    

    return (
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-start justify-center ${showPreview ? '' : 'hidden'}`}
            onClick={handleBackdropClick}
        >
            {/* Modal Container - This is the key scrollable element */}
            <div 
                className="w-full max-w-4xl max-h-screen overflow-y-auto my-4 pb-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full bg-white shadow-lg rounded-3xl overflow-hidden">
                    {/* Hero Image Section with White Fade */}
                    <div className="relative h-80">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `url('${story?.bannerImageUrl ?? "/img/placeholder6.jpg"}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />

                        {/* White Fade Overlay - Bottom */}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

                        {/* White Fade Overlay - Left & Right */}
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent opacity-40" />
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent opacity-40" />

                        {/* Close Button */}
                        <button 
                            onClick={() => setShowPreview(false)} 
                            className="absolute top-4 left-4 rounded-full bg-gray-800 hover:bg-gray-600 bg-opacity-40 p-2 cursor-pointer text-white hover:bg-opacity-60 transition-all z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        {/* Original Tag */}
                        <div className="absolute top-4 right-4">
                            <span className="inline-block bg-white capitalize text-red-600 font-medium text-xs px-2 py-1.5 rounded-lg">
                            {story?.type}
                            </span>
                        </div>
                    </div>

                    {/* Story Info Section */}
                    <div className="px-6 pb-6">
                        {/* Logo and Title */}
                        <div className="">
                            <div className="mr-4 flex-shrink-0">
                                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md">
                                    <img
                                        src={`${story?.coverImageUrl ?? story?.bannerImageUrl ?? "/img/placeholder5.jpg"}`}
                                        alt="Story cover image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <h1 className="text-5xl capitalize font-bold text-gray-800 mt-3">{story?.projectTitle}</h1>
                        </div>

                        {/* Author Info */}
                        <div className="flex items-center justify-between mt-6 ">
                            <div className="flex items-center">
                                <div className="overflow-hidden mr-2">             
                                    <UserAvatarComponent
                                        width={40}
                                        height={40}
                                        borderRadius='rounded-lg'
                                        imageUrl={user?.imageUrl ?? "/avatar/default-avatar.png"}
                                        border="border border-white"
                                    />
                                </div>
                                <span className="text-gray-600 text-sm font-medium">@{user?.name}</span>
                            </div>

                            {story?.publishedAt && <div className="flex items-center text-gray-600">
                                <span className="mx-2 text-xs"><span className='font-bold'>5min read</span> • {story?.publishedAt ? formatDate(story?.publishedAt) : ""}</span>
                            </div>}
                            {!story?.publishedAt && 
                            <span className="inline-block bg-[#3A3A3A] capitalize text-gray-50 font-medium text-xs px-4 py-2 rounded-lg">
                                {story?.status}
                            </span>}
                        </div>

                        {/* Engagement Stats */}
                        <div className="flex items-center justify-between mt-3">
                            {/* <GenrePillsComponent /> */}

                            <div className="flex items-center gap-2">
                                {
                                    story?.genres.map(genre => (
                                        <span key={genre} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px]">{genre}</span>
                                    ))
                                }
                            </div>
                            <ShareBtnComponent />
                        </div>

                        {/* Content Section */}
                        <div className="mt-6 opacity-0 animate-fadeIn" style={{
                            animation: loaded ? 'fadeIn 0.5s ease-in-out forwards 0.3s' : 'none'
                        }}>
                            {/* Overview */}
                            <div className="text-sm text-gray-600">
                                <h2 className="text-lg font-bold">Overview</h2>
                                <p className="py-2 text-xs font-light">{story?.projectDescription}</p>
                            </div>

                            {/* Chapters */}
                            <div className="text-sm text-gray-600 my-3 border-b border-t border-[#CACACA3D] py-3">
                                <h2 className="text-lg font-bold">Chapters</h2>
                                <p className="py-2 text-xs font-light">Click any chapter to start reading.</p>
                            </div>
                            <div className="text-sm text-gray-600 mt-6 mb-4 py-4">
                                
                                {/* Sample chapter list to demonstrate scrolling */}
                                <div className="space-y-3 mt-4">
                                    {story?.chapters?.map((chapter, index) => (
                                        <div onClick={() => previewChapter(chapter)} key={index} className="p-3 border border-gray-100 cursor-pointer bg-[#FBFBFB] transition-all hover:bg-[#f2f2f2] rounded-lg flex justify-between items-center">
                                            <div className="flex items-center">
                                                {chapter?.readersHasAccess === true ? (
                                                    <div className="w-4 h-4 rounded-full bg-red-500 mr-3 flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                ) : (
                                                    <Image src="/icon/lock.svg" alt="lock icon" className='mr-3' width={13} height={13} />
                                                )}
                                                <span className="text-gray-600">
                                                    Chapter {chapter.index}
                                                </span>
                                            </div>
                                            
                             
                                            
                                            {
                                                chapter?.isFree === true &&
                                                <div className='px-2 py-1 rounded-md bg-[#D7F7CC] text-[#249000] text-xs flex items-center gap-2'>
                                                    <Image src="/icon/coins-green.svg" alt="coins icon" width={13} height={13} />
                                                    <span className="text-xs font-bold">Free</span>
                                                </div>
                                            }
                                            {
                                                chapter?.isFree === false &&
                                                <div className='flex items-center cursor-pointer gap-2 py-1 px-2 text-white rounded-md bg-gradient-to-r from-[#AA4A41] to-[#33164C] hover:bg-gradient-to-l transition-all'>
                                                    <Image src="/icon/coins-white.svg" alt="coins icon" width={15} height={15} />
                                                    <span className="text-xs font-bold">{chapter?.price}</span>
                                                </div>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global styles for animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PreviewStoryComponent;