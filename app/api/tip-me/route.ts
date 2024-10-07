import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import axios from 'axios';


export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const params = new URLSearchParams(url.search);
        const storyId = params.get('storyId'); //question id

        // Fetch story by id
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/story-access/view/${storyId}`)
        const story = response?.data?.story;
        if (!story) {
            throw new Error("Could not find story");
        }
        
        const payload = {
            icon: story?.introductionImage ?? `https://fable-v3-frontend.vercel.app/no-image.png`,
            title: story?.projectTitle ?? "Story title",
            description: `${story?.storyStructure?.introduceProtagonistAndOrdinaryWorld.slice(0, 100)}...` ?? "Story description",
            label: story?.projectTitle ?? "Story label",
            links: {
                actions: [
                    {
                        href: `/api/tip-me`,
                        label: 'Tip me',
                        "parameters": [
                            {
                                name: "amount",
                                label: 'Enter any amount to tip', // text input placeholder
                                type: "number",
                            }
                        ],

                    }
                ]
            }
        };

        

        return new Response(JSON.stringify({
            payload
        }), {
            headers: ACTIONS_CORS_HEADERS
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error parsing request", error: error?.response?.message }), {
            headers: ACTIONS_CORS_HEADERS,
            status: 500
        });
    }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    try {

        const body: ActionPostRequest = await req.json();

        let data: any = body?.data;

        let address = process.env.WALLET_ADDRESS || "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ";
        let walletAddress = new PublicKey(address);
        const lamportsToSend = Number(0.005) * LAMPORTS_PER_SOL;

        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(body.account),
                toPubkey: walletAddress,
                lamports: lamportsToSend,
            }),
        );

        const connection = new Connection(clusterApiUrl("devnet"));
        transferTransaction.feePayer = new PublicKey(body.account);
        transferTransaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
        // const date = new Date(data?.date_time);
        // const hours = date.getHours().toString().padStart(2, '0');
        // const minutes = date.getMinutes().toString().padStart(2, '0');
        // // Format time as "HH:MM"
        // const time = `${hours}:${minutes}`

        // try {
        //     const response = await createEvent(
        //         data?.event_name,
        //         data?.description,
        //         data?.date_time,
        //         data?.location,
        //         data?.flyer_url,
        //         time,
        //         data?.payment_token,
        //         data?.payment_address,
        //         body.account,
        //         data?.fee,
        //         data?.email_address,
        //     );

        // } catch (eventError: any) {
        //     console.error('Error in createEvent:', eventError);
        //     const error: ActionError = {
        //         message: `${eventError.message}`,
        //     }
        //     return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
        // }
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type: "transaction",
                transaction: transferTransaction,
                message: "Event Created Successfully",
            },
        })

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })
    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
