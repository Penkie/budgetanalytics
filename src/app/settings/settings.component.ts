import { Component, OnInit } from '@angular/core';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { AuthModel } from 'pocketbase';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../common/services/notification.service';
import { NotificationType } from '../common/models/notification';

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
    username: new FormControl(this.user!['username'], Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(24)])),
    email: new FormControl(this.user!['email'], Validators.email)
  });
  public avatarFieldGroup = new FormGroup({
    avatar: new FormControl(null)
  });

  constructor(
    private pb: PocketbaseService,
    private notificationService: NotificationService
  ) {}

  public ngOnInit(): void {
    console.log(this.user);
  }

  public saveUserInfo(): void {
    this.submittedSave = true;
    if (this.userInfoFieldGroup.invalid) {
      return;
    }

    // save infos
    this.pb.saveUser(this.user!['id'], this.userInfoFieldGroup.controls.username.value)
      .subscribe({
        next: () => {
          this.notificationService.addNotification('Settings saved successfully', 2500, NotificationType.SUCCESS);
        }
      })

    // request new email if changed
    if (this.userInfoFieldGroup.controls.email.dirty) {
      this.pb.requestNewEmail(this.userInfoFieldGroup.controls.email.value)
        .subscribe({
          next: () => {
            this.notificationService.addNotification('An e-mail was sent to change your e-mail', 5000, NotificationType.SUCCESS);
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
          }
        });
    }
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
        }
      })
  }
}
