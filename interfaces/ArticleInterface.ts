import { UserInterface } from "./UserInterface";

export interface ArticleInterface {
    id: string;
    userId: string;
    title: string;
    slug: string;
    content?: Record<string, unknown> | null;
    excerpt: string;
    type: string | null;
    coverImage: string;
    likeCount: number;
    isPaid: boolean;
    paidAt: string;
    publishedAt: string;
    isFree: boolean;
    price: string;
    createdAt: string;
    updatedAt: string;
    articleTags: [];
    averageRating: number;
    user: UserInterface;
  }

