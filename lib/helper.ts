// import { getPlaiceholder } from "plaiceholder"

import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

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

export const extractLLMPromptPayload = (initialStoryData) => {
    const genrePrompt = initialStoryData.genres.map(genre => genre.value).join(', ');
    const thematicElementsPrompt = initialStoryData.thematicOptions.map(
        item => `For ${item.thematicElement} as the thematic element, the thematic option is ${item.thematicOption}.`
    ).join(' ');
    const suspenseTechniquePrompt = initialStoryData.suspenseTechnique.value;
    const suspenseTechniqueDescriptionPrompt = initialStoryData.suspenseTechnique.description;
    
    return {
        genrePrompt,
        thematicElementsPrompt,
        suspenseTechniquePrompt,
        suspenseTechniqueDescriptionPrompt,
    }
}

export const storyStarterGuide = [
    {
      element: '.genre-input',
      intro: 'Choose a story genre',
      position: 'right',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighlightClass',
    },
    {
      element: '.thematic-element-input',
      intro: 'Decide the thematic element of your story',
      position: 'left',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighlightClass',
    },
    {
      element: '.suspense-technique-input',
      intro: 'Decide the suspense technique of your story',
      position: 'top',
      tooltipClass: 'myTooltipClass',
      highlightClass: 'myHighlightClass',
    },
];

export const formatDate = (targetDate: string) => {
    let format = formatDistanceToNow(new Date(targetDate), { addSuffix: true })
    return format ?? '';        
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

export const truncateString = (inputString: string) => {
    if (inputString.length <= 8) {
        return inputString; // If the string is already 8 characters or less, return it unchanged
    } else {
        const truncatedString = inputString.slice(0, 4) + '...' + inputString.slice(-4);
        return truncatedString;
    }
}

/**
 * Validates if a given string is a valid Solana public address.
 * @param address - The Solana public address to validate.
 * @returns boolean - True if the address is valid, otherwise false.
 */
export const isValidSolanaAddress = (address: string): boolean => {
    try {
        new PublicKey(address);
        return true;  // If no error is thrown, the address is valid
    } catch (error) {
        return false;
    }
};