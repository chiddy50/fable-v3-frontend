import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript"
import g from "@/lib/gptScriptInstance";

// const script = "app/api/run-script/story-scenes-shots.gpt";
// const script = "app/api/run-script/story-scenes.gpt";
// const script = "app/api/run-script/story-book.gpt";
const script = "app/api/run-script/prompt.gpt"

export async function POST(request: NextRequest) {
    const { story, pages, genre, path } = await request.json();

    // Examples CLI Command: gptscript ./story-book.gpt --story "A robot and a human become friends" --page 5 --path ./stories
    const opts: RunOpts = {
        disableCache: true,
        // input: `--story ${story} --pages ${pages} --path ${path}`,
        input: `--story ${story} --pages ${pages} --genre ${genre} --path ${path}`,
    }

    try {
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const run = await g.run(script, opts)

                    run.on(RunEventType.Event, (data) => {
                        controller.enqueue(encoder.encode(
                            `event: ${JSON.stringify(data)}\n\n`
                        ));
                    });

                    await run.text();
                    controller.close();
                } catch (error) {
                    controller.error(error)
                    console.log("Error: ", error);                       
                }
            },
        });

        console.log({stream});
        
        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive"
            }
        })
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error }), {
            status: 500
        })
        
    }
}