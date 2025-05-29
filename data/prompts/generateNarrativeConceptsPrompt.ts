interface GenerateNarrativeConceptSuggestionInterface {
    title: string;
    moreDescription: string;
    description: string;
    chapterAmount: number;
}

interface GenerateNarrativeConceptSuggestionInterface {
    description: string;
    tone: string[];
    genres: string[];
    audiences: string[];
    contentType: string;
    storyType: string;
    structure: string;
}

export function generateNarrativeConceptsPrompt(storyInfo: GenerateNarrativeConceptSuggestionInterface, structures: GenerateNarrativeConceptSuggestionInterface[]): string {
    
    let structureInfo = '';
    let numberSix = '';
    
    if (!storyInfo?.structure && structures && structures?.length > 0) {
        structureInfo = `### Available Story Structures:\n${structures.map(structure => 
            `- ${structure?.title}: ${structure?.description} (${structure?.chapterAmount} chapters)`
        ).join('\n')}\n\n`;
    }
    if (!storyInfo?.structure) {
        numberSix = `4. Consider the implications of the chosen story structure if one is provided, if none is provided just ignore and proceed`
    }
    return `
    You are a professional storyteller, expert storytelling assistant author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic, and you always follow instructions.
    Generate 10 compelling narrative concept suggestions for a story with the following characteristics:
    
    ### Story Overview:
    ${storyInfo?.description}
    
    ### Key Story Elements:
    - Tone: ${storyInfo?.tone?.join(', ')}
    - Genres: ${storyInfo?.genres?.join(', ')}
    - Target Audiences: ${storyInfo?.audiences?.join(', ')}
    - Content Type: ${storyInfo?.contentType}
    - Story Type: ${storyInfo?.storyType}
    - Preferred Structure: ${storyInfo?.structure}
    
    ${structureInfo}

    ### Requirements:
    1. Each concept should be 1-2 sentences long
    2. Concepts should align with the specified tone and genres
    3. Include variations that would appeal to each target audience
    4. Explore different angles (character-driven, plot-driven, thematic)
    5. Do not mention anything about the story structure in the narrative concept title or description, just focus of the narrative concept.
    ${numberSix}

    ### Response Format
    Return the narrative concepts as a json or javascript object format with brief explanations of how each concept relates to the story elements.
    
    Now generate 10 specific narrative concepts for this story:
    Return your response in a json or javascript object format like: 
    narrativeConceptSuggestions(array of objects, with object properties like title and description) This refers to the suggestions of narrative concepts for users to choose from.

    Please ensure the only key in the object is narrativeConceptSuggestions key only.
    Do not add any text extra line or text with the json response, just a json object, no acknowledgement or do not return any title, just return json response. Do not go beyond this instruction.                               
    `;
}