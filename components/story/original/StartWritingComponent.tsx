import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { StoryInterface } from '@/interfaces/StoryInterface';
import { ChapterInterface } from '@/interfaces/ChapterInterface';
import StoryEditorHeader from './StoryEditorHeader';
import axiosInterceptorInstance from '@/axiosInterceptorInstance';
import StartWritingFooterComponent from './StartWritingFooterComponent';
import ModalBoxComponent from '@/components/shared/ModalBoxComponent';
import { toast } from 'sonner';
import ChapterImagesComponent from './ChapterImagesComponent';

interface Props {    
    story: StoryInterface | null;    
    prevStep: (value: number) => void;
    nextStep: (value: number) => void;
    refetch: () => void;
    chapterId?: string | null;
}

const StartWritingComponent: React.FC<Props> = ({
    prevStep,
    nextStep,
    story,
    refetch,
    chapterId
}) => {

    const [chapters, setChapters] = useState<ChapterInterface[]>([]);
    const [activeChapter, setActiveChapter] = useState<string>(chapterId ?? '');
    const [isChapterListOpen, setIsChapterListOpen] = useState<boolean>(false);
    const [showConfirmNewChapterModal, setShowConfirmNewChapterModal] = useState<boolean>(false);

    const chapterListRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (story && story?.chapters?.length > 0) {            
            let result = story?.chapters?.length > 0 ? story.chapters.sort((a, b) => a.index - b.index) : []
            setChapters(result);

            let lastChapterIndex = story?.chapters?.length - 1;
            setActiveChapter(story.currentChapterId ?? result?.[lastChapterIndex]?.id)
        }
    }, [story]);

    useEffect(() => {
        // Focus the textarea when component mounts
        if (textareaRef.current) {
            textareaRef.current.focus();
        }

        // Close chapter list when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (chapterListRef.current && !chapterListRef.current.contains(event.target as Node)) {
                setIsChapterListOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleChapterList = () => {
        setIsChapterListOpen(!isChapterListOpen);
    };

    const selectChapter = async (id: string) => {
        // currentChapterId
        await updateCurrentChapter(id);
        setActiveChapter(id);
        setIsChapterListOpen(false);
    };

    const updateCurrentChapter = async (id: string) => {
        try {            
            const response = await axiosInterceptorInstance.put(`/v2/stories/${story?.id}`, { 
                currentChapterId: id
            });
            
            refetch();

        } catch (error) {
            console.log(error);        
        }finally{
            // setSavingFee(false);
        }
    }

    const handleContentChange = (content: string) => {
        
        setChapters(prevChapters => {
            return prevChapters.map(chapter => {
                
                if (chapter.id === activeChapter) {
                    return {
                        ...chapter,
                        content: content
                    };
                }

                return chapter;
            });
        });
    };

    // const activeChapterData = chapters.find(chapter => chapter.id === activeChapter) || chapters[chapters.length - 1];
    const activeChapterData = useMemo(() => {        
        return chapters.find(chapter => chapter.id === activeChapter) || chapters[chapters.length - 1];
    }, [activeChapter, chapters]);

    const handleAddChapterClick = async () => {
        let chapterSaved = await saveChaptersProgress();
    
        if (!chapterSaved) {
            toast("Could not save progress");                
            return;   
        }

        try {            
            const updated = await axiosInterceptorInstance.post(`/v2/chapters`, { 
                index: chapters.length + 1,
                storyId: story?.id
            });
            toast("Chapter saved!");                

            refetch();
        } catch (error) {
            console.log(error);            
        }finally{
            setShowConfirmNewChapterModal(false)
        }
    }

    const saveChaptersProgress = async () => {        
        try {            
            const updated = await axiosInterceptorInstance.put(`/v2/chapters/update-many/${story?.id}`, { 
                chapters
            });
            console.log(updated);
            toast("Progress saved!");                
            return updated.data.chapters;
        } catch (error) {
            console.log(error);  
            return false;          
        }
    }

    const confirmAddNewChapter = () => {
        // SAVE WORK BEFORE ADDING CHAPTER
        setShowConfirmNewChapterModal(true);
    }

    return (
        <>
            <StoryEditorHeader
                prevStep={prevStep} 
                prevLabel="Get Started" 
                story={story} 
                hideAddChapterBtn={false} 
                confirmAddNewChapter={confirmAddNewChapter}
                saveChaptersProgress={saveChaptersProgress}
            />

            <div className="max-w-4xl mx-auto">
                <div className="relative">
                    {/* Chapter Title with Dropdown */}
                    <div
                        className="flex items-center cursor-pointer mb-1"
                        onClick={toggleChapterList}
                    >
                        <h1 className="text-xl font-bold text-gray-800">Chapter {activeChapterData?.index}</h1>
                        <ChevronDown className={`ml-2 h-5 w-5 text-gray-600 transition-transform ${isChapterListOpen ? 'transform rotate-180' : ''}`} />
                    </div>

                    {/* Chapter List Dropdown */}
                    {isChapterListOpen && (
                        <div
                            ref={chapterListRef}
                            className="absolute left-0 top-10 bg-white shadow-lg rounded-lg z-10 overflow-hidden"
                        >
                            <div className="p-2">
                                {chapters?.map(chapter => (
                                    <div
                                        key={chapter.id}
                                        className={`flex items-center p-3 rounded-md cursor-pointer ${chapter?.id === activeChapter ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                        onClick={() => selectChapter(chapter?.id)}
                                    >
                                        <div className={`w-4 h-4 rounded-full border ${chapter?.id === activeChapter ? 'border-[#D45C51] bg-[#D45C51]' : 'border-gray-300'} mr-3 flex items-center justify-center`}>
                                            {chapter?.id === activeChapter && (
                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <span className="text-gray-800 text-xs">Chapter {chapter?.index}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Editor Area */}
                    <div className="mt-4 flex bg-white p-4 rounded-xl">
                        {/* <button className="h-8 w-8 flex items-center justify-center cursor-pointer bg-gray-100 rounded-md mr-3 text-gray-600 hover:bg-gray-200">
                            <Plus size={20}/>
                        </button> */}
                        <textarea
                            ref={textareaRef}
                            value={activeChapterData?.content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            // onKeyUp={(e) => handleContentChange(e.target.value)}
                            // placeholder="Start writing, click the &quot;+&quot; for more tools"
                            placeholder="Start writing..."
                            className="flex-1 resize-none outline-none text-gray-700 placeholder:italic placeholder-gray-400 min-h-[500px]"
                        />
                    </div>
                </div>                
            </div>

            <div className="my-7">
                <ChapterImagesComponent activeChapterData={activeChapterData} refetch={refetch}/>
            </div>

            <StartWritingFooterComponent 
                nextStep={nextStep} 
                activeChapterData={activeChapterData}
                story={story} 
                saveChaptersProgress={saveChaptersProgress}
                refetch={refetch}
                setActiveChapter={setActiveChapter}
            />

            
            


            <ModalBoxComponent
                isOpen={showConfirmNewChapterModal}
                onClose={() => setShowConfirmNewChapterModal(false)}
                title={`Save progress & proceed?`}
                width="w-[30%]"
                useDefaultHeader={true}
            >
                <div className="bg-white p-5 rounded-2xl">
                    <h1 className="mb-4 text-gray-500 text-center">Moving to chapter {chapters.length + 1}</h1>
                    <div className="grid grid-cols-2 gap-3 ">
                        <button 
                        onClick={() => setShowConfirmNewChapterModal(false)}
                        className="py-3 px-4 font-bold flex items-center justify-center cursor-pointer text-white bg-[#33164C] hover:bg-[#33164C] rounded-md gap-3">
                            Cancel
                        </button>
                        <button 
                        onClick={handleAddChapterClick}
                        className="py-3 px-4 font-bold flex items-center justify-center cursor-pointer text-white bg-black hover:bg-[#3f3f3f] rounded-md gap-3">
                            Proceed
                        </button>
                    </div>
                </div>
            </ModalBoxComponent>


        </>
    );
};

export default StartWritingComponent;