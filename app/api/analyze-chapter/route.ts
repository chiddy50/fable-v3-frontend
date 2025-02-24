import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { 
    ClimaxAndFallingActionChapterAnalysis, 
    FirstPlotPointChapterAnalysis, 
    PinchPointsAndSecondPlotPointChapterAnalysis, 
    ResolutionChapterAnalysis, 
    SuggestedOtherCharacterInterface, 
    SuggestedProtagonistInterface 
} from "@/interfaces/CreateStoryInterface";
import { StoryInterface } from '@/interfaces/StoryInterface';
import { RisingActionChapterAnalysis } from '@/interfaces/CreateStoryInterface';



interface ChapterOneAnalysis {
    protagonists: SuggestedProtagonistInterface[];
    otherCharacters: SuggestedOtherCharacterInterface[];
    tone: string[];
    genre: string[];
    summary: string;
    moodAndAtmosphere: string[];
    hooks: string[];
    setting: string[];
    thematicElement: string[];
}

interface ChapterTwoAnalysis {
    summary: string;
    charactersInvolved: SuggestedOtherCharacterInterface[];
    tone: string[];
    typeOfEvent: string;
    causeOfTheEvent: string;
    stakesAndConsequences: string;
    mysteryOrSurprise: string;
    introductionSummary: string;
    thematicElement: string[];
    suspenseTechnique: string[];
    moodAndAtmosphere: string[];
    setting: string[];
}

export async function POST(request: NextRequest) {

    try {
        const { prompt, payload, chapter } = await request.json();
        
        let parser = getParser(chapter);
        if (!parser) {
            return new NextResponse(JSON.stringify({ error: 'No valid parser found' }), { status: 400 });
        }

        const llm = new ChatGroq({
            apiKey: "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", //process.env.NEXT_PUBLIC_GROQ_JSONOUTPUT_API_KEY,
            // apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
            model: "llama3-70b-8192",         
        });
    
        const startingPrompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You are also an expert at answering any question directly even if its not related to storytelling. And you always follow instruction"],
            ["human", prompt],
        ]);
    
        let chain = startingPrompt.pipe(llm).pipe(parser);               
    
        const response = await chain.invoke(payload);
        console.log({response});
        if (!response) {
            return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });            
        }
        return NextResponse.json(response);
   
    } catch (error) {
        console.error("Error analyzing LLM response:", error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

const getParser = (chapter: number) => {
    if (chapter === 1) {            
        return new JsonOutputParser<ChapterOneAnalysis>();
    }
    if (chapter === 2) {            
        return new JsonOutputParser<ChapterTwoAnalysis>();
    }
    if (chapter === 3) {            
        return new JsonOutputParser<FirstPlotPointChapterAnalysis>();
    }
    if (chapter === 4) {            
        return new JsonOutputParser<RisingActionChapterAnalysis>();
    }  
    if (chapter === 5) {            
        return new JsonOutputParser<PinchPointsAndSecondPlotPointChapterAnalysis>();
    }  
    if (chapter === 6) {            
        return new JsonOutputParser<ClimaxAndFallingActionChapterAnalysis>();
    }    
    if (chapter === 7) {            
        return new JsonOutputParser<ResolutionChapterAnalysis>();
    }    
    
    return null;
} 