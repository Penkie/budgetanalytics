import { Account } from './account.model';
import { Category } from './category';

export interface Transaction {
    category?: Category;
    account?: Account;
    amount: number;
    description: string;
    date: Date;
    id: string;

    // pb specific
    collectionId?: string;
    collectionName?: string;
    expand?: {
        [key: string]: any;
    };
}
