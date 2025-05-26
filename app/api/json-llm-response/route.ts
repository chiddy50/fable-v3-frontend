import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers";
import { JsonOutputParser } from "@langchain/core/output_parsers";
// import { 
//     ClimaxAndFallingActionChapterAnalysis, 
//     FirstPlotPointChapterAnalysis, 
//     PinchPointsAndSecondPlotPointChapterAnalysis, 
//     ResolutionChapterAnalysis, 
//     SuggestedOtherCharacterInterface, 
//     SuggestedProtagonistInterface 
// } from "@/interfaces/CreateStoryInterface";
import { StoryInterface } from '@/interfaces/StoryInterface';
// import { RisingActionChapterAnalysis } from '@/interfaces/CreateStoryInterface';
// import { SceneRequestInterface } from "@/interfaces/SceneInterface";

interface CharacterParserInterface {
    id: string;
    name: string;
    alias: string;
    race: string;
    gender: string;
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
}

interface SynopsisParserInterface {
    synopsis: string;
    storyStructure: string;
    reason: string;
    narrativeConcept: string[];
    projectDescription: string;
    characters: CharacterParserInterface[]
}

interface GenerateNarrativeConceptsParserInterface {
    narrativeConceptSuggestions: {
        title: string;
        description: string;
    };

}

// interface ChapterTwoAnalysis {
//     scenes: SceneRequestInterface[]
//     summary: string;
//     charactersInvolved: SuggestedOtherCharacterInterface[];
//     tone: string[];
//     typeOfEvent: string;
//     causeOfTheEvent: string;
//     stakesAndConsequences: string;
//     mysteryOrSurprise: string;
//     introductionSummary: string;
//     thematicElement: string[];
//     suspenseTechnique: string[];
//     moodAndAtmosphere: string[];
//     setting: string[];
// }

export async function POST(request: NextRequest) {

    try {
        const { prompt, payload, type } = await request.json();
        
        let parser = getParser(type);
        if (!parser) {
            return new NextResponse(JSON.stringify({ error: 'No valid parser found' }), { status: 400 });
        }

        const llm = new ChatGroq({
            apiKey: "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", //process.env.NEXT_PUBLIC_GROQ_JSONOUTPUT_API_KEY,
            // apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
            model: "llama3-70b-8192",         
        });

        // const model = new ChatGoogleGenerativeAI({
        //     apiKey: 'AIzaSyBPJkMmR8m06mgboCz-83bPWaawWmJp46U',
        //     model: "gemini-2.0-flash",
        //     temperature: 0,
        //     maxRetries: 2,
        // });
    
        const startingPrompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. And you always follow instruction"],
            ["human", prompt],
        ]);
    
        let chain = startingPrompt.pipe(llm).pipe(parser);               
    
        const response = await chain.invoke(payload);
        console.log(response);
        if (!response) {
            return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });            
        }
        return NextResponse.json(response);   
    } catch (error) {
        console.error("Error analyzing LLM response:", error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

const getParser = (type: string) => {
    if (type === "generate-synopsis") {
        return new JsonOutputParser<SynopsisParserInterface>();
        
    }
    if (type === "generate-narrative-concept") {            
        return new JsonOutputParser<GenerateNarrativeConceptsParserInterface>();
    }
    // if (chapter === 2) {            
    //     return new JsonOutputParser<ChapterTwoAnalysis>();
    // }
    // if (chapter === 3) {            
    //     return new JsonOutputParser<FirstPlotPointChapterAnalysis>();
    // }
    // if (chapter === 4) {            
    //     return new JsonOutputParser<RisingActionChapterAnalysis>();
    // }  
    // if (chapter === 5) {            
    //     return new JsonOutputParser<PinchPointsAndSecondPlotPointChapterAnalysis>();
    // }  
    // if (chapter === 6) {            
    //     return new JsonOutputParser<ClimaxAndFallingActionChapterAnalysis>();
    // }    
    // if (chapter === 7) {            
    //     return new JsonOutputParser<ResolutionChapterAnalysis>();
    // }    
    
    return null;
} 