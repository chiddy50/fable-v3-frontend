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
            icon: story?.introductionImage ?? `https://usefable.xyz/no-image.png`,
            title: story?.projectTitle ?? "Story title",
            description: `${story?.overview.slice(0, 200)}...\n\n https://tipcard.getcode.com/X/ii_am_chidi` ?? "Story description",
            label: story?.projectTitle ?? "Story label",
            links: {
                actions: [
                    {
                        href: `/api/tip-me?storyId=${story?.id}`,
                        label: 'Tip me',
                        "parameters": [
                            {
                                name: "amount",
                                label: 'Enter any amount of SOL to tip', // text input placeholder
                                type: "number",
                            }
                        ],

                    }
                ]
            }
        };

        return new Response(JSON.stringify(payload), {
            headers: ACTIONS_CORS_HEADERS
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error?.response?.message, error: error?.response?.message }), {
            headers: ACTIONS_CORS_HEADERS,
            status: 500
        });
    }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);
    const storyId = params.get('storyId');

    if (!storyId) throw new Error("Could not find story id");

    try {

        // Get story
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/story-access/view/${storyId}`)
        
        
        const story = response?.data?.story;
        if (!story) throw new Error("Could not find story");
        
        const writerAddress = story?.user?.primaryWalletAddress;
        
        const body: ActionPostRequest = await req.json();
        
        let senderAddress = body?.account;
        let data: any = body?.data;
        let amount: any = data.amount;
        
        const lamportsToSend = Number(amount) * LAMPORTS_PER_SOL;
        
        const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(senderAddress),
                toPubkey: new PublicKey(writerAddress),
                lamports: lamportsToSend,
            }),
        );
        
        const connection = new Connection(clusterApiUrl("devnet"));
        transferTransaction.feePayer = new PublicKey(body.account);
        transferTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
     
       
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type: "transaction",
                transaction: transferTransaction,
                message: "Creator Successfully Tipped",
            },
        })

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })
    } catch (e: any) {
        console.log(e);        
        const error: ActionError = {
            message: `${e?.response?.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
