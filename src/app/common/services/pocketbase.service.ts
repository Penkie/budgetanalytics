import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase, { AuthModel, ListResult, RecordModel } from 'pocketbase';
import { Transaction } from '../models/transaction.model';
import { Observable, from, map, of, tap } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
    providedIn: 'root',
})
export class PocketbaseService {
    // TODO: change to env variable
    private pb = new PocketBase('https://budgetanalytics.oscarprince.ch/api');

    constructor(private router: Router) {}

    public async authWithProvider(
        provider: 'google'
    ): Promise<{ token: string }> {
        return await this.pb.collection('users').authWithOAuth2({ provider });
    }

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

    public getTransactions(): Observable<Array<Transaction>> {
        return from(
            this.pb
                .collection('transactions')
                .getList<Transaction>(undefined, undefined, {
                    expand: 'category',
                })
        ).pipe(
            map((list) => list.items),
            tap((items) => {
                // TODO: remove !
                items.map((item) => (item.category = item.expand!['category']));
                return items;
            })
        );
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
