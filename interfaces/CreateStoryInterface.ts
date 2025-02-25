import { SuggestedCharacterInterface } from "./CharacterInterface";
import { SceneInterface } from "./SceneInterface";

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

export interface FirstPlotPointChapterAnalysis {
    scenes: SceneInterface[];
    summary: string;
    charactersInvolved: SuggestedOtherCharacterInterface[];
    protagonistGoal: string;
    protagonistTriggerToAction: string;
    obstaclesProtagonistWillFace: string;
    tone: string[];
    setting: string[];
}

export interface RisingActionChapterAnalysis {
    scenes: SceneInterface[];
    summary: string;
    charactersInvolved: SuggestedCharacterInterface[];
    challengesProtagonistFaces: string;
    protagonistPerspectiveChange: string;
    majorEventPropellingClimax: string;
    tone: string[];
    setting: string[];
}

export interface PinchPointsAndSecondPlotPointChapterAnalysis {
    scenes: SceneInterface[];
    summary: string;
    newObstacles: string;
    discoveryChanges: string;
    howStakesEscalate: string;
    charactersInvolved?: SuggestedCharacterInterface[];
    tone: string[];
    setting: string[];
}

export interface ClimaxAndFallingActionChapterAnalysis {
    scenes: SceneInterface[];
    summary: string;
    finalChallenge: string;
    challengeOutcome: string;
    storyResolution: string;
    tone: string[];
    setting: string[];
}

export interface ResolutionChapterAnalysis {
    scenes: SceneInterface[];
    summary: string;
    climaxConsequences: string;
    howCharactersEvolve: string;
    resolutionOfConflict: string;
    tone: string[];
    setting: string[];
}