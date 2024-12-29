export interface UserInterface {
    id: string;
    email: string | null;
    emailVerified: string | null;
    name: string;
    bio: string | null;
    publicId: string;
    primaryWalletAddress: string | null;
    publicKey: string | null;
    depositAddress: string;
    tipLink: string | null;
    backgroundImage: string | null;
    gender?: string | null;
    averageRating: number;
    totalRatings: number;
    imageUrl: string | null;
    updatedAt: string;
    createdAt: string;
}

