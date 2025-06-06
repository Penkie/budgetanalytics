import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase, {
    AuthModel,
    RecordListOptions
} from 'pocketbase';
import { Transaction } from '../models/transaction.model';
import { Observable, filter, from, map, of, tap } from 'rxjs';
import { Category } from '../models/category';
import { Account } from '../models/account.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProjectAccount } from '../models/project-account.model';
import { Project } from '../models/project.model';

@Injectable({
    providedIn: 'root',
})
export class PocketbaseService {
    private pb = new PocketBase(environment.apiUrl);
    private pbUrl = environment.apiUrl;

    constructor(private router: Router, private http: HttpClient) {}

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

    public saveUser(userId: string, username: string, currency: string): Observable<AuthModel> {
        return from(this.pb.collection('users').update(userId, { username, currency }));
    }

    public requestNewEmail(newEmail: string): Observable<boolean> {
        return from(this.pb.collection('users').requestEmailChange(newEmail));
    }

    public changeAvatar(userId: string, avatar: File): Observable<AuthModel> {
        return from(this.pb.collection('users').update(userId, { avatar }));
    }

    public requestPasswordChange(email: string): Observable<boolean> {
        return from(this.pb.collection('users').requestPasswordReset(email));
    }

    public getUserCurrency(): string {
        return this.getUser()!['currency'] ? this.getUser()!['currency'] : 'CHF';
    }

    public deleteUserAccount(userId: string): Observable<boolean> {
        return from(this.pb.collection('users').delete(userId));
    }

    // Transactions

    public getTransactions(
        fromDate?: string,
        toDate?: string,
        page?: number,
        categoryId?: string,
        accountId?: string,
        amount?: number,
        greaterOrLessThan?: string,
        perPage = 1500
    ): Observable<Array<Transaction>> {
        // default params
        const pbParams: RecordListOptions = {
            expand: 'category, account',
            sort: '-date',
            perPage,
        };

        // add params from method arguments
        if (fromDate && toDate) {
            pbParams.filter = this.addFilterParam(pbParams.filter || "", `date >= "${fromDate}" && date <= "${toDate}"`);
        } else if (fromDate && !toDate) {
            pbParams.filter = this.addFilterParam(pbParams.filter || "", `date >= "${fromDate}"`);
        } else if (toDate && !fromDate) {
            pbParams.filter = this.addFilterParam(pbParams.filter || "", `date <= "${toDate}"`);
        }

        if (categoryId) {
            pbParams.filter = this.addFilterParam(pbParams.filter || "", `category = "${categoryId}"`);
        }

        if (accountId) {
            pbParams.filter = this.addFilterParam(pbParams.filter || "", `account = "${accountId}"`);
        }

        if (amount && greaterOrLessThan) {
            pbParams.filter = this.addFilterParam(pbParams.filter || "", `amount ${greaterOrLessThan} ${amount}`);
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
                items.map((item) => (item.account = item.expand!['account']));
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
        category?: string;
        account: string;
        date: Date;
        user?: string;
        hidden?: boolean;
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
        account: string;
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

    // Accounts

    public getAccounts(): Observable<Account[]> {
        return from(this.pb.collection('accounts').getFullList<Account>());
    }

    public getAccountById(id: string): Observable<Account> {
        return from(this.pb.collection('accounts').getOne<Account>(id));
    }

    public createAccount(name: string, amount: number, type: string, icon: string): Observable<Account> {
        // get user
        const user = this.getUser();
        if (user) {
            return from(
                this.pb
                    .collection('accounts')
                    .create<Account>({ name, amount, icon, type, user: user['id'] })
            );
        }

        return of();
    }

    public editAccount(id: string, name: string, amount: number, type: string, icon: string): Observable<Account> {
        // get user
        const user = this.getUser();
        if (user) {
            return from(
                this.pb
                    .collection('accounts')
                    .update<Account>(id, { name, amount, icon, type, user: user['id'] })
            );
        }

        return of();
    }

    public deleteAccount(id: string): Observable<boolean> {
        return from(this.pb.collection('accounts').delete(id));
    }

    // ====== HELPERS ======

    private getAuthToken(): string {
        const obj: { token: string } = JSON.parse(localStorage.getItem('pocketbase_auth')!);
        return obj.token;
    }

    private addFilterParam(currentFilter: string, filterToAdd: string): string {
        if (currentFilter != null && currentFilter != "") {
            currentFilter += " && ";
        }

        return currentFilter += filterToAdd;
    }

    // projects

    public getUserProjectAccount(): Observable<ProjectAccount[]> {
        return from(this.pb.collection('project_account').getFullList<ProjectAccount>());
    }

    public createUserProjectAccount(accountId: string): Observable<ProjectAccount> {
        const user = this.getUser();
        if (user) {
            return from(this.pb.collection('project_account').create<ProjectAccount>({ account: accountId, user: user['id'] }));
        }

        return of();
    }

    public getUserProjects(projectAccountId: string): Observable<Project[]> {
        return from(this.pb.collection('projects').getList<Project>(1, 100, { filter: `project = ${projectAccountId}` }))
            .pipe(
                map((res) => res.items)
            );
    }

}
