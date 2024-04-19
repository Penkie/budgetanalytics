import { Component, OnInit } from '@angular/core';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { Transaction } from '../common/models/transaction.model';
import { endOfMonth, format, getDate, startOfMonth, sub } from 'date-fns';
import { TransactionItemComponent } from '../common/components/transaction-item.component';
import { AuthModel } from 'pocketbase';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [DefaultPageComponent, TransactionItemComponent],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
    public transactions: Transaction[] = [];
    public loading = true;
    // TODO: handle paging

    public currency: string = this.pbService.getUserCurrency();

    constructor(private pbService: PocketbaseService) {}

    public ngOnInit(): void {
        this.pbService.getTransactions().subscribe({
            next: (transactions) => {
                this.transactions = transactions;
                this.loading = false;
            },
        });
    }

    public checkIfDifferentMonthBetweenTwoDates(date1: Date, date2: Date): boolean {
        const date1Obj = new Date(date1);
        const date2Obj = new Date(date2);
        if (date1Obj.getMonth() !== date2Obj.getMonth()) {
            return true
        };
        return false;
    }

    public formatDateToMonthName(date: Date): string {
        return format(new Date(date), 'LLLL');
    }
}
