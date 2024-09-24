import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Story } from '@/types/stories'
import { getAllStories } from '@/lib/getAllStories'
import { BookOpen } from 'lucide-react'


export const revalidate = 0;

function Stories() {
    const stories: Story[] = getAllStories()    
    // const blurredImageData = await getBase64(url) 

    return (
        <div className='p-10 max-w-7xl mx-auto'>      
            {stories.length === 0 && <p>No stories found.</p>}      
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
                {stories.map((story, index) => (
                    <Link href={`/stories/${story.story}`} key={index}
                    className='border rounded-lg cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all duration-300 ease-in-out'>
                        <div className='relative'>
                            <p className='absolute flex items-center top-0 right-0
                            bg-white text-blue-500 font-bold p-3 rounded-lg m-2 text-xs
                            '>
                                <BookOpen className='w-4 h-4 mr-1' />    
                                {story.pages.length === 1 
                                    ? `${story.pages.length} Page`
                                    : `${story.pages.length} Pages`
                                }
                            </p>    
                            <Image 
                            src={story.pages[0].png} 
                            width={500}
                            height={500}
                            // placeholder='blur'
                            className='w-full object-contain rounded-t-lg'
                            alt={story.story} 
                            // blurDataURL={blurredImageData}
                            />
                        </div>    
                        <h2 className='text-md p-5 first-letter:text-3xl font-light text-center'>{story.story}</h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Stories
