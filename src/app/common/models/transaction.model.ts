import { Category } from './category';

export interface Transaction {
    category: Category;
    amount: number;
    description: string;
    date: Date;

    // pb specific
    collectionId?: string;
    collectionName?: string;
    expand?: {
        [key: string]: any;
    };
}
