import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';
import path from "path";

export const uploadImage = async (imagePath: any) => {
    const preset_key = process.env.CLOUDINARY_PRESET_KEY
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
                    
    try{
        if (imagePath && preset_key && cloudName) {
            const formData = new FormData();

            let imageStream = fs.createReadStream(`${imagePath}`) as any
            
            formData.append("file", imageStream);
            formData.append("upload_preset", preset_key)
            
            let res = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
                formData, 
                {                    
                    // onUploadProgress,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        ...formData.getHeaders()
                    },                
                }
            )
            // console.log(res);
            return res?.data?.secure_url
        }
        return false        

    } catch(error){
        console.error(error)    
        return false        
    }
}

export const uploadImages = async (imagePaths: any) => {
    try {
        const uploadPromises = imagePaths.map(path => uploadImage(path));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const processImages = async (data, email: string) => {
    let mainPath = path.join(process.cwd(), "public");

    for (const story of data) {
        if (story.overview?.png) {
            const url = await uploadImage(`${mainPath}/${story.overview.png}`);
            console.log(`Uploaded overview image for ${story.story}: ${url}`);
            story.overview.imageUrl = url ?? null
        }else{
            story.overview.imageUrl = null
        }

        for (const scene of story.scenes) {
            if (scene.png) {
                const url = await uploadImage(`${mainPath}/${scene.png}`);
                console.log(`Uploaded scene image for ${story.story}: ${url}`);
                scene.imageUrl = url ?? null                             
            }else{
                scene.imageUrl = null                             
            }
        }

        for (const character of story.characters) {
            if (character.png) {
                const url = await uploadImage(`${mainPath}/${character.png}`);
                console.log(`Uploaded character image for ${story.story}: ${url}`);
                character.imageUrl = url ?? null               
            }else{
                character.imageUrl = null                               
            }
        }
    }
    return data;
}

export const processStoryBookImages = async (storyBooks) => {
    let mainPath = path.join(process.cwd(), "public");
    for (const storyBook of storyBooks) {

        for (const page of storyBook.pages) {
            if (page?.image) {                
                const url = await uploadImage(`${mainPath}/${page.image}`);
                console.log(`Uploaded page image for ${storyBook.storyTitle}: ${url}`);
                page.imageUrl = url ?? null                             
            }else{
                page.imageUrl = null                             
            }
        }
    }

    return storyBooks;
}

export const removeFiles = async (folder: string) => {
    try {        
        const storiesDirectory = path.join(process.cwd(), `public/${folder}`);
        const storyFolders = fs.readdirSync(storiesDirectory);
        storyFolders.forEach(async (storyFolder) => {
            const storyPath = path.join(storiesDirectory, storyFolder);
            const files = fs.readdirSync(storyPath);
    
            const unlinkPromises = files.map(file => fs.unlink(path.join(storyPath, file), () => {}) );
            await Promise.all(unlinkPromises);
            fs.rmdirSync(storyPath);
        });

        return true;
    } catch (error) {
        return false;        
    }
}
