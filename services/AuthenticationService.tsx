import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
// Adapters
import { getDefaultExternalAdapters, getInjectedAdapters } from "@web3auth/default-solana-adapter"; // All default Solana Adapters
import { SolanaPrivateKeyProvider, SolanaWallet } from "@web3auth/solana-provider";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";

const clientId = "BHrmTySBsuDsBTQEQs4pMNXNI3Vf76pU41iX_eQ4FUPzAe8JguWC4u64-libfTfJPN1YPj8nKuIVz8g6OQ_fPaw"; 

export const getUserAuthParams = async (web3auth: Web3Auth) => {
    try {
        if (!web3auth?.provider) {
            return false;
        }
        const user = await web3auth?.getUserInfo();
        console.log(user);
        const token = await web3auth?.authenticateUser(); // Get JWT token
        console.log(token);

        localStorage?.setItem("idToken", token?.idToken);

        let payload: {publicAddress?: string, appPubKey?: string, idToken: string} = { idToken: token.idToken}

        // Get user's Solana public address for wallet logins
        const solanaWallet = new SolanaWallet(web3auth?.provider);
        const address = await solanaWallet?.requestAccounts(); 
        if (Object.keys(user).length === 0) {
            console.log("WALLET AUTHENTICATION");
            console.log({address});
            payload.publicAddress = address[0];
            localStorage?.setItem("publicAddress", address[0]);
        }

        if (Object.keys(user).length > 0) {
            console.log("SOCIAL AUTHENTICATION");
            
            // get users public key for social logins
            const app_scoped_privkey: any = await web3auth?.provider?.request({
                method: "solanaPrivateKey",
            });            
            const ed25519Key = getED25519Key(Buffer.from(app_scoped_privkey?.padStart(64, "0"), "hex"));
            const app_pub_key = ed25519Key.pk.toString("hex"); 
            console.log({app_pub_key});
            payload.appPubKey = app_pub_key;
            localStorage?.setItem("appPubKey", app_pub_key);
        }

        return payload
    } catch (error) {
        console.error(error);
        return false;
    }
}

