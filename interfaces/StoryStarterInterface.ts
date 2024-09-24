import { SuspenseTechniqueInterface } from "./SuspenseTechniqueInterface";
import { ThematicOptionInterface } from "./ThematicOptionInterface";
import { Option } from '@/components/ui/multiple-selector';

export interface StoryStarterPayloadInterface {
    genre?: string;
    thematicOptions: ThematicOptionInterface[];
    thematicElements: string[];
    genres: Option[];
    suspenseTechnique: SuspenseTechniqueInterface;
    suspenseTechniqueDescription: string;
}
