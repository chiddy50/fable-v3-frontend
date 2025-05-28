interface StoryGenre {
  storyGenre: {
    id: number;
    name: string;
    description: string | null;
  };
}

interface TargetAudience {
  targetAudience: {
    id: string;
    name: string;
    publicId: string;
    createdAt: string;
    updatedAt: string;
    description: string | null;
  };
}

interface Character {
  id: string;
  age: string;
  name: string;
  race: string;
  role: string;
  alias: string;
  voice: string;
  gender: string;
  backstory: string;
  strengths: string;
  weaknesses: string;
  perspective: string;
  externalConflict: string;
  internalConflict: string;
  relationshipToProtagonists: string;
  relationshipToOtherCharacters: Array<{
    id: string;
    name: string;
    relationship: string;
  }>;
}

interface NarrativeConcept {
  title: string;
  description: string;
}

export interface GenerateCharacterInterface {
  id: string;
  storyStructure: string;
  tone: string[];
  characterRole: string;
  genres: StoryGenre[];
  content: string;
  characters: Character[];
  contentType: string;
  storyAudiences: TargetAudience[];
  narrativeConcept: NarrativeConcept;
}
