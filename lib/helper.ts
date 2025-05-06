import axios from "axios";
import { formatDistanceToNow } from "date-fns";

export const formatDate = (targetDate: string) => {
    let format = formatDistanceToNow(new Date(targetDate), { addSuffix: true })
    return format ?? '';        
}

export const showPageLoader = () => {
    let fullPageLoader = document.getElementById("full-page-loader") as HTMLElement
    if (fullPageLoader) {            
        fullPageLoader.style.display = "block";    
    }
}

export const hidePageLoader = () => {
    let fullPageLoader = document.getElementById("full-page-loader") as HTMLElement
    if (fullPageLoader) {            
        fullPageLoader.style.display = "none";    
    }
}


export const uploadToCloudinary = async (file: any) => {
    try {
        
        const preset_key: string = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_KEY ?? "" as string
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
        if (file && preset_key && cloudName) {
            const formData = new FormData();
            formData.append("file", file)
            formData.append("upload_preset", preset_key)
    
            let response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                formData
            )
            console.log("Image: ", response);
    
            return response;
        };
        return false;
    } catch (error) {
        console.error(error);        
        return false;
    }
}


export const generateRandomNumber = (max: number) =>  {
    // Check if max is a positive integer
    if (typeof max !== 'number' || max < 0 || max % 1 !== 0) {
        throw new Error('max must be a non-negative integer');
    }

    // Use crypto.getRandomValues to generate a cryptographically secure random number
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomNumber = array[0] % (max + 1);

    return randomNumber;
}
