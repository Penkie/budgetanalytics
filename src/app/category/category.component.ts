import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlertComponent } from '../common/components/alert.component';
import { Category } from '../common/models/category';
import { CategoryItemComponent } from '../common/components/category-item.component';
import { HttpClient } from '@angular/common/http';
import { DefaultPageComponent } from '../common/components/default-page.component';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AlertComponent,
        RouterModule,
        CategoryItemComponent,
        DefaultPageComponent,
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
        '#74a2a2',
        '#82929e',
        '#e5c54f',
        '#556b2f',
        '#6f4e37',
        '#672c47',
        '#1c537a',
        '#8a2be2'
    ];
    public selectedColor = '#eb4034';

    public availableIcons: Array<string> = [];
    public selectedIcon: string;

    public sendError = '';
    public editionMode = false;
    public currentCategory: Category;

    constructor(
        private pocketbaseService: PocketbaseService,
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient
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

        this.http
            .get<Array<string>>(`assets/category_icons/icons.json`)
            .subscribe({
                next: (list_icons) => {
                    this.availableIcons = list_icons;
                    this.selectedIcon = list_icons[0];
                },
            });
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
