"use client"

import { ChapterInterface } from '@/interfaces/ChapterInterface';
import Image from 'next/image';
import React, { useRef } from 'react'


interface Props {
    chapters: ChapterInterface[] | [];
    setChapterToAdjust: React.Dispatch<React.SetStateAction<ChapterInterface|null>>;
    setEditFeeModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setReviewFeesPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReviewChapterFeesPopupComponent: React.FC<Props> = ({
    chapters,
    setChapterToAdjust,
    setReviewFeesPopupOpen,
    setEditFeeModalOpen,
}) => {
    const setFeeRef = useRef<HTMLDivElement>(null);

    const showAdjustFeeModal = (chapter: ChapterInterface) => {
        console.log(chapter);
        setChapterToAdjust(chapter);
        setEditFeeModalOpen(true);
        setReviewFeesPopupOpen(false)
    }

    return (
        <div
            ref={setFeeRef}
            className="absolute left-0 -top-48 bg-white shadow-sm rounded-lg w-64 z-20"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Chapter list */}
            <div className="">
                {chapters?.sort((a, b) => a.index - b.index)?.map((chapter, index) => (
                    <div key={index} onClick={() => showAdjustFeeModal(chapter)} className="p-3 cursor-pointer transition-all hover:bg-gray-50 hover:rounded-lg flex justify-between items-center">
                        <div className="flex items-center text-xs">
                            {chapter?.readersHasAccess === true ? (
                                <div className="w-4 h-4 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            ) : (
                                <Image src="/icon/lock.svg" alt="lock icon" className='mr-3' width={13} height={13} />
                            )}
                            <span className="text-gray-600">
                                Chapter {chapter.index}
                            </span>
                        </div>

                        {chapter?.isFree === true &&
                            <div className='px-2 py-1 rounded-md bg-[#D7F7CC] text-[#249000] text-xs flex items-center gap-2'>
                                <Image src="/icon/coins-green.svg" alt="coins icon" width={13} height={13} />
                                <span className="text-[10px] font-bold">Free</span>
                            </div>
                        }
                        {chapter?.isFree === false &&
                            <div className='flex items-center cursor-pointer gap-2 py-1 px-2 text-black rounded-md bg-[#F5F5F5] transition-all'>
                                <Image src="/icon/coins.svg" alt="coins icon" width={15} height={15} />
                                <span className="text-[10px] font-bold">{chapter?.price ?? 0}</span>
                            </div>
                        }
                    </div>
                ))}
            </div>

        </div>
    )
}

export default ReviewChapterFeesPopupComponent
