import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase, {
    AuthModel,
    ListResult,
    RecordListOptions,
    RecordModel,
} from 'pocketbase';
import { Transaction } from '../models/transaction.model';
import { Observable, from, map, of, tap } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
    providedIn: 'root',
})
export class PocketbaseService {
    // TODO: change to env variable
    private pb = new PocketBase('https://api.ba.oscarprince.ch');

    constructor(private router: Router) {}

    // utils

    public getFiles(property: any, file: any): any {
        return this.pb.files.getUrl(property, file);
    }

    // auth

    public async authWithProvider(
        provider: 'google'
    ): Promise<{ token: string }> {
        return await this.pb.collection('users').authWithOAuth2({ provider });
    }

    public authWithEmail(email: string, password: string): Observable<unknown> {
        return from(this.pb.collection('users').authWithPassword(email, password));
    }

    public registerWithEmail(email: string, password: string, passwordConfirm: string): Observable<unknown> {
        return from(this.pb.collection('users').create({ email, password, passwordConfirm }));
    }

    // auth guard

    public canActivate(): boolean {
        if (!this.pb.authStore.isValid) {
            this.router.navigate(['auth']);
        }

        return this.pb.authStore.isValid;
    }

    // user profile

    public getUser(): AuthModel {
        return this.pb.authStore.model;
    }

    public logoutUser(): void {
        return this.pb.authStore.clear();
    }

    // Transactions

    public getTransactions(
        fromDate?: string,
        toDate?: string,
        page?: number,
        perPage = 50
    ): Observable<Array<Transaction>> {
        // default params
        const pbParams: RecordListOptions = {
            expand: 'category',
            sort: '-date',
            perPage,
        };

        // add params from method arguments
        if (fromDate && toDate) {
            pbParams.filter = `date >= "${fromDate}" && date <= "${toDate}"`;
        }

        if (page) {
            pbParams.page = page;
        }

        return from(
            this.pb
                .collection('transactions')
                .getList<Transaction>(undefined, undefined, pbParams)
        ).pipe(
            map((list) => list.items),
            tap((items) => {
                // TODO: remove !
                items.map((item) => (item.category = item.expand!['category']));
                return items;
            })
        );
    }

    public getTransactionById(id: string): Observable<Transaction> {
        return from(this.pb.collection('transactions').getOne<Transaction>(id));
    }

    public createTransaction(data: {
        description: string;
        amount: number;
        category: string;
        date: Date;
        user?: string;
    }): Observable<Transaction> {
        const user = this.getUser();
        if (user) {
            data.user = user['id'];
            return from(
                this.pb.collection('transactions').create<Transaction>(data)
            );
        }
        return of();
    }

    public editTransaction(data: {
        id: string,
        description: string;
        amount: number;
        category: string;
        date: Date;
        user?: string;
    }): Observable<Transaction> {
        const user = this.getUser();
        if (user) {
            data.user = user['id'];
            return from(
                this.pb.collection('transactions').update<Transaction>(data.id, data)
            );
        }
        return of();
    }

    public deleteTransaction(id: string): Observable<boolean> {
        return from(this.pb.collection('transactions').delete(id));
    }

    // Categories

    public getCategories(): Observable<Array<Category>> {
        return from(this.pb.collection('categories').getList<Category>()).pipe(
            map((list) => list.items)
        );
    }

    public getCategoryById(id: string): Observable<Category> {
        return from(this.pb.collection('categories').getOne<Category>(id));
    }

    public createCategory(
        name: string,
        color: string,
        icon: string
    ): Observable<Category> {
        // get user
        const user = this.getUser();
        if (user) {
            return from(
                this.pb
                    .collection('categories')
                    .create<Category>({ name, color, icon, user: user['id'] })
            );
        }

        return of();
    }

    public editCategory(
        id: string,
        name: string,
        color: string,
        icon: string
    ): Observable<Category> {
        const user = this.getUser();
        if (user) {
            return from(
                this.pb.collection('categories').update<Category>(id, {
                    name,
                    color,
                    icon,
                    user: user['id'],
                })
            );
        }

        return of();
    }

    public deleteCategory(id: string): Observable<boolean> {
        return from(this.pb.collection('categories').delete(id));
    }
}
