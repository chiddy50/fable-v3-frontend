"use client";

import React from 'react';

const ChapterProgressBarComponent = ({ chapter }: { chapter: number }) => {
  const totalChapters = 7;
  const progress = Math.min(Math.max((chapter / totalChapters) * 100, 0), 100);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-xs font-medium text-gray-50">Reading Progress</span>
        <span className="text-xs font-medium text-gray-50">{`${Math.round(progress)}%`}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 text-xs text-gray-100">
        Chapter {chapter} of {totalChapters}
      </div>
    </div>
  );
};

export default ChapterProgressBarComponent;