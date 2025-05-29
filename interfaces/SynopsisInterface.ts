export interface CreateStorySynopsisInterface {
    description: string;
    tone: string[];
    genres: string[];
    storyAudiences: string[];
    contentType: string;
    storyType: string;
    structure: string | null;
    narrativeConcept: string;
}

export interface SynopsisListInterface {
    id: string;
    content: string;
    active: boolean;
    index: number;
}


export interface SynopsisInterface {
    id: string;
    content: string;
    active: false;
    synopsis: string;
    storyStructure: string;
    reason: string;
    narrativeConcept: string[];
    projectDescription: string;
    characters: SynopsisCharacterInterface[]
    synopsisCharacters: SynopsisCharacterInterface[]
}

export interface SynopsisCharacterInterface {
    id: string;
    name: string;
    alias: string;
    gender: string;
    race: string;
    age: string;
    role: string;
    backstory: string;
    internalConflict: string;
    externalConflict: string;
    relationshipToProtagonists: string;
    relationshipToOtherCharacters: [
        {
            id: string;
            name: string;
            relationship: string;
        }
    ];
    weaknesses: string;
    strengths: string;
    voice: string;
    perspective: string;
    uniqueHook: string;
    metaData: any;
}
