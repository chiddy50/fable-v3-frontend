import { Option } from "@/components/ui/multiple-selector";

export interface ProtagonistInterface {
    name: string;
    backstory: string;
    checked: boolean;
    // Add other properties of your protagonist object here
}

export interface ProtagonistCharacteristicsInterface {
    name: string;
    strengthsSuggestions: Option[];
    weaknessesSuggestions: Option[];
    skillsSuggestions: Option[];
    personalityTraitsSuggestions: Option[];
    motivationsSuggestions: Option[];
  }