import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';


interface Props {    
    toggleChapterList: any;
    activeChapterData: any;
    isChapterListOpen: any;
    chapterListRef: any;
    textareaRef: any;
    chapters: any;
    selectChapter: () => void;
    handleContentChange: () => any;
    activeChapter: any;

}

const ChapterEditorComponent: React.FC<Props> = ({
    toggleChapterList,
    activeChapterData,
    isChapterListOpen,
    chapterListRef,
    chapters,
    selectChapter,
    handleContentChange,
    activeChapter,
    textareaRef,
}) => {



    return (
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
                <div className="mt-4 flex bg-white p-3 rounded-xl">
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
    );
};

export default ChapterEditorComponent;