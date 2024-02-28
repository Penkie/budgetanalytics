import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase, { ListResult, RecordModel } from 'pocketbase';
import { Transaction } from '../models/transaction.model';
import { Observable, from, map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PocketbaseService {
    // TODO: change to env variable
    private pb = new PocketBase('https://budgetanalytics.oscarprince.ch/api');

    constructor(
      private router: Router
    ) {}

    public async authWithProvider(provider: 'google'): Promise<{ token: string }> {
        return await this.pb.collection('users').authWithOAuth2({ provider });
    }

    public canActivate(): boolean {
      if (!this.pb.authStore.isValid) {
        this.router.navigate(['auth']);
      }

      return this.pb.authStore.isValid;
    }

    // Transactions
    public getTransactions(): Observable<ListResult<Transaction>> {
      return from(this.pb.collection('transactions').getList<Transaction>(undefined, undefined, { expand: 'category'}))
        .pipe(
          tap(list => {
            list.items.map((item) => item.category = item.expand!['category'])
            return list;
          })
        );
    }
}
