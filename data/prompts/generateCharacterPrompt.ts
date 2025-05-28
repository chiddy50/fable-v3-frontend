import { GenerateCharacterInterface } from "@/interfaces/prompts/GenerateCharacterInterface";

/**
 * Generates a comprehensive prompt for AI character generation based on story context
 * @param storyData - Complete story data including existing characters, synopsis, genres, etc.
 * @returns Formatted prompt string for character generation
 */
function generateCharacterPrompt(storyData: GenerateCharacterInterface): string {
  // Extract key information
  const genres = storyData?.genres?.map(g => g.storyGenre.name).join(", ");
  const tones = storyData?.tone?.join(", ");
  const audiences = storyData?.storyAudiences?.map(a => a.targetAudience.name).join(", ");
  const existingCharacterNames = storyData?.characters?.map(c => `${c.name} (${c.role})`).join(", ");
  const existingCharacterBackstories = storyData.characters.map(c => `${c.name} (${c.backstory})`).join(", ");
  
  // Build character relationships context
  const characterRelationships = storyData.characters.map(char => {
    const relationships = char.relationshipToOtherCharacters
      .map(rel => `${rel.name}: ${rel.relationship}`)
      .join("; ");
    return `${char.name}: ${relationships || "No established relationships"}`;
  }).join("\n");

  const prompt = `You are an expert storytelling assistant. Generate 7 unique character suggestions for a new "${storyData.characterRole}" character in the following story context.

**STORY INFORMATION:**
- Title: "${storyData.narrativeConcept.title}"
- Structure: ${storyData.storyStructure}
- Genres: ${genres}
- Tone: ${tones}
- Target Audience: ${audiences}
- Content Type: ${storyData.contentType}

**STORY SYNOPSIS:**
${storyData.content}

**NARRATIVE CONCEPT:**
${storyData.narrativeConcept.description}

**EXISTING CHARACTERS:**
${existingCharacterNames || "None yet"}

**EXISTING CHARACTERS BACKSTORIES:**
${existingCharacterBackstories || "None yet"}

**CHARACTER RELATIONSHIPS:**
${characterRelationships || "No relationships established yet"}

**REQUIREMENTS:**
Generate 7 diverse character suggestions that will serve as a "${storyData.characterRole}" in this story. Each character should:

1. **Fit the Role**: Clearly fulfill the function of a ${storyData.characterRole} within the story structure
2. **Complement Existing Characters**: Create interesting dynamics with established characters
3. **Match the Tone & Genre**: Align with the ${tones} tone and ${genres} genre(s)
4. **Serve the Plot**: Have clear potential for driving or supporting the main narrative
5. **Be Age-Appropriate**: Suitable for the ${audiences} audience
6. **Offer Variety**: Each suggestion should be distinctly different in background, personality, and approach

**CREATIVITY GUIDELINES:**
- Draw inspiration from the story's themes of time travel, love, sacrifice, and moral complexity
- Consider how each character could impact the existing character dynamics
- Think about how they might challenge or support the protagonist's journey
- Ensure each character has clear motivations that align with their role as ${storyData.characterRole}
- Make each suggestion feel like they belong in this specific story world

Generate characters that would genuinely enhance "${storyData.narrativeConcept.title}" and create compelling story possibilities.

**FORMAT YOUR RESPONSE AS JSON:**
Return your response in a json or JavaScript object format like: 
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
  - weaknesses(string): The character trait that creates conflict and drives character arc, How this flaw manifests in their behavior.
  - strengths(string): This refers to the characters strengths
  - voice(string): This refers to how the character speaks or thinks (formal, casual, optimistic, cynical)
  - perspective(string): Their unique worldview or philosophy
  - roleJustification(string): "Why they work perfectly as a ${storyData.characterRole}"
  - uniqueHook(string): "What makes this character memorable and distinct"


Do not add any text extra line or text with the json response, just a json object, no acknowledgement or do not return any title, just return json response. Do not go beyond this instruction.                               
Also ensure the only keys in the characters array of objects are id, name, alias, gender, age, role, race, backstory, internalConflict, externalConflict, relationshipToProtagonists, weaknesses, strengths, voice, perspective, roleJustification and uniqueHook keys only.

Do not add any text extra line or text with the json response, just a json or JavaScript object, no acknowledgement or do not return any title, just return a structured json response. Do not go beyond this instruction.                               
Remember return a JavaScript or json object as your response 
`;

  return prompt;
}

export default generateCharacterPrompt;