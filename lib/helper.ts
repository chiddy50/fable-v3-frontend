// import { getPlaiceholder } from "plaiceholder"

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