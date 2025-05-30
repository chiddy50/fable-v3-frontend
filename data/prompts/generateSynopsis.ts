// import { CreateStorySynopsisInterface } from "@/interfaces/SynopsisInterface";


// interface StoryStructure {
//     title: string;
//     moreDescription: string;
//     description: string;
//     chapterAmount: number;
// }

// /**
//  * Generates an LLM prompt for creating a story synopsis based on provided story data
//  * @param storyData - The story information collected from the user
//  * @param availableStructures - Optional array of story structures to suggest if no structure is selected
//  * @returns A formatted prompt string for LLM consumption
//  */
// export function generateSynopsisPrompt(
//     storyData: CreateStorySynopsisInterface,
//     availableStructures?: StoryStructure[]
// ): string {
//     const {
//         description,
//         tone,
//         genres,
//         storyAudiences,
//         contentType,
//         storyType,
//         structure,
//         narrativeConcept,
//     } = storyData;

//     // Build the base prompt
//     let prompt = `Create a compelling synopsis for the following story:

// **Story Description:** ${description}

// **Story Details:**
// - Content Type: ${contentType}
// - Story Type: ${storyType.replace('-', ' ')}
// - Genres: ${genres.join(', ')}
// - Target Audience: ${storyAudiences.join(', ')}
// - Tone: ${tone.join(', ')}

// `;

//     // Handle structure logic
//     if (structure === null) {
//         prompt += `**Structure Requirement:**
// Since no specific story structure has been selected, please suggest an appropriate story structure for this ${storyType.replace('-', ' ')} and incorporate it into your synopsis. `;

//         if (availableStructures && availableStructures.length > 0) {
//             prompt += `Consider one of these available structures or suggest your own:

// `;
//             availableStructures.forEach((struct, index) => {
//                 prompt += `${index + 1}. **${struct.title}**: ${struct.moreDescription}
//    - Full Description: ${struct.description}
//    - Recommended Chapters: ${struct.chapterAmount}

// `;
//             });
//         }

//         prompt += `Please select or suggest the most appropriate structure and explain why it fits this story.

// `;
//     } else {
//         prompt += `**Story Structure:** ${structure}

// Please create the synopsis following the ${structure} structure format.

// `;
//     }

//     // Add final requirements
//     prompt += `**Requirements for the Synopsis:**
// 1. Keep it engaging and appropriate for the target audience (${storyAudiences.join(', ')})
// 2. Maintain the ${tone.join(' and ')} tone throughout
// 3. Clearly reflect the ${genres.join(' and ')} genre elements
// 4. Provide a clear overview of the main plot points without giving away the ending
// 5. Include key characters, conflict, and stakes
// 6. Provide a list of suggestions for the story's narrative concept (Provide at least 8 suggestions and be creative about it)
// 7. Make it compelling enough to hook potential readers
// 8. Ensure The story follows the narrative concept of ${narrativeConcept} structure, beginning with ${description}.
// 9. Keep the length appropriate for a ${storyType.replace('-', ' ')} (typically 1-2 paragraphs for short stories, 2-3 for longer works)
// 10. Generate an enhanced and refined project description that expands on the original idea while maintaining its core essence, make it look like a prompt. 

// ${structure === null ? '' : 'Provide a well-structured synopsis that follows the specified story structure.'}

// Ensure the project description generated can be used as a prompt to describe the story in a very short & summarized way.

// Return your response in a json or JavaScript object format like: 
// synopsis(string) This refers to the synopsis,
// storyStructure(string) This refers to the story structure suggested,
// reason(string) This refers to the reason the story structure is suggested,
// projectDescription(string) This refers to an enhanced and refined version of the original project description that incorporates insights from the synopsis generation process,

// Please ensure the only keys in the object are synopsis, storyStructure, reason, and projectDescription keys only.
// Do not add any text extra line or text with the json response, just a json or JavaScript object, no acknowledgement or do not return any title, just return a structured json response. Do not go beyond this instruction.                               

// `;

//     return prompt;
// }



import { CreateStorySynopsisInterface } from "@/interfaces/SynopsisInterface";


interface StoryStructure {
    title: string;
    moreDescription: string;
    description: string;
    chapterAmount: number;
}

/**
 * Generates an LLM prompt for creating a story synopsis based on provided story data
 * @param storyData - The story information collected from the user
 * @param availableStructures - Optional array of story structures to suggest if no structure is selected
 * @returns A formatted prompt string for LLM consumption
 */
export function generateSynopsisPrompt(
    storyData: CreateStorySynopsisInterface,
    availableStructures?: StoryStructure[]
): string {
    const {
        description,
        tone,
        genres,
        storyAudiences,
        contentType,
        storyType,
        structure,
        narrativeConcept,
    } = storyData;

    // Build the base prompt
    let prompt = `You are a professional storyteller, expert storytelling assistant author, and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also helpful and enthusiastic, and you always follow instructions.
    Create a compelling synopsis for the following story:

**Story Description:** ${description}

**Story Details:**
- Content Type: ${contentType}
- Story Type: ${storyType.replace('-', ' ')}
- Genres: ${genres.join(', ')}
- Target Audience: ${storyAudiences.join(', ')}
- Tone: ${tone.join(', ')}

`;

    // Handle structure logic
    if (structure === null) {
        prompt += `**Structure Requirement:**
                Since no specific story structure has been selected, please suggest an appropriate story structure for this ${storyType.replace('-', ' ')} and incorporate it into your synopsis. `;

        if (availableStructures && availableStructures.length > 0) {
            prompt += `Consider one of these available structures:`;
            availableStructures.forEach((struct, index) => {
                prompt += `${index + 1}. **${struct.title}**: ${struct.moreDescription}
                - Full Description: ${struct.description}
                - Recommended Chapters: ${struct.chapterAmount}

                `;
            });
        }

        prompt += `Please select the most appropriate structure and explain why it fits this story.`;
    } else {
        prompt += `**Story Structure:** ${structure}
        Please create the synopsis following the ${structure} structure format.`;
    }

    // Add final requirements
    prompt += `**Requirements for the Synopsis:**
1. Keep it engaging and appropriate for the target audience (${storyAudiences.join(', ')})
2. Maintain the ${tone.join(' and ')} tone throughout
3. Clearly reflect the ${genres.join(' and ')} genre elements
4. Provide a clear overview of the main plot points without giving away the ending
5. Include key characters, conflict, and stakes
6. Make it compelling enough to hook potential readers
7. Ensure The story follows the narrative concept of ${narrativeConcept} structure, beginning with ${description}.
8. Keep the length appropriate for a ${storyType.replace('-', ' ')} (typically 1-2 paragraphs for short stories, 2-3 for longer works)
9. Generate an enhanced and refined project description that expands on the original idea while maintaining its core essence, make it look like a prompt.
10. Extract and categorize all key HUMAN CHARACTERS ONLY from the synopsis. Characters must be actual people, beings, or sentient entities - NOT organizations, locations, places, objects, or abstract concepts.
11. Ensure every character listed is a living, breathing person or humanoid entity with agency and personality - exclude any non-person entities like companies, governments, places, or inanimate objects.
12. Ensure that every character generated and every object in the relationshipToOtherCharacters array has the character's unique id, this is important for referencing.
13. Use simple grammar and ensure the synopsis is between two to three lines.

${structure === null ? '' : 'Provide a well-structured synopsis that follows the specified story structure.'}

Ensure the project description generated can be used as a prompt to describe the story in a very short & summarized way.

Return your response in a json or JavaScript object format like: 
synopsis(string) This refers to the synopsis,
storyStructure(string) This refers to the story structure suggested,
reason(string) This refers to the reason the story structure is suggested,
projectDescription(string) This refers to an enhanced and refined version of the original project description that incorporates insights from the synopsis generation process,
characters(array) This refers to an array of character objects with the following structure:
  - id(string): Character's unique Id, generate a radom id for each user
  - name(string): This refers to the character's name, ensure the name is not a title but an actual name that can be given to a character
  - alias(string): This refers to the character's alias
  - gender(string): This refers to the character's gender, if the character is not human, suggest an imaginary gender if possible, be creative about it.
  - age(string): Character's age
  - role(string): Either "protagonist", "antagonist", or "supporting-character"
  - race(string): The race of the character"
  - backstory(string): This refers to one pivotal past event that shaped who they are today and how this event influences their current worldview.
  - internalConflict(string): This refers to what they want most a description of the internal conflict of the character 
  - externalConflict(string): This refers to why they want what what they want and it's description of the external conflict of the character
  - relationshipToProtagonists(string): Brief backstory or description of the character and their role in the story
  - relationshipToOtherCharacters(array of objects with the following properties: name, id and relationship): Their connection to other main characters and what they represent to each other (mentor, foil, love interest, etc.)
  - weaknesses(string): The character trait that creates conflict and drives character arc, How this flaw manifests in their behavior.
  - strengths(string): This refers to the characters strengths
  - voice(string): This refers to how the character speaks or thinks (formal, casual, optimistic, cynical)
  - perspective(string): Their unique worldview or philosophy

Please ensure the only keys in the object are synopsis, storyStructure, reason, projectDescription, and characters keys only.
Also ensure the only keys in the characters array of objects are id, name, alias, gender, age, role, race, backstory, internalConflict, externalConflict, relationshipToProtagonists, relationshipToOtherCharacters, weaknesses, strengths, voice and perspective keys only.
Ensure all the objects in the characters array have all the properties mentioned and required.

NOTE: Ensure that every character generated and every object in the relationshipToOtherCharacters array has the character's unique id and ensure the name is the same as the character's name, this is important for referencing.

Do not add any text extra line or text with the json response, just a json or JavaScript object, no acknowledgement or do not return any title, just return a structured json response. Do not go beyond this instruction.                               
Remember return a JavaScript or json object as your response 
`;

    return prompt;
}


// 6. Provide a list of suggestions for the story's narrative concept (Provide at least 8 suggestions and be creative about it)
