"use client"

import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import { UserAvatarComponent } from '@/components/shared/UserAvatarComponent';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/context/MainContext';
import { ChapterInterface } from '@/interfaces/ChapterInterface';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { hidePageLoader, showPageLoader } from '@/lib/helper';
import { CheckCircle, ChevronDown, Save } from 'lucide-react';
import React, { useContext, useRef, useState } from 'react'

interface Props {
    showPreviewChapter: boolean;
    setShowPreviewChapter: React.Dispatch<React.SetStateAction<boolean>>;  
    setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
    chapterInPreview: ChapterInterface|null; 
    story: StoryInterface|null; 
    setChapterInPreview: React.Dispatch<React.SetStateAction<ChapterInterface|null>>; 
}
const PreviewChapterComponent: React.FC<Props> = ({
    showPreviewChapter,
    setShowPreviewChapter,
    setShowPreview,
    chapterInPreview, 
    setChapterInPreview,
    story
}) => {
    const [isChapterListOpen, setIsChapterListOpen] = useState<boolean>(false);
    const chapterListRef = useRef<HTMLDivElement>(null);

    const handleBackdropClick = () => {
        setShowPreviewChapter(false);
    };
    const { user } = useContext(AppContext)

    const returnToReviewStory = () => {
        setShowPreviewChapter(false)
        setShowPreview(true)
    }

    const publishChapter = async () => {
        try {
            showPageLoader();

            let status = chapterInPreview?.readersHasAccess === true ? "draft" : "published"

            const response = await axiosInterceptorInstance.put(`/v2/chapters/publish/${chapterInPreview?.id}`, { 
                status: status,
                publishedAt: status === "published" ? new Date : null,
                readersHasAccess: status === "published" ? "true" : "false"
            });
            // toast(`Chapter ${activeChapterData?.index} has been ${status === "draft" ? "unpublished" :  "published"}!`); 
            
            // refetch();
            // setActiveChapter(story?.currentChapterId)
        } catch (error) {
            console.log(error);       
        }finally{
            hidePageLoader()
        }
    }


    const toggleChapterList = () => {
        setIsChapterListOpen(!isChapterListOpen);
    };

    const selectChapter = async (chapter: ChapterInterface) => {

        // await updateCurrentChapter(id);
        // setActiveChapter(id);
        setIsChapterListOpen(false);
        setChapterInPreview(chapter)

    };

    return (
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-start justify-center ${showPreviewChapter ? '' : 'hidden'}`}
            onClick={handleBackdropClick}
        >
            {/* Modal Container - This is the key scrollable element */}
            <div 
                className="w-full max-w-4xl max-h-screen overflow-y-auto my-4 pb-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative w-full bg-white shadow-lg rounded-3xl overflow-hidden">
                    <div className="relative flex items-center justify-center h-60 rounded-3xl"
                     style={{
                        backgroundImage: `url('${chapterInPreview?.image ?? "/img/placeholder6.jpg"}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                    >
                        {/* Close Button */}
                        <button 
                            onClick={returnToReviewStory} 
                            className="absolute top-4 left-4 rounded-full bg-gray-800 hover:bg-gray-600 bg-opacity-40 p-2 cursor-pointer text-white hover:bg-opacity-60 transition-all z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>

                        <div className='flex flex-col items-center gap-2 text-white'>

                            <div className="flex flex-col gap-1 items-center">
                                <UserAvatarComponent
                                    width={40}
                                    height={40}
                                    borderRadius='rounded-lg'
                                    imageUrl={user?.imageUrl ?? "/avatar/male_avatar1.svg"}
                                    border="border border-white"
                                />
                                <p className="text-sm text-center font-semibold">@{user?.name}</p>
                            </div>
                            <p className="font-light text-xs">20min ago</p>
                            <h1 className="text-4xl font-bold ">{story?.projectTitle}</h1>
                            <div className="flex items-center justify-center gap-2">
                                {
                                    story?.genres.map(genre => (
                                        <span key={genre} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-[10px]">{genre}</span>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="absolute top-4 right-4">
                            <span className="inline-block bg-white capitalize text-red-600 font-medium text-xs px-2 py-1.5 rounded-lg">
                                {story?.type}
                            </span>
                        </div>
                    </div>

                    <div className="p-5">

                        <div className="relative">

                            {/* CHAPTER LIST */}
                            <div
                                className="flex items-center cursor-pointer mb-3"
                                onClick={toggleChapterList}
                            >
                                <h1 className="text-md font-bold text-gray-600">Chapter {chapterInPreview?.index}</h1>
                                <ChevronDown className={`ml-2 h-5 w-5 text-gray-600 transition-transform ${isChapterListOpen ? 'transform rotate-180' : ''}`} />
                            </div>

                            {/* Chapter List Dropdown */}
                            {isChapterListOpen && (
                            <div
                                ref={chapterListRef}
                                className="absolute left-0 top-10 bg-white shadow-lg rounded-lg z-10 overflow-hidden"
                            >
                                <div className="p-2">
                                    {story?.chapters?.map(chapter => (
                                        <div
                                            key={chapter.id}
                                            className={`flex items-center p-3 rounded-md cursor-pointer ${chapter?.id === chapterInPreview?.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                            onClick={() => selectChapter(chapter)}
                                        >
                                            <div className={`w-4 h-4 rounded-full border ${chapter?.id === chapterInPreview?.id ? 'border-[#D45C51] bg-[#D45C51]' : 'border-gray-300'} mr-3 flex items-center justify-center`}>
                                                {chapter?.id === chapterInPreview?.id && (
                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                )}
                                            </div>
                                            <span className="text-gray-800 text-xs">Chapter {chapter?.index}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            )}
                            {/* CHAPTER LIST END */}
                        </div>



                        <h1 className='my-7 font-bold text-3xl'>{story?.projectTitle}</h1>
                        <div className="my-3 text-sm leading-6 text-[#626262]">
                            
                            <textarea name="" id="" value={chapterInPreview?.content} disabled className='w-full resize-none outline-none text-gray-700 placeholder:italic placeholder-gray-400 min-h-[500px]'/>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            {
                                story?.genres.map(genre => (
                                    <span key={genre} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-[10px]">{genre}</span>
                                ))
                            }
                        </div>

                        <div className="mt-5 flex items-center gap-5">
                            {
                                chapterInPreview?.readersHasAccess === false && 
                                <Button 
                                onClick={publishChapter}
                                className='flex items-center cursor-pointer gap-2 text-white rounded-xl bg-gradient-to-r from-[#33164C] to-[#AA4A41] hover:bg-gradient-to-l transition-all'>
                                    <span className="text-xs ">Publish Now</span>
                                    <CheckCircle size={15} />
                                </Button>
                            }

                            {
                                chapterInPreview?.readersHasAccess === true && 
                                <div 
                                onClick={publishChapter}
                                className="flex items-center gap-2 cursor-pointer bg-[#F9F9F9] hover:bg-gray-100 py-2 px-3 rounded-lg">
                                    <span className="text-xs">Save Draft</span>
                                    <Save size={15} />
                                </div>
                            }
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
    )
}

export default PreviewChapterComponent
