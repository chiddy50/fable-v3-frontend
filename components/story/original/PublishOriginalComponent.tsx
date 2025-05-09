"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { toast } from "sonner"

import StoryEditorHeader from './StoryEditorHeader'
import StoryImagesComponent from './StoryImagesComponent'
import EditChapterFeeComponent from './EditChapterFeeComponent'
import ReviewChapterFeesPopupComponent from './ReviewChapterFeesPopupComponent'
import { StoryInterface } from '@/interfaces/StoryInterface'
import { ChapterInterface } from '@/interfaces/ChapterInterface'
import axiosInterceptorInstance from '@/axiosInterceptorInstance'

interface PublishOriginalProps {
    prevStep: (value: number) => void
    isFree: boolean
    story: StoryInterface | null
    refetch: () => void
}

const PublishOriginalComponent: React.FC<PublishOriginalProps> = ({
    prevStep,
    isFree,
    story,
    refetch
}) => {
    // State management
    const [editFeeModalOpen, setEditFeeModalOpen] = useState(false)
    const [reviewFeesPopupOpen, setReviewFeesPopupOpen] = useState(false)
    const [chapterToAdjust, setChapterToAdjust] = useState<ChapterInterface | null>(null)

    // Helper functions
    const formatChapterList = (chapterNumbers: number[]): string => {
        if (chapterNumbers.length === 0) return ''
        if (chapterNumbers.length === 1) return `${chapterNumbers[0]}`
        if (chapterNumbers.length === 2) return `${chapterNumbers[0]} and ${chapterNumbers[1]}`

        return `${chapterNumbers.slice(0, -1).join(', ')} and ${chapterNumbers[chapterNumbers.length - 1]}`
    }

    // Event handlers
    const toggleFeeReviewPopup = () => {
        const newReviewState = !reviewFeesPopupOpen
        setReviewFeesPopupOpen(newReviewState)

        // Close edit fee modal when review popup is opening
        if (newReviewState) {
            setEditFeeModalOpen(false)
        }
    }

    const validateChapters = (): boolean => {
        // Validate chapter one exists
        const chapterOne = story?.chapters?.find(chapter => chapter?.index === 1)
        if (!chapterOne) {
            toast.error("You cannot publish without adding chapter one")
            return false
        }

        // Check for empty chapters
        const emptyChapters: number[] = []
        story?.chapters
            ?.sort((a, b) => a.index - b.index)
            .forEach(chapter => {
                if (!chapter?.content) {
                    emptyChapters.push(chapter?.index)
                }
            })

        if (emptyChapters.length > 0) {
            toast.error(`Chapter ${formatChapterList(emptyChapters)} has no content`)
            return false
        }

        return true
    }

    const publishAllChapters = async () => {
        if (!validateChapters()) return

        try {
            const updated = await axiosInterceptorInstance.put(`/v2/chapters/publish-all/${story?.id}`, { 
                publishedAt: new Date
            });
            toast.success("All chapters published");
            refetch()
        } catch (error) {
            console.error("Error publishing chapters:", error)
            toast.error("Failed to publish chapters")
        }
    }

    return (
        <div>
            <StoryEditorHeader
                prevStep={prevStep}
                isFree={isFree}
                prevLabel="Write It"
                story={story}
                hideDraftBtn={true}
            />

            <StoryImagesComponent story={story} refetch={refetch} />

            <div className='bg-white p-4 rounded-xl mt-7'>
                <h1 className='capitalize text-md mb-2 font-bold'>Finalize</h1>
                <p className='mb-7 text-xs text-gray-500'>Review your work & publish.</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            onClick={toggleFeeReviewPopup}
                            className="flex items-center relative gap-2 bg-gray-800 cursor-pointer py-2 px-3 rounded-xl"
                        >
                            <Image src="/icon/coins-white.svg" alt="coins icon" width={13} height={13} />
                            <span className="text-xs text-white">Review Fees</span>
                            <i className={`bx bx-chevron-down text-xl text-white ${reviewFeesPopupOpen ? 'transform rotate-180' : ''}`}></i>

                            {editFeeModalOpen && (
                                <EditChapterFeeComponent
                                    isOpen={editFeeModalOpen}
                                    story={story}
                                    chapter={chapterToAdjust}
                                    refetch={refetch}
                                    setIsOpen={setEditFeeModalOpen}
                                    setReviewFeesPopupOpen={setReviewFeesPopupOpen}
                                />
                            )}

                            {reviewFeesPopupOpen && (
                                <ReviewChapterFeesPopupComponent
                                    chapters={story?.chapters ?? []}
                                    setChapterToAdjust={setChapterToAdjust}
                                    setReviewFeesPopupOpen={setReviewFeesPopupOpen}
                                    setEditFeeModalOpen={setEditFeeModalOpen}
                                />
                            )}
                        </div>
                    </div>

                    <button
                        onClick={publishAllChapters}
                        className="flex items-center cursor-pointer gap-2 py-3 px-3 text-white rounded-xl bg-gradient-to-r from-[#33164C] to-[#AA4A41] hover:bg-gradient-to-l transition-all"
                    >
                        <span className="text-xs">Publish All</span>
                        <CheckCircle size={15} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PublishOriginalComponent