import { Component, OnInit } from '@angular/core';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { AuthModel } from 'pocketbase';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
  public infoFields = new FormGroup({
    username: new FormControl(this.user!['username'], Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(24)])),
    email: new FormControl(this.user!['email'], Validators.email)
  });
  public avatarFieldGroup = new FormGroup({
    avatar: new FormControl(null)
  });

  constructor(
    private pb: PocketbaseService
  ) {}

  public ngOnInit(): void {
    console.log(this.user);
  }

  public saveUserInfo(): void {
    this.submittedSave = true;
    if (this.infoFields.invalid) {
      return;
    }

    // save infos
    this.pb.saveUser(this.user!['id'], this.infoFields.controls.username.value)

    // request new email if changed
    if (this.infoFields.controls.email.dirty) {
      this.pb.requestNewEmail(this.infoFields.controls.email.value);
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
          },
          error: () => {
            // display error
          }
        });
    }
  }
}
