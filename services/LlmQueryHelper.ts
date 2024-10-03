import { ChatGroq } from "@langchain/groq";
import { PromptTemplate, ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StoryInterface } from "@/interfaces/StoryInterface";
import { ThematicOptionInterface } from "@/interfaces/ThematicOptionInterface";
import { CharacterInterface } from "@/interfaces/CharacterInterface";
import { ChatOpenAI } from "@langchain/openai";
import { toast } from "sonner";

export const queryLLM = async (prompt: string, payload: object) => {
   try {      
      const llm = new ChatGroq({
         apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
         // model: "llama3-70b-8192",
         model: "llama-3.1-70b-versatile"           
      });
  
      const startingPrompt = ChatPromptTemplate.fromMessages([
          ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
          ["human", prompt],
      ]);
  
      const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
  
      const response = await chain.invoke(payload);
      console.log(response);
  
      const parsedResponse = JSON.parse(response);            
      console.log({parsedResponse});
  
      return parsedResponse;
   } catch (error) {
      toast.error("Try again please");
      console.error(error);      
   }
}

export const streamLLMResponse = async (prompt: string, payload: object) => {
   try {      
      const llm = new ChatGroq({
         apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
         // model: "llama3-70b-8192",
         model: "llama-3.1-70b-versatile"           
      });
  
      const startingPrompt = ChatPromptTemplate.fromMessages([
          ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
          ["human", prompt],
      ]);
  
      const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
  
      const response = await chain.stream(payload);

      return response;
   } catch (error) {
      toast.error("Try again please");
      console.error(error);      
   }
}

export const extractTemplatePrompts = (story: StoryInterface) => {
   const tonePrompt                     = story?.introductionTone?.map(tone => tone?.value)?.join(', ');
   const settingPrompt                     = story?.introductionSetting?.map(setting => setting?.value)?.join(', ');
   const genrePrompt                    = story?.genres?.map(genre => genre?.value)?.join(', ');
   // const stakesPrompt                   = story?.storyStructure?.introductionStakes?.map(stake => stake)?.join(' ');
   // const expositionPrompt               = story?.storyStructure?.exposition?.map(exposition => exposition)?.join(' ');
   // const hookPrompt                     = story?.storyStructure?.hook?.map(hook => hook)?.join(' ');
   const protagonistOrdinaryWorldPrompt = story?.storyStructure?.protagonistOrdinaryWorld?.map(option => option)?.join(' ');
   const progressiveComplicationPrompt  = story?.storyStructure?.progressiveComplication?.map(option => option)?.join(' ');   
   const antagonisticForce              = story?.storyStructure?.antagonisticForce?.map(option => option)?.join(' ');   
   
   const thematicElementsPrompt         = story?.thematicOptions?.map(
      (item: ThematicOptionInterface) => `For ${item.thematicElement} as the thematic element, the thematic option is ${item.thematicOption}.`
   )?.join(' ');

   let otherCharactersPrompt = ``;
   if (story?.characters?.length > 0) {      
      otherCharactersPrompt = story.characters?.filter(character => character.isProtagonist === false).map(character => {
         return `Character Name: ${character.name}, Role: ${character.role}, Character's Relationship to Protagonist: ${character.relationshipToProtagonist}`
       })?.join('. ');
   }

   
   const protagonistSuggestionsPrompt = story?.protagonistSuggestions?.map((character) => 
      `Name is ${character?.name}, backstory: ${character?.backstory}. Role: ${character?.role}. Motivations: ${character?.motivations}`
)?.join(" ")

   const protagonistsPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `${character?.name}, backstory: ${character?.backstory}.`)?.join(" ")
   const whatCharacterWantAndWhoHasItPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `${character?.name}, and What ${character?.name} want is ${character?.whatTheyWant}. For the question who has what ${character?.name} wants, the answer is ${character?.whoHasIt}`)?.join(" ")
   const protagonistObstaclePrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `Name: ${character?.name}, Obstacle to achieving goal: ${character?.protagonistGoalObstacle}. `)?.join(" ")
   const protagonistGoalMotivationsPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `Name: ${character?.name}, Motivation to achieve goal: ${character?.motivations?.join(", ")}. `)?.join(" ")
   const whatTheCharacterWantPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `${character?.name}, and What ${character?.name} want is ${character?.whatTheyWant}`)?.join(" ")
   const whoDoesNotHaveCharacterGoalPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `${character?.name}, and What ${character?.name} want is ${character?.whoDoesNotHaveProtagonistGoal}`)?.join(" ")
   const howProtagonistOvercomeObstaclePrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `${character?.name}, How ${character?.name} overcome obstacle: ${character?.howCharacterOvercomeObstacles?.join(", ")}`)?.join(" ")
   const howCharacterGoalChangeRelationshipPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `For ${character?.name}, ${character?.howCharacterGoalChangeRelationship?.join(", ")}`)?.join(" ")
   const emotionTriggerEventPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `For ${character?.name}, ${character?.emotionTriggerEvent?.join(", ")}`)?.join(" ")
   const howCharactersGoalsAndPrioritiesChangedPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `For ${character?.name}, ${character?.howCharactersGoalsAndPrioritiesChanged?.join(", ")}`)?.join(" ")
   const howCharacterHasGrownPrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `For ${character?.name}, ${character?.howCharacterHasGrown?.join(", ")}`)?.join(" ")
   const unresolvedIssuesFromDeparturePrompt = story?.characters?.filter((character) => character?.isProtagonist ).map((character) => `For ${character?.name}, ${character?.unresolvedIssuesFromDeparture?.join(", ")}`)?.join(" ")
   
   return { 
      genrePrompt, 
      thematicElementsPrompt,
      tonePrompt, 
      settingPrompt,
      protagonistSuggestionsPrompt,
      // stakesPrompt, 
      // expositionPrompt, 
      // hookPrompt, 
      // incitingEventPrompt, 
      // firstPlotPointPrompt,
      protagonistOrdinaryWorldPrompt,
      progressiveComplicationPrompt,
      antagonisticForce,
      
      otherCharactersPrompt,
      protagonistsPrompt,
      whatCharacterWantAndWhoHasItPrompt,
      protagonistObstaclePrompt,
      protagonistGoalMotivationsPrompt,
      whatTheCharacterWantPrompt,
      whoDoesNotHaveCharacterGoalPrompt,
      howProtagonistOvercomeObstaclePrompt,
      howCharacterGoalChangeRelationshipPrompt,
      emotionTriggerEventPrompt,
      howCharactersGoalsAndPrioritiesChangedPrompt,
      howCharacterHasGrownPrompt,
      unresolvedIssuesFromDeparturePrompt
   }
}

export const threeActStructureDefinition = `
   Here is the three act structure definition, analyze the following information while generating your response:
   **Act 1: Setup**

   1. **Introduction**: Establish the protagonist, setting, and situation clearly.
      * Define the story’s tone, genre, and stakes immediately
      * Provide essential exposition to immerse the audience in the world and characters?.
      * In the Introduction of a story, the tone, exposition, stakes, and genre are key components. Here's how each one plays a role:
      * Tone: The mood or atmosphere of the story is established here. Whether it's serious, lighthearted, mysterious, or suspenseful, the tone sets expectations for how the audience will feel as the story unfolds.
      * Exposition: This provides the necessary background information. It introduces the audience to the world of the story, including key details about the setting, protagonist, and supporting characters?. It helps the audience understand the context before the main plot kicks in.
      * Stakes: The stakes refer to what the protagonist stands to gain or lose. These stakes are introduced early to give the audience a sense of urgency or importance. Even if the stakes aren't fully clear yet, there’s usually a hint of what’s at risk.
      * Genre: The introduction often signals the genre of the story through its style, setting, and content. Whether it’s a mystery, sci-fi, romance, or adventure, the genre shapes the audience's expectations for the type of story they’re about to experience.

   2. **Inciting Event or Incident**: The catalyst that disrupts the protagonist's status quo.
      * Forces the protagonist to pursue a new goal or adapt to a new reality.
      * Sets the story's main conflict and propels the narrative forward.

   3. **Ordinary World**: Showcase the protagonist’s life before the inciting incident.
      * Introduce supporting characters, relationships, and dynamics.
      * Highlight the protagonist’s strengths, flaws, and motivations, laying the groundwork for growth.

   4. **Plot Point 1**: The first major turning point, shifting the story’s direction.
      * Raises stakes by introducing complications or unexpected challenges.
      * Creates tension by forcing the protagonist to make a decisive choice or take action.

   **Act 2: Confrontation**

   1. **Progressive Complication**: The conflict intensifies through rising challenges.
      * The protagonist faces increasing obstacles, failures, and revelations.
      * Flaws and weaknesses become more apparent, complicating the journey to the goal.

   2. **Midpoint**: A pivotal moment that changes the story’s trajectory.
      * New information or events raise the stakes dramatically.
      * The protagonist reevaluates their approach, often leading to a deeper commitment or a change in strategy.

   3. **Plot Point 2**: A critical turning point that escalates the conflict towards the climax.
      * The protagonist's situation worsens or they face an unexpected setback.
      * The tension reaches its peak as the story builds momentum toward resolution.

   4. **Approaching Climax**: A build-up of events leading to the final confrontation.
      * The protagonist faces their greatest challenges, and failure has severe consequences.
      * Stakes are highest, with the final outcome looming large over the story.

   **Act 3: Resolution**

   1. **Climax**: The peak of the story’s tension, where the protagonist confronts the main conflict head-on.
      * The protagonist faces their ultimate challenge, with the highest risk of failure.
      * The outcome of the story is decided, with victory or defeat hanging in the balance.

   2. **Falling Action**: The immediate aftermath of the climax, where the consequences are revealed.
      * The protagonist’s goal is achieved or lost, and the new status quo begins to take shape.
      * Loose ends are addressed, and any remaining conflicts are resolved.

   3. **Denouement**: The final wrap-up of the story, showing how the characters have changed.
      * The protagonist reflects on their journey, and thematic elements are reinforced.
      * Emotional resolution is provided, leaving the audience with a sense of closure.

   4. **Final Image/Twist**: A last moment or detail that leaves a lasting impact.
      * Provides either finality or a surprising twist that deepens the story.
      * Offers closure while allowing for reflection on the story’s message.
`;

export const extractCharacters = (story: StoryInterface) => {
   let result = "";
   story?.suggestedCharacters?.forEach(character => {
       result += ` Name: ${character?.name}, Role: ${character?.role}, Backstory: ${character?.backstory}.`;
   });
   return result;
}

export function charactersToString(story: StoryInterface) {
   return story?.suggestedCharacters?.map(char => {
     let result = [];
     
     for (let [key, value] of Object.entries(char)) {
       if (Array.isArray(value)) {
         if (key === 'relationshipsWithOtherCharacters') {
           value = value.map(rel => `${rel.relationship} with ${rel.characterName}`)?.join(', ');
         } else {
           value = value?.join(', ');
         }
       }
       result.push(`${key}: ${value}`);
     }
     
     return result?.join('; ');
   })?.join('\n\n');
}

export function extractCharacterSummary(characters: CharacterInterface[]) {
   const summary = characters?.map(char => {
      let result = [];
      
      for (let [key, value] of Object.entries(char)) {
        if (Array.isArray(value)) {
          if (key === 'relationshipsWithOtherCharacters') {
            value = value.map(rel => `${rel.relationship} with ${rel.characterName}`)?.join(', ');
          } else {
            value = value?.join(', ');
          }
        }
        result.push(`${key}: ${value}`);
      }
      
      return result?.join('; ');
    })?.join('\n\n');

   return summary;
}

export const mergeStorytellingFormWithIdea = async (character: CharacterInterface, story: StoryInterface) => {

   try {     
     let { name, backstory, age, role, facialFeatures, gender, hair, skinTone } = character
     console.log({ name, backstory, age, role, facialFeatures, gender, hair, skinTone });
     
      // const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_GPT_API_KEY;

      const llm = new ChatOpenAI({ 
         openAIApiKey,
         model: "gpt-4o-mini", //"gpt-4-vision-preview",        
      });

     const startingTemplate = `
     Generate an image description for a profile shot or character headshot that meets the following criteria:

     * Facial features: {character_facial_features}
     * Age: {character_age}
     * Gender: {character_gender}
     * Skin tone: {character_skin_tone}
     * Hair: ${hair}

     The image should be:

     * Like a movie actor's passport photograph or profile shot or character headshot
     * With a plain background and no writings in the background
     * Realistic, resembling a photograph of a movie actor portraying the character (not cartoon, 2D, or animated)
     * A single person character, with no additional characters or background distractions

     The image should accurately represent the character's age, facial features, gender, skin tone, and hair. The character should be the only focal point in the image, with no background elements or distractions.
     Generate an image description that is allowed for OPENAI's safety system so that it can be used to generate an image.
     `;
     
     const startingPrompt = ChatPromptTemplate.fromMessages([
         ["system", "You are a professional prompt generator and assistant"],
         ["human", startingTemplate],
     ]);
     const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
 
     const response = await chain.invoke({
       prompt: prompt,
      //  story: story?.overview,
       character_name: name,
       character_age: age,
       character_facial_features: facialFeatures,
       // character_backstory: backstory,
       character_gender: gender,
       character_skin_tone: skinTone,
       character_hair: hair,
       character_role: role          
     });

     console.log(response);
     return response;

   } catch (error) {
     console.error(error);  
     return null;    
   }
}  

