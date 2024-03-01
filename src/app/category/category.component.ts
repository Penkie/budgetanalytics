import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertComponent } from '../common/components/alert.component';
import { Category } from '../common/models/category';
import { CategoryItemComponent } from '../common/components/category-item.component';
import { IconButtonComponent } from '../common/components/icon-button.component';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AlertComponent,
        RouterModule,
        CategoryItemComponent,
        IconButtonComponent,
    ],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
})
export class CategoryComponent implements OnInit {
    public nameModel = '';

    public availableColors = [
        '#eb4034',
        '#eb9334',
        '#5fdb32',
        '#2ad191',
        '#2a97d1',
        '#862ad1',
        '#d12aad',
    ];
    public selectedColor = '#eb4034';

    public availableIcons = ['🏠', '🛒', '🚎'];
    public selectedIcon = '🏠';

    public sendError = '';
    public editionMode = false;
    public currentCategory: Category;

    constructor(
        private pocketbaseService: PocketbaseService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    public ngOnInit(): void {
        const categoryId = this.route.snapshot.paramMap.get('id');
        if (categoryId) {
            // edit mode
            this.editionMode = true;

            // find category to edit
            this.pocketbaseService.getCategoryById(categoryId).subscribe({
                next: (category) => {
                    this.currentCategory = category;
                    this.nameModel = category.name;
                    this.selectedIcon = category.icon;
                    this.selectedColor = category.color;
                },
                error: () => {
                    this.router.navigate(['']);
                },
            });
        }
    }

    public editCategory(): void {
        if (this.nameModel === '') {
            return;
        }

        this.pocketbaseService
            .editCategory(
                this.currentCategory.id,
                this.nameModel,
                this.selectedColor,
                this.selectedIcon
            )
            .subscribe({
                next: (res) => {
                    if (res.id) {
                        // successfull, return to home page
                        this.router.navigate(['']);
                    }
                },
                error: () => {
                    this.sendError = 'Something went wrong while saving';
                },
            });
    }

    public createCategory(): void {
        if (this.nameModel === '') {
            return;
        }

        this.pocketbaseService
            .createCategory(
                this.nameModel,
                this.selectedColor,
                this.selectedIcon
            )
            .subscribe({
                next: (res) => {
                    if (res.id) {
                        // successfull, return to home page
                        this.router.navigate(['']);
                    }
                },
                error: () => {
                    this.sendError = 'Something went wrong while saving';
                },
            });
    }

    public deleteCategory(): void {
        this.pocketbaseService
            .deleteCategory(this.currentCategory.id)
            .subscribe({
                next: (val) => {
                    if (val) {
                        this.router.navigate(['']);
                    }
                },
                error: () => {
                    this.sendError = 'Error while deleting category';
                },
            });
    }
}
