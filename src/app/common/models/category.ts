export interface Category {
    icon: string;
    name: string;
    color: string;

    // pb specific
    id: string;
    collectionId?: string;
    collectionName?: string;
    expand?: {
        [key: string]: any;
    };
}