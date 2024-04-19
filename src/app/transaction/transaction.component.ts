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

    public createTransactionForm = new FormGroup({
        description: new FormControl('', Validators.required),
        amount: new FormControl(0, Validators.required),
        date: new FormControl(format(new Date(), 'yyyy-MM-dd'), Validators.required),
    });

    public selectedCategory: Category;

    public submitted = false;

    public type: 'expense' | 'income' = 'expense';

    public editionMode = false;
    public editingTransaction: Transaction;

    public loading = true;

    public currency: string = this.pocketbaseService.getUserCurrency();

    constructor(
        private pocketbaseService: PocketbaseService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    public ngOnInit(): void {
        const transactionId = this.route.snapshot.paramMap.get('id');

        this.pocketbaseService.getCategories()
            .pipe(
                tap((categories) => {
                    this.selectedCategory = categories[0];
                    this.categories = categories;
                }),
                filter(() => transactionId !== null),
                tap(() => this.editionMode = true),
                switchMap(() => this.pocketbaseService.getTransactionById(transactionId!))
            )
            .subscribe({
                next: (transaction) => {
                    // TODO : refector this
                    this.editingTransaction = transaction;
                    const selectedCategoryObj = this.categories.find((e) => e.id === transaction.category as unknown as string);
                    if (selectedCategoryObj) {
                        this.selectedCategory = selectedCategoryObj;
                    }

                    // set type (expense/income)
                    if (transaction.amount > 0) {
                        this.type = 'income';
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
        };

        // negative the amount
        if (this.type === 'expense') {
            newTransaction.amount = -newTransaction.amount;
        }

        this.pocketbaseService.createTransaction(newTransaction).subscribe({
            next: (res) => {
                if (res.id && doesItReturn) {
                    this.router.navigate(['']);
                } else if (res.id) {
                    // success !
                    this.createTransactionForm.reset();
                }
            },
            error: () => {
                // handle error
            },
        });
    }
}
