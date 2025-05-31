import { ChapterInterface } from "./ChapterInterface";
import { CharacterInterface, SuggestedCharacterInterface } from "./CharacterInterface";
import { GenreInterface } from "./GenreInterface";
import { SynopsisInterface, SynopsisListInterface } from "./SynopsisInterface";
import { UserInterface } from "./UserInterface";


export interface SuggestionItem {
  label: string;
  value: string;
  description?: string;
}

export interface StoryStructureInterface {
  id: string;
  storyId: string;

  protagonists: CharacterInterface[];
  protagonistSuggestions: CharacterInterface[];

  protagonistGoal: { whatTheyWant: string, whoHasIt: string };
  protagonistGoalSuggestions:      [];

  settingSuggestions: string[];

  whoDoesNotHaveProtagonistGoal: string;
  whoDoesNotHaveProtagonistGoalSuggestions: string[];

  protagonistGoalObstacle: [];
  protagonistGoalObstacleSuggestions: [];

  protagonistWeaknessStrengthSuggestions: [];
  
  exposition: string[];
  expositionSuggestions: string[];
  expositionCharacters: CharacterInterface[]
  expositionSummary: string;

  introductionTone: string[];
  introductionToneSuggestions: string[];
  introductionStakes: string[];
  introductionStakesSuggestions: string[];
  
  // STORY GENERATION ELEMENTS START
  introduceProtagonistAndOrdinaryWorld:  string;
  incitingIncident:            string;
  firstPlotPoint:  string;
  risingActionAndMidpoint: string;
  pinchPointsAndSecondPlotPoint: string;
  climaxAndFallingAction:  string;
  resolution:  string;
  
  introductionSummary: string;
  incitingIncidentSummary: string;
  firstPlotPointSummary:  string;
  risingActionAndMidpointSummary: string;
  pinchPointsAndSecondPlotPointSummary: string;
  climaxAndFallingActionSummary:  string;
  resolutionSummary:  string;

  antagonists: CharacterInterface[];
  antagonistSuggestions: CharacterInterface[];
  antagonisticForce: string[];

  hook: string[];
  hookSuggestions: string[];
  hookSummary: string;
  hookCharacters: CharacterInterface[]

  incitingEvent: string[];
  incitingEventSuggestions: string[];
  incitingEventSummary: string;
  incitingEventCharacters: CharacterInterface[]

  protagonistOrdinaryWorld: string[];
  protagonistOrdinaryWorldSuggestions: string[];
  protagonistOrdinaryWorldSummary: string[];

  // firstPlotPoint: string[];
  firstPlotPointSuggestions: string[];

  progressiveComplication: string[];
  progressiveComplicationSuggestions: string[];
  progressiveComplicationSummary: string;

  firstPinchPoint: string[];
  firstPinchPointSuggestions: string[];

  midpoint: string[];
  midpointSuggestions: string[];
  secondPinchPoint: string[];
  secondPinchPointSuggestions: string[];
  thirdPlotPoint: string[];
  thirdPlotPointSuggestions: string[];
  climax: string[];
  climaxSuggestions: string[];
}


export interface StoryInterface {
  id: string;
  userId: string;
  title: string;
  genre: string;
  genres: string[];
  tone: string[];
  contentType: string;
  synopsis: string;
  synopsisList: SynopsisInterface[];
  synopses: SynopsisInterface[];
  storyStructureReason: string;
  narrativeConceptSuggestions: NarrativeConceptInterface[];
  narrativeConcept: NarrativeConceptInterface;

  // genres: GenreInterface[];
  imageUrl: string;
  type: string;
  slug: string;
  status: string;
  currentStepUrl: string;
  isPaid: boolean;
  paidAt: Date;
  isFree: boolean;
  price: number | null;
  autoDetectStructure: boolean;
  structure: string;
  storyType: string;
  applyFeeToAllChapters: boolean;
  generalChapterFee: number | string;
  currentChapterId: string;

  bannerImageUrl: string;
  coverImageUrl: string;

  chapters: ChapterInterface[];

  introductionTone: GenreInterface[];
  introductionSetting:GenreInterface[];
  protagonistSuggestions: [];
  suggestedCharacters: SuggestedCharacterInterface[],

  projectTitle: string;
  projectDescription: string;

  characters: CharacterInterface[];
  
  currentStep: number;
  currentPlotStep: number;
  introductionStep: number;
  confrontationStep: number;
  resolutionStep: number;
  
  writingStep: number;
  introductionLocked: boolean;

  introductionExtraDetails: string;


  thematicElements: [];
  thematicOptions: [];
//   suspenseTechnique: SuspenseTechniqueInterface;
  suspenseTechniqueDescription: string;
  overview?: string;
  publicId?: string | null;  // Optional unique string
  metaData?: any | null;  // Optional JSON field
  createdAt: string;
  publishedAt: string;
  plotSuggestions: any;

  _count?: {
    comments?: number;
  }

  // plotElement: ThreeActStructureInterface,

  setting: string;

  storyAudiences: TargetAudienceInterface[];  
  storyGenres: StoryGenreInterface[];
  user: UserInterface;
  comments: CommentInterface[];
}

export interface TargetAudienceInterface {
  id: string;
  storyId: string;
  targetAudienceId: string;
  publicId: string | null;
  updatedAt: string;
  createdAt: string;
  targetAudience: {
    id: string;
    name: string;
    description: string|null,
    publicId: string;
}
} 

export interface StoryGenreInterface {
  id: string;
  storyId: string;
  storyGenreId: number;
  updatedAt: string;
  createdAt: string;
  storyGenre: {
    id: number;
    name: string;
    description: string| null;
  }
} 


export interface CommentInterface {
  id: string;
  content: string;
  storyId: string;
  userId: string;
  parentId: string;
  likeCount: number;
  dislikeCount: number;
  isEdited: boolean;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface NarrativeConceptInterface { 
  title: string; 
  description: string; 
}