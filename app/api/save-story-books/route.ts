
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from "path";
import { Page } from "@/types/stories";
import { processStoryBookImages, removeFiles, uploadImage } from "@/lib/test";
import axios from "axios";
import { getStoriesData } from '@/lib/getStoryScenes';
import { getStoryBooks } from "@/lib/getAllStories";

export async function POST(request: NextRequest) {
    try {
        
        const { dynamicJwtToken, email } = await request.json();
        const storyBooks = getStoryBooks(email);
        let data = await processStoryBookImages(storyBooks);        

        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories/books`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${dynamicJwtToken}`
            },
            body: JSON.stringify({ stories: data })
        });
        
        if (response.ok && response.body) {
            const data = await response.json();
            console.log(data);
            let deleted = await removeFiles(`books/${email}`);
            if (!deleted) {                
                console.log('There was an error deleting the files');                
            }else{
                const userStoryBooksDirectory = path.join(process.cwd(), `public/books/${email}`);                
                // fs.rmdirSync(userStoryBooksDirectory);
            }
            return NextResponse.json({ storyBooks });
        }
        
        return NextResponse.json({ data: null }, { status: 500 });
        

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}