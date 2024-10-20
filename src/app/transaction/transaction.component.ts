import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { Category } from '../common/models/category';
import { CategoryItemComponent } from '../common/components/category-item.component';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { filter, switchMap, tap } from 'rxjs';
import { format } from 'date-fns';
import { Transaction } from '../common/models/transaction.model';
import { Account } from '../common/models/account.model';
import { NotificationService } from '../common/services/notification.service';
import { NotificationType } from '../common/models/notification';

@Component({
    selector: 'app-transaction',
    standalone: true,
    imports: [
        RouterModule,
        CategoryItemComponent,
        ReactiveFormsModule,
        CommonModule,
        DefaultPageComponent,
    ],
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.scss',
})
export class TransactionComponent implements OnInit {
    // what when how much
    public categories: Category[] = [];
    public accounts: Account[] = [];

    public createTransactionForm = new FormGroup({
        description: new FormControl('', Validators.required),
        amount: new FormControl(0, Validators.required),
        date: new FormControl(format(new Date(), 'yyyy-MM-dd'), Validators.required),
    });

    public selectedCategory: Category;
    public selectedAccount: Account;
    public selectedToAccount: Account;

    public submitted = false;

    public type: 'expense' | 'income' | 'transfert' = 'expense';

    public editionMode = false;
    public editingTransaction: Transaction;

    public loading = true;

    public currency: string = this.pocketbaseService.getUserCurrency();

    public transactionAmount?: number;

    constructor(
        private pocketbaseService: PocketbaseService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService
    ) {}

    public ngOnInit(): void {
        const transactionId = this.route.snapshot.paramMap.get('id');

        this.pocketbaseService.getCategories()
            .pipe(
                tap((categories) => {
                    this.selectedCategory = categories[0];
                    this.categories = categories;
                }),
                switchMap(() => this.pocketbaseService.getAccounts()),
                tap((accounts) => {
                    this.accounts = accounts;
                }),
                filter(() => transactionId !== null),
                tap(() => this.editionMode = true),
                switchMap(() => this.pocketbaseService.getTransactionById(transactionId!))
            )
            .subscribe({
                next: (transaction) => {
                    // TODO : refector this
                    this.editingTransaction = transaction;
                    const selectedCategoryObj = this.categories.find((e) => e.id === transaction.category as unknown);
                    if (selectedCategoryObj) {
                        this.selectedCategory = selectedCategoryObj;
                    }

                    // set type (expense/income)
                    if (transaction.amount > 0) {
                        this.type = 'income';
                    }

                    if (!transaction.category) {
                        this.type = 'transfert';
                    }

                    const account = this.accounts.find((account) => account.id === transaction.account as unknown);
                    if (account) {
                        /**
                         * if transaction type is transfert, select account based on the transaction amount. If it's positive,
                         * it should go to the selectedToAccount instead of the selectedAccount (representing where the money left)
                         */
                        if (this.type === 'transfert' && transaction.amount > 0) {
                            this.selectedToAccount = account;
                        } else {
                            this.selectedAccount = account;
                        }
                    }
                    
                    this.createTransactionForm.controls.amount.setValue(Math.abs(transaction.amount));
                    this.createTransactionForm.controls.date.setValue(format(new Date(transaction.date), 'yyyy-MM-dd'));
                    this.createTransactionForm.controls.description.setValue(transaction.description);
                },
                error: () => {
                    this.router.navigate(['']);
                },
                complete: () => {
                    this.loading = false;
                }
            });
    }

    public edit(): void {
        this.submitted = true;

        if (this.createTransactionForm.invalid) {
            return;
        }

        const editTransaction = {
            id: this.editingTransaction.id,
            description: this.createTransactionForm.controls.description
                .value as string,
            amount: this.createTransactionForm.controls.amount.value as number,
            date: new Date(this.createTransactionForm.controls.date.value as string),
            category: this.selectedCategory.id,
            account: this.selectedAccount.id
        }

        // negative the amount
        if (this.type === 'expense') {
            editTransaction.amount = -editTransaction.amount;
        }

        this.pocketbaseService.editTransaction(editTransaction)
            .subscribe({
                next: (transaction) => {
                    if (transaction.id) {
                        this.router.navigate(['']);
                    }
                },
                error: () => {
                    // handle error
                }
            })
    }

    public deleteTransaction(): void {
        this.pocketbaseService.deleteTransaction(this.editingTransaction.id)
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.router.navigate(['']);
                    }
                }
            });
    }

    public save(doesItReturn: boolean): void {
        if (this.type === 'transfert') {
            this.saveTransfert(doesItReturn);
            return;
        }

        this.submitted = true;

        if (this.createTransactionForm.invalid) {
            return;
        }

        const newTransaction = {
            description: this.createTransactionForm.controls.description
                .value as string,
            amount: this.createTransactionForm.controls.amount.value as number,
            date: new Date(this.createTransactionForm.controls.date.value as string),
            category: this.selectedCategory.id,
            account: this.selectedAccount.id
        };

        // negative the amount
        if (this.type === 'expense') {
            newTransaction.amount *= -1;
        }

        this.pocketbaseService.createTransaction(newTransaction).subscribe({
            next: (res) => {
                if (res && doesItReturn) {
                    this.router.navigate(['']);
                } else if (res) {
                    // success !
                    this.createTransactionForm.controls.amount.reset();
                    this.createTransactionForm.controls.description.reset();
                }
            },
            error: () => {
                // handle error
            },
        });
    }

    public saveTransfert(doesItReturn: boolean): void {
        this.submitted = true;

        if (!this.selectedAccount || !this.selectedToAccount) {
            return;
        }

        const toTransaction = {
            description: this.createTransactionForm.controls.description.value as string,
            amount: this.createTransactionForm.controls.amount.value as number,
            date: new Date(this.createTransactionForm.controls.date.value as string),
            account: this.selectedToAccount.id,
            hidden: true
        }

        const fromTransaction = {
            description: this.createTransactionForm.controls.description.value as string,
            amount: this.createTransactionForm.controls.amount.value as number,
            // category: '',
            date: new Date(this.createTransactionForm.controls.date.value as string),
            account: this.selectedAccount.id,
            hidden: true
        }
        fromTransaction.amount *= -1;

        // save two transactions
        this.pocketbaseService.createTransaction(fromTransaction).pipe(
            switchMap(() => this.pocketbaseService.createTransaction(toTransaction))
        ).subscribe({
            next: (res) => {
                if (res && doesItReturn) {
                    this.router.navigate(['']);
                } else if (res) {
                    // success !
                    this.createTransactionForm.controls.amount.reset();
                    this.createTransactionForm.controls.description.reset();
                }
            },
            error: () => {
                this.notificationService.addNotification('Something went wrong...', 5000, NotificationType.ERROR);
            }
        });
    }

    public get getRealAmount(): number {
        return this.createTransactionForm.controls.amount.value || 0;
    }
}
