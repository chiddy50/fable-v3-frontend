
// Character relationship to protagonist
interface RelationshipToProtagonist {
    relationship: string;
    protagonistName: string;
}

// Character in the story
export interface Character {
    id: string;
    age: string;
    name: string;
    role: string;
    angst: string;
    gender: string;
    habits: string;
    height: string;
    skills: string[];
    weight: string;
    skinTone: string;
    backstory: string;
    hairQuirk: string;
    strengths: string[];
    coreValues: string[];
    facialHair: string;
    hairLength: string;
    weaknesses: string[];
    hairTexture: string;
    motivations: string[];
    innerConflict: string;
    speechPattern: string;
    facialFeatures: string;
    antagonistForce: string;
    characterTraits: string[];
    clothDescription: string;
    relevanceToAudience: string;
    relationshipToOtherProtagonist?: null;
    relationshipToProtagonists?: RelationshipToProtagonist[];
}

// Character involved in a scene
interface SceneCharacter {
    name: string;
    roleInScene: string;
    relationshipToProtagonist: string;
}

// Scene in a chapter
export interface SceneInterface {
    id: string;
    storyId: string;
    chapterId: string;
    imageUrl: string | null;
    title: string;
    setting: string | null;
    externalVideoUrl: string | null;
    videoUrl: string | null;
    charactersInvolved: SceneCharacter[];
    content: string;
    order: number;
    createdAt: string;
}

// Chapter in a story
export interface ChapterInterface {
    id: string;
    storyId: string;
    index: number;
    readersHasAccess: boolean;
    title: string | null;
    description: string | null;
    duration: string | null;
    characters: Character[];
    isFree: boolean;
    content: string;
    image: string | null;
    paywall: boolean;
    status: string | null;
    publishedAt: string | null;
    releaseDate: string | null;
    updatedAt: string;
    createdAt: string;
    scenes: SceneInterface[];
}