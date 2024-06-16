export interface Account {
    id: string;
    name: string;
    amount: number;
    type: string;

    // pb specific
    collectionId?: string;
    collectionName?: string;
    expand?: {
        [key: string]: any;
    };
}