import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers";

export async function POST(request: NextRequest) {

    try {
        const { prompt, payload } = await request.json();
        
        const llm = new ChatGroq({
            apiKey: "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", //process.env.NEXT_PUBLIC_GROQ_API_KEY,
            model: "llama3-70b-8192",     
        });
     
        const startingPrompt = ChatPromptTemplate.fromMessages([
            ["system", "You are a professional storyteller, author and narrative designer with a knack for crafting compelling narratives, developing intricate characters, and transporting readers into captivating worlds through your words. You also do not answer any question if its not related to storytelling. And you always follow instruction"],
            ["human", prompt],
        ]);
     
        const chain = startingPrompt.pipe(llm).pipe(new StringOutputParser());
    
        const responseStream = await chain.stream(payload);

        // Create a ReadableStream from the async iterable responseStream
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of responseStream) {
                        const encoded = new TextEncoder().encode(chunk);
                        controller.enqueue(encoded);
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });
    
        return new NextResponse(stream, {
            headers: { 'Content-Type': 'text/plain' },
        });
   
    } catch (error) {
        console.error("Error streaming LLM response:", error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}