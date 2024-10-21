export interface GenericCharacterInterface {
    name: string;
    age: string;
    role: string;
    habits: string;
    innerConflict: string;
    clothDescription: string;
    antagonistForce: string;
    gender: string;
    relevanceToAudience: string;
    motivations: string[];
    skinTone: string;
    height: string;
    weight: string;
    hairTexture: string;
    hairLength: string;
    hairQuirk: string;
    facialHair: string;
    facialFeatures: string;
    characterTraits: string[];
    angst: string;
    backstory: string;
    weaknesses: string[];
    strengths: string[];
    coreValues: string[];
    skills: string[];
    speechPattern: string;
}
  
export interface SuggestedProtagonistInterface extends GenericCharacterInterface {
    relationshipToOtherProtagonist?: string;
}
  
export interface SuggestedOtherCharacterInterface extends GenericCharacterInterface {
    relationshipToProtagonists: {
        protagonistName: string;
        relationship: string;
    }[];
}