import { Component, OnInit } from '@angular/core';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { Transaction } from '../common/models/transaction.model';
import { format } from 'date-fns';
import { TransactionItemComponent } from '../common/components/transaction-item.component';
import { ActivatedRoute } from '@angular/router';
import { FilterComponent } from "./components/filter/filter.component";

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [DefaultPageComponent, TransactionItemComponent, FilterComponent],
    templateUrl: './transactions.component.html',
    styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
    public transactions: Transaction[] = [];
    public loading = true;
    public isCompleted = false;
    private currentPage = 1;
    private perPage = 50;

    public currency: string = this.pbService.getUserCurrency();

    constructor(private pbService: PocketbaseService, private route: ActivatedRoute) {}

    public ngOnInit(): void {
       this.loadTransactions();
    }

    public loadTransactions(next?: boolean): void {
        const categoryId = this.route.snapshot.queryParamMap.get('categoryId');
        const accountId = this.route.snapshot.queryParamMap.get('accountId');

        if (next) {
            this.currentPage += 1;
        }

        this.pbService.getTransactions(undefined, undefined, this.currentPage, categoryId || undefined, accountId || undefined, this.perPage).subscribe({
            next: (transactions) => {
                this.transactions = this.transactions.concat(transactions);
                this.loading = false;

                if (transactions.length < this.perPage) {
                    this.isCompleted = true;
                }
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
