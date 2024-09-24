import { CharacterInterface } from "./CharacterInterface";
import { GenreInterface } from "./GenreInterface";
import { ThreeActStructureInterface } from "./PlotInterface";
import { SuspenseTechniqueInterface } from "./SuspenseTechniqueInterface";


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
  genres: GenreInterface[];
  imageUrl: string;
  type: string;
  slug: string;
  status: string;
  currentStepUrl: string;
  isPaid: boolean;
  paidAt: Date;

  projectTitle: string;
  projectDescription: string;

  characters: CharacterInterface[];
  
  currentStep: number;
  currentPlotStep: number;
  introductionStep: number;
  confrontationStep: number;
  resolutionStep: number;

  thematicElements: [];
  thematicOptions: [];
  suspenseTechnique: SuspenseTechniqueInterface;
  suspenseTechniqueDescription: string;
  overview?: string;
  publicId?: string | null;  // Optional unique string
  metaData?: any | null;  // Optional JSON field
  createdAt: Date | string;
  plotSuggestions: any,
  suggestedCharacters: CharacterInterface[],

  plotElement: ThreeActStructureInterface,

  storyStructure: StoryStructureInterface,
  setting: string
}