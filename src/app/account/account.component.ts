import { Component, OnInit } from '@angular/core';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../common/services/notification.service';
import { NotificationType } from '../common/models/notification';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    DefaultPageComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {

  public editionMode = false;
  public name: string;
  public amount: number;
  public type: string;
  public icon: string;
  public selectedIcon: string;
  public id?: string;
  public availableIcons: Array<string> = [
    "banknote", "pig", "credit-card"
  ];

  constructor(
    private pb: PocketbaseService,
    private router: Router,
    private route: ActivatedRoute,
    private ns: NotificationService
  ) {}

  public ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
        this.id = id;
        // edit mode
        this.editionMode = true;

        // find category to edit
        this.pb.getAccountById(id).subscribe({
            next: (account) => {
                this.name = account.name;
                this.amount = account.amount;
                this.selectedIcon = account.icon;
                this.type = account.type;
            },
            error: () => {
                this.router.navigate(['']);
            },
        });
    }
  }

  public createAccount(): void {
    this.pb.createAccount(this.name, this.amount, this.type, this.selectedIcon)
      .subscribe({
        next: () => {
          this.ns.addNotification('Account created successfully', 2000, NotificationType.SUCCESS);
          this.router.navigate(['']);
        },
        error: () => {
          this.ns.addNotification('Something went wrong when saving new account.', 2000, NotificationType.ERROR);
        }
      });
  }

  public editAccount(): void {
    console.log(this.id!);
    this.pb.editAccount(this.id!, this.name, this.amount, this.type, this.selectedIcon)
      .subscribe({
        next: () => {
          this.ns.addNotification('Account changed successfully', 2000, NotificationType.SUCCESS);
          this.router.navigate(['']);
        },
        error: () => {
          this.ns.addNotification('Something went wrong when saving account.', 2000, NotificationType.ERROR);
        }
      });
  }

  public deleteAccount(): void {
    this.pb.deleteAccount(this.id!).subscribe({
      next: () => {
        this.ns.addNotification('Account deleted successfully', 2000, NotificationType.SUCCESS);
        this.router.navigate(['']);
      },
      error: () => {
        this.ns.addNotification('Something went wrong while deleting account.', 2000, NotificationType.ERROR);
      }
    })
  }
}
