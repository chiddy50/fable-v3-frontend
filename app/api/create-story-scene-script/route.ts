import { NextRequest } from "next/server";
import { RunEventType, RunOpts } from "@gptscript-ai/gptscript"
import g from "@/lib/gptScriptInstance";

const script = "app/api/create-story-scene-script/create-story-scene-script.gpt";

// - Call story-illustrator to illustrate the scene. Be sure to include the character's descriptions, setting's descriptions, and illustration style you got from the story-writer when asking story-illustrator to illustrate the scene. Use the previously downloaded character images as reference images to ensure consistency.
// - Download the illustration to a file at `${path}/${story-title}/scene<scene-number>.png`.

export async function POST(request: NextRequest) {
    const { story, pages, genre, path } = await request.json();

    // Examples CLI Command: gptscript ./story-book.gpt --story "A robot and a human become friends" --page 5 --path ./stories
    const opts: RunOpts = {
        disableCache: true,
        input: `--story ${story} --genre ${genre} --path ${path}`,
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