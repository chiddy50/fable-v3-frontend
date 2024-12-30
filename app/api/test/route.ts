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


import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
// import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
// import { createReactAgent } from "@langchain/langgraph/prebuilt";

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
    // try { 

    //     // Initialize the stream
    //     const encoder = new TextEncoder()
    //     const stream = new TransformStream()
    //     const writer = stream.writable.getWriter()
        
    //     // const { query } = await request.json();
    //     let query = "Write a post about the different rust array functions and their use cases and give code examples for each array function"

    //     const agentModel = new ChatGroq({
    //         apiKey: process.env.NEXT_PUBLIC_GROQ_JSONOUTPUT_API_KEY,
    //         model: "llama-3.1-70b-versatile"           
    //     });

    //     // Define the tools for the agent to use
    //     const agentTools = [new TavilySearchResults({ 
    //         maxResults: 3,
    //         apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
    //     })];

    //     // Initialize memory to persist state between graph runs
    //     const agentCheckpointer = new MemorySaver();
    //     const agent = createReactAgent({
    //         llm: agentModel,
    //         tools: agentTools,
    //         checkpointSaver: agentCheckpointer,
    //     });

    //     // Now it's time to use!
    //     const researchState = await agent.invoke(
    //         { messages: [new HumanMessage(query)] },
    //         { configurable: { thread_id: "42" } },
    //     );

    //     // Extract the research results
    //     const researchContent = researchState.messages[researchState.messages.length - 1].content;

    //     // Now create a blog post using the research data
    //     const blogPrompt = new HumanMessage(
    //     `Using the following research data as context, write a well-structured, engaging blog post about "${query}". 
    //     Make sure to include an attention-grabbing introduction, clear main points, and a conclusion.
    //     The post should be informative yet conversational in tone.
        
    //     Research Context:
    //     ${researchContent}
        
    //     Please format the blog post in markdown format.`
    //     );

    //     const blogStream = await agentModel.stream([blogPrompt]);

    //     // Handle the stream
    //     (async () => {
    //         try {
    //             for await (const chunk of blogStream) {                    
    //                 // Encode and write each chunk to the stream
    //                 await writer.write(encoder.encode(chunk.content))
    //             }
    //         } catch (error) {
    //             console.error('Streaming error:', error)
    //         } finally {
    //             await writer.close()
    //         }
    //     })()

    //     // Return the stream response
    //     return new NextResponse(stream.readable, {
    //         headers: {
    //             'Content-Type': 'text/event-stream',
    //             'Cache-Control': 'no-cache',
    //             'Connection': 'keep-alive'
    //         }
    //     })

    // } catch (error) {
    //     console.error(error);        
    //     return NextResponse.json({ error: error }, { status: 500 });        
    // }
        
}

// export async function GET(request: NextRequest) {
//     try {
//         // const tool = new WikipediaQueryRun({
//         //     topKResults: 3,
//         //     maxDocContentLength: 4000,
//         // });
        
//         // const res = await tool.invoke("Which country won the first world cup?");
//         // return NextResponse.json({ data: res });


//         // const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_GPT_API_KEY
//         // const model = new ChatOpenAI({ 
//         //     temperature: 0,
//         //     openAIApiKey,
//         //     model: "gpt-4o-mini", //"gpt-4-vision-preview",        
//         // });

//         const model = new ChatGroq({
//             apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
//             model: "llama-3.1-70b-versatile",
//             // model: "3.1-8b-instant",  // "llama3-70b-8192",
//         });

//         const tools = [
//             new SearchApi("o6UXyqGgV8LDMjNGhDBRzN2z", //process.env.NEXT_PUBLIC_SEARCHAPI_API_KEY, 
//                 { engine: "google",}),
//         ];
//             const prefix = ChatPromptTemplate.fromMessages([
//                 [
//                 "ai",
//                 "Answer the following questions as best you can. In your final answer, use a bulleted list markdown format.",
//                 ],
//                 ["human", "{input}"],
//             ]);
//             // Replace this with your actual output parser.
//             const customOutputParser = (
//                 input: BaseMessageChunk
//             ): AgentAction | AgentFinish => ({
//                 log: "test",
//                 returnValues: {
//                 output: input,
//                 },
//             });
//             // Replace this placeholder agent with your actual implementation.
//             const agent = RunnableSequence.from([prefix, model, customOutputParser]);
//             const executor = AgentExecutor.fromAgentAndTools({
//                 agent,
//                 tools,
//             });
//             const res = await executor.invoke({
//                 input: "What was the first NFT on Solana?",
//             });
//         //   console.log(res);
//         return NextResponse.json({ data: res });
        
//     } catch (error) {
//         console.error(error);        
//         return NextResponse.json({ error: error }, { status: 500 });        
//     }
        
// }
