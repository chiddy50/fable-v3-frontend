interface Character {
  id: string;
  age: string;
  alias: string;
  backstory: string;
  externalConflict: string;
  internalConflict: string;
  name: string;
  relationshipToProtagonists: string;
  relationshipToOtherCharacters: Array<{
    id: string;
    name: string;
    relationship: string;
  }>;
  role: string;
  strengths: string;
  weaknesses: string;
  voice: string;
  perspective: string;
}

interface NarrativeConcept {
  title: string;
  description: string;
}

interface StoryPayload {
  genres: string[];
  audiences: string[];
  contentType: string;
  synopsis: string;
  projectTitle: string;
  narrativeConcept: NarrativeConcept;
  projectDescription: string;
  tone: string[];
  existingCharacters: Character[];
  incomingCharacters: Character[];
}

function generateCharacterIntegrationPrompt(payload: StoryPayload): string {
  // Validate payload structure
  if (!payload || typeof payload !== 'object') {
    return "Error: Invalid payload provided. Please ensure the payload is a valid story object.";
  }

  // Check if incoming characters exist and are not empty
  const hasIncomingCharacters = payload.incomingCharacters && 
                               Array.isArray(payload.incomingCharacters) && 
                               payload.incomingCharacters.length > 0;

  if (!hasIncomingCharacters) {
    return "No new characters need to be integrated. The current synopsis remains unchanged.";
  }

  // Extract existing story information
  const {
    genres = [],
    audiences = [],
    contentType = "Fiction",
    synopsis = "",
    narrativeConcept = { title: "", description: "" },
    tone = [],
    existingCharacters = [],
    incomingCharacters = []
  } = payload;

  // Build character relationship context
  const buildCharacterContext = (character: Character): string => {
    let context = `**${character.name}** (${character.alias})\n`;
    context += `- Role: ${character.role}\n`;
    context += `- Age: ${character.age}\n`;
    context += `- Backstory: ${character.backstory}\n`;
    context += `- External Conflict: ${character.externalConflict}\n`;
    context += `- Internal Conflict: ${character.internalConflict}\n`;
    context += `- Relationship to Protagonists: ${character.relationshipToProtagonists}\n`;
    
    // Add established relationships if they exist
    if (character?.relationshipToOtherCharacters && 
        Array.isArray(character.relationshipToOtherCharacters) && 
        character.relationshipToOtherCharacters.length > 0) {
      
      context += `- Established Relationships:\n`;
      character.relationshipToOtherCharacters.forEach(rel => {
        // Validate that the relationship has required properties
        if (rel.name && rel.relationship) {
          context += `  • ${rel.name}: ${rel.relationship}\n`;
        }
      });
    } else {
      context += `- Established Relationships: None specified\n`;
    }
    
    context += `- Character Voice: ${character.voice}\n`;
    context += `- Perspective: ${character.perspective}\n\n`;
    
    return context;
  };

  // Generate the prompt
  let prompt = `# Character Integration Task\n\n`;
  
  prompt += `## Current Story Context\n`;
  prompt += `**Title:** ${payload?.projectTitle || "A Symphony of Errors"}\n`;
  prompt += `**Genres:** ${genres.join(", ") || "Adventure, Comedy"}\n`;
  prompt += `**Target Audience:** ${audiences.join(", ") || "Young Adult, 18+"}\n`;
  prompt += `**Tone:** ${tone.join(", ") || "Adventurous, Dramatic, Humorous"}\n\n`;
  
  prompt += `**Current Synopsis:**\n${synopsis}\n\n`;
  
  prompt += `**Narrative Concept:**\n${narrativeConcept.description}\n\n`;

  // Add existing characters summary
  if (existingCharacters.length > 0) {
    prompt += `## Existing Characters (${existingCharacters.length})\n`;
    existingCharacters.forEach(char => {
      prompt += `- **${char.name}** (${char.alias}): ${char.role}\n`;
    });
    prompt += `\n`;
  }

  // Add incoming characters details
  prompt += `## Characters to Integrate (${incomingCharacters.length})\n\n`;
  incomingCharacters.forEach(character => {
    prompt += buildCharacterContext(character);
  });

  // Generate the integration instructions
  prompt += `## Integration Instructions\n\n`;
  prompt += `Please analyze the current synopsis and determine if the following character(s) should be integrated:\n\n`;
  
  incomingCharacters.forEach((character, index) => {
    prompt += `${index + 1}. **${character.name}** - Consider their role as ${character.role} and their relationship to the existing story dynamics.\n`;
  });

  prompt += `\n**Guidelines:**\n`;
  prompt += `- Only integrate characters if they add meaningful value to the story\n`;
  prompt += `- Maintain the existing tone and narrative flow\n`;
  prompt += `- Consider established relationships and conflicts\n`;
  prompt += `- Preserve the core family dynamic while adding new layers of complexity\n`;
  prompt += `- If a character doesn't fit naturally, explain why they should remain separate\n`;
  prompt += `- Ensure that every character generated and every object in the relationshipToOtherCharacters array has the character's unique id, this is important for referencing\n`;
  prompt += `- Use simple grammar and ensure the synopsis is between two to three lines.\n\n`;

  prompt += `**Deliverable:**\n`;
  prompt += `Provide an updated synopsis that seamlessly incorporates the necessary characters, or explain why the current synopsis should remain unchanged. Ensure the integration feels natural and enhances rather than disrupts the existing narrative flow.\n`;
  prompt += `
  **Response Format:**\n
    Return your response in a json or JavaScript object format like: 
    synopsis(string) This refers to the synopsis,
    synopsisChanged(boolean) This refers if the story synopsis will change or not .i.e either true or false,
    reasonSynopsisChanged(string) This refers to the reason the synopsis is being changed if it needs to be.

    Please ensure the only keys in the object are synopsis, synopsisChanged, and reasonSynopsisChanged keys only.
    Do not add any text extra line or text with the json response, just a json or JavaScript object, no acknowledgement or do not return any title, just return a structured json response. Do not go beyond this instruction.                               
    Remember return a JavaScript or json object as your response`;

  return prompt;
}

// Example usage and export
export { generateCharacterIntegrationPrompt, type StoryPayload, type Character };

// Usage example (commented out):
/*
const updatedPrompt = generateCharacterIntegrationPrompt(storyPayload);
console.log(updatedPrompt);
*/