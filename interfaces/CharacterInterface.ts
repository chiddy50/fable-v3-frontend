interface CharacterRelationship {
    characterName: string;
    relationship: string;
}

export interface CharacterInterface {
    id?: string;
    storyId: string;
    createdAt?: string;   
    imageUrl?: string; 
    name: string;
    isProtagonist: boolean;
    relationshipToProtagonist: string;

    protagonistGoalSuggestions: string[];
    skillsSuggestions: string[];
    protagonistGoalObstacleSuggestions: string[];
    protagonistGoalObstacle: string;

    whatTheyWant: string;
    whoHasIt: string;

    whoDoesNotHaveProtagonistGoalSuggestions: string[];
    whoDoesNotHaveProtagonistGoal: string;

    emotionTriggerEvent: string[];
    emotionTriggerEventsSuggestions: string[];
    
    howCharacterOvercomeObstacleSuggestions: string[];
    howCharacterOvercomeObstacles: string[];

    howCharacterGoalChangeRelationshipSuggestions: string[];
    howCharacterGoalChangeRelationship: string[];

    howCharacterHasGrown: string[];
    howCharacterHasGrownSuggestions: string[];

    howCharactersGoalsAndPrioritiesChangedSuggestions: string[];
    howCharactersGoalsAndPrioritiesChanged: string[];

    unresolvedIssuesFromDepartureSuggestions: string[];
    unresolvedIssuesFromDeparture: string[];


    height:                            string;
    weight:                            string;
  
    hairTexture:                      string;
    hairLength:                       string;
    hairQuirk:                        string;
    facialHair:                       string;
    extraDescription:                      string;     

    age: string;  // Consider changing this to number if age should be numeric
    role: string;
    skinTone: string;                       
    hair: string;                              
    facialFeatures: string;                    
    gender: string;                            
    personalityTraits: string[];
    motivations: string[];
    backstory: string;
    angst: string;
    relationships: string[];
    relationshipsWithOtherCharacters: CharacterRelationship[];
    motivationSuggestions: string[];
    skills: string[];
    weaknesses: string[];
    coreValues: string[];
    values: string[];
    strengths: string[];
    speechPattern: string;
}

export interface SuggestedCharacterInterface {
    name: string; 
    backstory: string; 
    role: string; 
    relationshipToProtagonist: string;
    disabled?: boolean;
}