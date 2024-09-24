
import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from "path";
import { Page } from "@/types/stories";
import { processImages, removeFiles, uploadImage } from "@/lib/test";
import axios from "axios";
import { getStoriesData } from '@/lib/getStoryScenes';

export async function POST(request: NextRequest) {
    try {
        const { dynamicJwtToken, email } = await request.json();

        const storyScenes = getStoriesData(email);
        let data = await processImages(storyScenes, email);        
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/stories`;

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
            let deleted = await removeFiles(`scenes/${email}`);
            if (!deleted) {
            //     const userStoriesDirectory = path.join(process.cwd(), `public/scenes/${email}`);
            //     await fs.rmdir(userStoriesDirectory, (e) => {
            //         console.log(e);                    
            //     });

            //     console.log('There was an error deleting the files');                
            }
            return NextResponse.json({ data });        
        }
        
        return NextResponse.json({ data }, { status: 500 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}