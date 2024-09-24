import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from "path";
import { Page } from "@/types/stories";
import { processImages, uploadImage } from "@/lib/test";
import axios from "axios";
import FormData from 'form-data';

export async function POST(request: NextRequest) {
    const { imageUrl, dynamicJwtToken } = await request.json();

    const preset_key = process.env.CLOUDINARY_PRESET_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    try {
        const response = await fetch(imageUrl)
        const imageBlob = await response.blob();
        console.log({imageBlob});

        const formData = new FormData();
        formData.append('image', imageBlob, 'filename.jpg');

        let res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
            formData, 
            {                    
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...formData.getHeaders()
                },                
            }
        );
        console.log({res});
        
        
        return NextResponse.json({ imageBlob: imageBlob });

    } catch (error) {
        console.error('Error downloading image:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


