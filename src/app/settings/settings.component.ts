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
}
