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


export const generateRandomNumber = (max: number) => {
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


export function convertNumberToWords(num: number): string {
    // Handle edge cases first
    if (num === 0) return 'zero';

    // Handle negative numbers
    if (num < 0) return 'negative ' + convertNumberToWords(Math.abs(num));

    // Arrays for word representation
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    // Helper function to avoid recursion for small numbers
    function convertLessThanThousand(n: number): string {
        if (n === 0) return '';
        if (n < 20) return units[n];

        const digit = n % 10;
        if (n < 100) {
            return tens[Math.floor(n / 10)] + (digit ? '-' + units[digit] : '');
        }

        return units[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + convertLessThanThousand(n % 100) : '');
    }

    // Break the number into chunks to avoid deep recursion
    let result = '';

    // Handle billions
    const billion = Math.floor(num / 1000000000);
    if (billion > 0) {
        result += convertLessThanThousand(billion) + ' billion';
        num %= 1000000000;
        if (num > 0) result += ' ';
    }

    // Handle millions
    const million = Math.floor(num / 1000000);
    if (million > 0) {
        result += convertLessThanThousand(million) + ' million';
        num %= 1000000;
        if (num > 0) result += ' ';
    }

    // Handle thousands
    const thousand = Math.floor(num / 1000);
    if (thousand > 0) {
        result += convertLessThanThousand(thousand) + ' thousand';
        num %= 1000;
        if (num > 0) result += ' ';
    }

    // Handle the rest
    if (num > 0) {
        result += convertLessThanThousand(num);
    }

    return result;
}



export const trimWords = (str: string, numWords: number) => {
    // Trim leading and trailing whitespace
    const trimmedStr = str?.trim();
    
    // Split the string into an array of words
    const words = trimmedStr?.split(/\s+/);
    
    // If the number of words is less than or equal to numWords, return the original string
    if (words?.length <= numWords) {
      return trimmedStr;
    }
    
    // Join the first numWords words and add ellipsis
    return words?.slice(0, numWords)?.join(' ') + '...';
}


export const scrollToBottom = (id: string) => {
    const element = document.getElementById(id);
    if (element) {            
        element.scrollIntoView({ behavior: "smooth" });
    }
}