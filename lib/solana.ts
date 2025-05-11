import { PublicKey } from "@solana/web3.js"

const API_URL = process.env.NEXT_PUBLIC_VITE_ENV == "dev" ? "http://localhost:3000/api" : "https://instantpayservice.onrender.com/api"
// const network = process.env.NEXT_PUBLIC_VITE_ENV == "dev" ? "https://devnet.helius-rpc.com/?api-key=" : "https://mainnet.helius-rpc.com/?api-key="

const getTokensInUsersWallet = async (publicKey: PublicKey, network: string, API_KEY: string) => {
    const tokens = await fetchTokenAccounts(publicKey, network, API_KEY)

    const fungible = tokens.result.items.filter((item) => item.interface === "FungibleToken").map((token) => {
        const tokenInfo = token?.token_info;
        const content = token?.content?.metadata;
        const file = token?.content?.files?.[0];
        // usdBalance +=
        //   tokenInfo?.price_info?.total_price == undefined
        //     ? 0
        //     : tokenInfo?.price_info?.total_price;
        return {
            name: content?.name,
            image: token?.content?.links?.image,
            image2: file?.cdn_uri,
            symbol: content?.symbol,
            balance: tokenInfo?.balance * Math.pow(10, -tokenInfo?.decimals),
            decimals: tokenInfo?.decimals,
            usdc_price: tokenInfo?.price_info?.total_price ?? 0,
            mint: token?.id,
        };
    });

    return fungible;
}

const fetchTokenAccounts = async (publickey: PublicKey, network: string, API_KEY: string) => {
    console.log({
        url: `${(network + API_KEY.trim())}`,
        "ownerAddress": publickey.toBase58(),

    });
    
    const response = await fetch(`${(network + API_KEY.trim())}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            id: 'my-id',
            method: 'getAssetsByOwner',
            params: {
                ownerAddress: publickey.toBase58(),
                // page: 1, 
                // limit: 6,
                displayOptions: {
                    showFungible: true //return both fungible and non-fungible tokens
                }
            },
        }),
        
    });
    const data = await response.json();
    return data;
}

const getPreparedTransaction = async (publicKey: PublicKey, tokenMint: string, amount: number) => {

    const headersList = {
        "Accept": "*/*",
        "Authorization": "Bearer " + import.meta.env.VITE_INSTANT_PAY_API,
        "Content-Type": "application/json"
    }

    const bodyContent = JSON.stringify({
        "publicKey": publicKey.toString(),
        "tokenMint": tokenMint,
        "amount": amount
    });

    const response = await fetch(API_URL + "/prepare-transaction", {
        method: "POST",
        body: bodyContent,
        headers: headersList
    });

    const data = await response.json();
    return data.transaction
}

export {
    fetchTokenAccounts,
    getTokensInUsersWallet,
    getPreparedTransaction,
    API_URL,
}