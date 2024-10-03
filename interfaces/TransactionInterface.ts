export interface TransactionInterface {
    id: string;
    storyId: string;
    userId: string;
    reference: string;
    key: string;
    unique_id: string;
    deposit_address: string;
    locale: string | null;
    mode: string | null;
    narration: string;
    confirmedAt: string | null;
    type: string;
    status: string;
    amount: string;
    currency: string;
    createdAt: string;
}