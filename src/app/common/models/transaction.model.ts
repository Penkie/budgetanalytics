import { Type } from "./type.model";

export interface Transaction {
    type: Type;
    amount: number;
    description: string;
}