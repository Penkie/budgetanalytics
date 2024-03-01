import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { Category } from '../common/models/category';
import { CategoryItemComponent } from '../common/components/category-item.component';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-transaction',
    standalone: true,
    imports: [
        RouterModule,
        CategoryItemComponent,
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: './transaction.component.html',
    styleUrl: './transaction.component.scss',
})
export class TransactionComponent implements OnInit {
    // what when how much
    public categories: Category[] = [];

    public createTransactionForm = new FormGroup({
        description: new FormControl('', Validators.required),
        amount: new FormControl(-1, Validators.required),
        date: new FormControl(new Date(), Validators.required),
    });

    public selectedCategory: Category;

    public submitted = false;

    constructor(
        private pocketbaseService: PocketbaseService,
        private router: Router
    ) {}

    public ngOnInit(): void {
        this.pocketbaseService.getCategories().subscribe({
            next: (categories) => {
                this.selectedCategory = categories[0];
                this.categories = categories;
            },
        });
    }

    public save(doesItReturn: boolean): void {
        this.submitted = true;

        if (this.createTransactionForm.invalid) {
            return;
        }

        // negative the amount

        const newTransaction = {
            description: this.createTransactionForm.controls.description
                .value as string,
            amount: this.createTransactionForm.controls.amount.value as number,
            date: this.createTransactionForm.controls.date.value as Date,
            category: this.selectedCategory.id,
        };

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
