import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from "path";
import { Page } from "@/types/stories";
import { processImages, uploadImage } from "@/lib/test";
import axios from "axios";
import FormData from 'form-data';
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { AgentFinish, AgentAction } from "@langchain/core/agents";
import { BaseMessageChunk } from "@langchain/core/messages";
import { SearchApi } from "@langchain/community/tools/searchapi";
import { ChatGroq } from "@langchain/groq";

export async function POST(request: NextRequest) {
    const { imageUrl, dynamicJwtToken } = await request.json();

    const preset_key = process.env.CLOUDINARY_PRESET_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    try {
        const response = await fetch(imageUrl)
        const imageBlob = await response.blob();
        console.log({imageBlob});

        const formData = new FormData();
        formData.append('image', imageBlob, 'filename.jpg');

        let res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
            formData, 
            {                    
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...formData.getHeaders()
                },                
            }
        );
        console.log({res});
        
        
        return NextResponse.json({ imageBlob: imageBlob });

    } catch (error) {
        console.error('Error downloading image:', error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // const tool = new WikipediaQueryRun({
        //     topKResults: 3,
        //     maxDocContentLength: 4000,
        // });
        
        // const res = await tool.invoke("Which country won the first world cup?");
        // return NextResponse.json({ data: res });


        // const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_GPT_API_KEY
        // const model = new ChatOpenAI({ 
        //     temperature: 0,
        //     openAIApiKey,
        //     model: "gpt-4o-mini", //"gpt-4-vision-preview",        
        // });

        const model = new ChatGroq({
            apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
            model: "llama-3.1-70b-versatile",
            // model: "3.1-8b-instant",  // "llama3-70b-8192",
        });

        const tools = [
            new SearchApi("o6UXyqGgV8LDMjNGhDBRzN2z", //process.env.NEXT_PUBLIC_SEARCHAPI_API_KEY, 
                { engine: "google",}),
        ];
            const prefix = ChatPromptTemplate.fromMessages([
                [
                "ai",
                "Answer the following questions as best you can. In your final answer, use a bulleted list markdown format.",
                ],
                ["human", "{input}"],
            ]);
            // Replace this with your actual output parser.
            const customOutputParser = (
                input: BaseMessageChunk
            ): AgentAction | AgentFinish => ({
                log: "test",
                returnValues: {
                output: input,
                },
            });
            // Replace this placeholder agent with your actual implementation.
            const agent = RunnableSequence.from([prefix, model, customOutputParser]);
            const executor = AgentExecutor.fromAgentAndTools({
                agent,
                tools,
            });
            const res = await executor.invoke({
                input: "Whats advantage does Solana have over Ethereum?",
            });
        //   console.log(res);
        return NextResponse.json({ data: res });
        
    } catch (error) {
        console.error(error);        
        return NextResponse.json({ error: error }, { status: 500 });        
    }
        
}
