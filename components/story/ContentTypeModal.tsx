"use client"

import { useState, useEffect } from 'react';

const ContentTypeModal = ({ contentType }) => {

    if (!contentType) return null;

    const {
        label,
        description,
        recommendedTones,
        recommendedGenres,
        examples
    } = contentType;

    return (
        <div>
            {/* Header with gradient background */}
            {/* from-[#AA4A41] to-[#33164C] */}
            <div className="relative bg-gradient-to-r from-[#33164C] to-[#AA4A41] p-6 rounded-t-xl">

                <h2 className="text-3xl font-bold text-white tracking-tight">{contentType?.label}</h2>
                <p className="mt-2 text-sm text-white/90">{description}</p>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-6">

                    {/* Tones Section */}
                    <section>
                        <h3 className="text-sm lg:text-md xl:text-md font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                            Recommended Tones
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {recommendedTones?.map((tone, index) => (
                                <span
                                    key={index}
                                    className="bg-[#eadff4] dark:bg-[#e7daf3] text-[#33164C] dark:text-[#c0aad3] px-3 py-1 rounded-full text-[9px] font-medium"
                                >
                                    {tone}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    {/* Genres Section */}
                    <section>
                        <h3 className="text-sm lg:text-md xl:text-md font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                            Recommended Genres
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {recommendedGenres?.map((genre, index) => (
                                <span
                                    key={index}
                                    className="bg-[#ffefee] dark:bg-[#AA4A41] text-[#AA4A41] dark:text-[#AA4A41] px-3 py-1 rounded-full text-[9px] font-medium"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Examples Section */}
                    <section>
                        <h3 className="text-sm lg:text-md xl:text-md font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                            Examples
                        </h3>
                        <ul className="space-y-1 list-disc list-inside text-gray-700 text-xs dark:text-gray-300">
                            {examples?.map((example, index) => (
                                <li key={index}>{example}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>


        </div>
    );
};


export const GenreSuggestionsModal = ({ 
    label,
    description,
    recommendedGenres,
}) => {

    return (
        <div>
            <div className="relative bg-gradient-to-r from-[#33164C] to-[#AA4A41] p-6 rounded-t-xl">

                <h2 className="text-3xl font-bold text-white tracking-tight">{label}</h2>
                <p className="mt-2 text-sm text-white/90">{description}</p>
            </div>

            {/* Content */}
            <div className="p-6 gap-6">
               
                <div className="space-y-6">
                    {/* Genres Section */}
                    <section>
                        <h3 className="text-sm lg:text-md xl:text-md font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                            Recommended Genres
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {recommendedGenres?.map((genre, index) => (
                                <span
                                    key={index}
                                    className="bg-[#ffefee] dark:bg-[#AA4A41] text-[#AA4A41] dark:text-[#AA4A41] px-3 py-1 rounded-full text-[9px] font-medium"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>


        </div>
    );
};

export const ToneSuggestionsModal = ({ 
    label,
    description,
    recommendedTones,
}) => {

    return (
        <div>
            <div className="relative bg-gradient-to-r from-[#33164C] to-[#AA4A41] p-6 rounded-t-xl">

                <h2 className="text-3xl font-bold text-white tracking-tight">{label}</h2>
                <p className="mt-2 text-sm text-white/90">{description}</p>
            </div>

            {/* Content */}
            <div className="p-6 gap-6">
               
                <div className="space-y-6">
                    {/* Genres Section */}
                    <section>
                        <h3 className="text-sm lg:text-md xl:text-md font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                            Recommended Tones
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {recommendedTones?.map((tone, index) => (
                                <span
                                    key={index}
                                    className="bg-[#eadff4] dark:bg-[#e7daf3] text-[#33164C] dark:text-[#c0aad3] px-3 py-1 rounded-lg text-[9px] font-medium"
                                >
                                    {tone}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>


        </div>
    );
};


export default ContentTypeModal;


