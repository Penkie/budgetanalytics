import { Component, OnInit } from '@angular/core';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { Transaction } from '../common/models/transaction.model';
import { endOfMonth, format, getDate, startOfMonth, sub } from 'date-fns';
import { TransactionItemComponent } from '../common/components/transaction-item.component';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [DefaultPageComponent, TransactionItemComponent],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
    public transactions: Transaction[] = [];
    // TODO: handle paging

    constructor(private pbService: PocketbaseService) {}

    public ngOnInit(): void {
        this.pbService.getTransactions().subscribe({
            next: (transactions) => {
                this.transactions = transactions;
            },
        });
    }

    public checkIfFirstDayOfMonth(date: Date): boolean {
        const dateObj = new Date(date);
        return getDate(dateObj) === 1 ? true : false;
    }

    public formatDateToMonthName(date: Date): string {
        return format(new Date(date), 'LLLL');
    }
}
