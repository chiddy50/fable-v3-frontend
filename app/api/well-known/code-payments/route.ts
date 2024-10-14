import { Keypair } from "@code-wallet/keys";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextRequest) => {
    console.log(req);
    
    // Dynamically generate the verifier keypair
    // const verifier = Keypair.generate();
    const exampleGetCodePrivate = new Uint8Array([
        83, 255, 243, 143, 25, 147, 129, 161, 100, 93, 242, 14, 163, 113, 169, 47,
        214, 219, 32, 165, 210, 0, 137, 115, 42, 212, 37, 205, 193, 3, 249, 158,
      ]);
      const verifier = Keypair.fromSecretKey(exampleGetCodePrivate)

    return new Response(JSON.stringify({ 
        "public_keys": [verifier.getPublicKey().toBase58()],
        error: false, 
        message: "success" 
     }), {
        status: 200
    })
}