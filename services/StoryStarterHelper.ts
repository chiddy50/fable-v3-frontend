import { StoryStarterPayloadInterface } from "@/interfaces/StoryStarterInterface";
import { toast } from "sonner"

export const validateStoryStarterForm = (storyStarterData: StoryStarterPayloadInterface) => {

    if (!storyStarterData) {
        toast.error("Kindly fill the form");        
    }

    const { genres, suspenseTechnique, thematicElements, thematicOptions } = storyStarterData;

    if (genres?.length < 1) {
        toast.error("Kindly provide a genre");    
        return false;            
    }

    if (thematicElements?.length < 1) {
        toast.error("Kindly provide a thematic element");    
        return false;            
    }

    if (thematicOptions?.length < 1) {
        toast.error("Kindly provide a thematic option");    
        return false;            
    }

    const emptyThematicOptionCount = thematicOptions?.filter(item => !item.thematicOption).length || 0;

    if (emptyThematicOptionCount > 0) {
        const message = emptyThematicOptionCount === 1 
            ? "A thematic option is missing" 
            : "Some thematic options are missing";
        
        toast.error(message);
        return false;
    }
    

    if (!suspenseTechnique) {
        toast.error("Kindly provide a suspense technique");    
        return false;            
    }

    return true;
}