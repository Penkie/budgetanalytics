import { Component, OnInit } from '@angular/core';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { AuthModel } from 'pocketbase';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../common/services/notification.service';
import { NotificationType } from '../common/models/notification';
import { Router } from '@angular/router';
import { ModalService } from 'ngx-modal-ease';
import { ConfirmDeleteComponent } from './modals/confirm-delete/confirm-delete.component';
import { filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DefaultPageComponent, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  public currentAvatarUrl: string = this.pb.getFiles(this.pb.getUser(), this.pb.getUser()?.['avatar']);
  public user: AuthModel = this.pb.getUser();

  public submittedSave = false;
  public userInfoFieldGroup = new FormGroup({
    username: new FormControl(this.user!['username'], Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(24), Validators.pattern('^[a-zA-Z0-9_]*$')])),
    email: new FormControl(this.user!['email'], Validators.email)
  });
  public avatarFieldGroup = new FormGroup({
    avatar: new FormControl(null)
  });
  public appFields = new FormGroup({
    currency: new FormControl(this.user!['currency'] ? this.user!['currency'] : 'CHF')
  });

  public currencyList = ['CHF', 'USD', '$', '€', 'EUR', '£', 'GBP', 'KYD', 'GIP', 'JOD']

  constructor(
    private pb: PocketbaseService,
    private notificationService: NotificationService,
    private router: Router,
    private modal: ModalService
  ) {}

  public ngOnInit(): void {
  }

  public saveUserInfo(): void {
    this.submittedSave = true;
    if (this.userInfoFieldGroup.invalid) {
      return;
    }

    // save infos
    this.saveUser();

    // request new email if changed
    if (this.userInfoFieldGroup.controls.email.dirty) {
      this.pb.requestNewEmail(this.userInfoFieldGroup.controls.email.value)
        .subscribe({
          next: () => {
            this.notificationService.addNotification('An e-mail was sent to change your e-mail', 5000, NotificationType.SUCCESS);
          },
          error: () => {
            this.notificationService.addNotification('Something went wrong while requesting e-mail change', 5000, NotificationType.ERROR);
          }
        });
    }
  }

  public uploadAvatar(event: any): void {
    const file: File = event.target.files[0];    
    if (file) {
      const formData = new FormData();
      formData.append(file.name, file);
      this.pb.changeAvatar(this.user!['id'], file)
        .subscribe({
          next: () => {
            this.currentAvatarUrl = this.pb.getFiles(this.pb.getUser(), this.pb.getUser()?.['avatar'])
            this.notificationService.addNotification('Avatar uploaded successfully', 2500, NotificationType.SUCCESS);
          },
          error: () => {
            // display error
            this.notificationService.addNotification('Something went wrong while uploading image', 5000, NotificationType.ERROR);
          }
        });
    }
  }

  public selectCurrency(): void {
    this.saveUser();
  }

  public requestPasswordChange(): void {
    this.pb.requestPasswordChange(this.user!['email'])
      .subscribe({
        next: (res: boolean) => {
          if (res) {
            this.notificationService.addNotification('An email was sent to reset your password', 5000, NotificationType.SUCCESS);
          }
        },
        error: () => {
          // display error
          this.notificationService.addNotification('Something went wrong while requesting password change', 5000, NotificationType.ERROR);
        }
      })
  }

  public saveUser(): void {
    this.pb.saveUser(this.user!['id'], this.userInfoFieldGroup.controls.username.value, this.appFields.controls.currency.value)
      .subscribe({
        next: () => {
          this.notificationService.addNotification('Settings saved successfully', 2500, NotificationType.SUCCESS);
        },
        error: () => {
          this.notificationService.addNotification('Something went wrong while saving data', 5000, NotificationType.ERROR);
        }
      });
  }

  public deleteAccount(): void {
    this.modal.open(ConfirmDeleteComponent, {
      modal: {
        enter: 'scale-rotate 0.5s ease-out',
      },
      size: {
        width: '400px'
      },
      overlay: {
        leave: 'fade-out 0.3s',
      },
    })
    .pipe(
      filter((value) => value),
      switchMap(() => {
        return this.pb.deleteUserAccount(this.user!['id']);
      })
    ).subscribe({
      next: () => {
        this.pb.logoutUser();
        this.router.navigate(['auth']);
        this.notificationService.addNotification('Account deleted successfully', 5000, NotificationType.SUCCESS);
      },
      error: () => {
        this.notificationService.addNotification('Something went wrong while delete your account', 5000, NotificationType.ERROR);
      }
    });

  }
}
