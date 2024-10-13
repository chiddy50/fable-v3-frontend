import { Keypair } from "@code-wallet/keys";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextRequest) => {
    console.log(req);
    
    // Dynamically generate the verifier keypair
    const verifier = Keypair.generate();

    return new Response(JSON.stringify({ 
        "public_keys": [verifier.getPublicKey().toBase58()],
        error: false, 
        message: "success" 
     }), {
        status: 200
    })
}