import { GenreInterface } from "./GenreInterface";
import { SuspenseTechniqueInterface } from "./SuspenseTechniqueInterface";
import { ThematicOptionInterface } from "./ThematicOptionInterface";

export interface CreatePlotPayloadInterface {
    genres: GenreInterface[],
    thematicElements: string[],
    thematicOptions: ThematicOptionInterface[],
    suspenseTechnique: SuspenseTechniqueInterface ,
    suspenseTechniqueDescription: string,
    plotSuggestions: any
}



export interface ThreeActStructureInterface {
    hook: string[];
    setting: string;
    characters: Character[];
    suggestionsForHook: string[];
}

interface Character {
    name: string;
    role: string;
    values: string[];
    backstory: string[];
    strengths: string[];
    weaknesses: string[];
    motivations: string[];
    personalityTraits: string[];
}