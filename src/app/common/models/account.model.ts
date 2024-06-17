export interface Account {
    id: string;
    name: string;
    amount: number;
    type: string;
    icon: string;

    // pb specific
    collectionId?: string;
    collectionName?: string;
    expand?: {
        [key: string]: any;
    };
}