"use client"

import React, { useState } from 'react'
import Image from 'next/image';
import { Eye, Save } from 'lucide-react';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { Button } from '@/components/ui/button';
import PreviewStoryComponent from './PreviewStoryComponent';
import { ChapterInterface } from '@/interfaces/ChapterInterface';
import PreviewChapterComponent from './PreviewChapterComponent';

interface Props {
    prevStep: (value: number) => void;
    prevLabel: string;
    story: StoryInterface | null;
    hideAddChapterBtn: boolean;
    confirmAddNewChapter?: () => void;
    saveChaptersProgress: () => any;
    hideDraftBtn?: boolean;
}

const StoryEditorHeader: React.FC<Props> = ({
    prevStep,
    prevLabel,
    story,
    hideAddChapterBtn = true,
    confirmAddNewChapter,
    saveChaptersProgress,
    hideDraftBtn = false
}) => {
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [chapterInPreview, setChapterInPreview] = useState<ChapterInterface|null>(null);
    const [showPreviewChapter, setShowPreviewChapter] = useState<boolean>(false);

    const moveBack = () => {
        console.log(prevLabel);
        
        if (prevLabel === "Get Started") {
            prevStep(1)
        }
        if (prevLabel === "Write It") {
            prevStep(2)
        }
    }
    return (
        <div className="bg-white p-4 rounded-xl mb-10">
            <div className="flex items-center justify-between mb-2">
                <div onClick={moveBack} className="flex items-center gap-1 cursor-pointer bg-[#33164C] py-2 px-2 rounded-xl">
                    <i className='bx bx-chevron-left text-xl text-gray-50'></i>
                    <span className="text-sm font-semibold text-white">{prevLabel}</span>
                </div>

                <div className="flex items-center gap-5">
 

                    <div onClick={() => setShowPreview(true) } className="flex items-center gap-2 cursor-pointer bg-[#F9F9F9] hover:bg-gray-100 py-2 px-3 rounded-lg">
                        <Eye size={16} />
                        <span className="text-xs">Preview</span>
                    </div>

                    {!hideDraftBtn &&
                        <div 
                        onClick={saveChaptersProgress}                    
                        className="flex items-center gap-2 cursor-pointer bg-[#F9F9F9] hover:bg-gray-100 py-2 px-3 rounded-lg">
                            <Save size={15} />
                            <span className="text-xs">Save Draft</span>
                        </div>
                    }

                    {hideAddChapterBtn === false &&
                        <div onClick={confirmAddNewChapter} className="flex items-center gap-2 cursor-pointer bg-black text-white py-2 px-3 rounded-lg">
                            <Image src="/icon/book-edit.svg" alt="book-edit icon" width={13} height={13} />
                            <span className="text-xs">Add Chapter</span>
                        </div>
                    }
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
                <h1 className="text-3xl capitalize font-bold">{story?.projectTitle}</h1>
                {!story?.isFree &&
                    <div className="flex items-center gap-2">
                        <Image src="/icon/coins-red.svg" alt="coins icon" width={13} height={13} />
                        <span className="text-sm text-[#AA4A41] font-bold">{story?.price ?? 0}</span>
                    </div>
                }
                {story?.isFree &&
                    <div className="flex items-center gap-2">
                        <Image src="/icon/coins-green.svg" alt="coins icon" width={13} height={13} />
                        <span className="text-sm text-[#249000] font-bold">Free</span>
                    </div>
                }
            </div>


            
            <PreviewStoryComponent 
                showPreview={showPreview} 
                setShowPreview={setShowPreview} 
                story={story} 
                setChapterInPreview={setChapterInPreview}
                setShowPreviewChapter={setShowPreviewChapter} 

            />

            <PreviewChapterComponent 
                showPreviewChapter={showPreviewChapter} 
                setShowPreviewChapter={setShowPreviewChapter} 
                setShowPreview={setShowPreview} 

                chapterInPreview={chapterInPreview} 
                setChapterInPreview={setChapterInPreview}
                story={story} 
            />
        </div>
    )
}

export default StoryEditorHeader;

