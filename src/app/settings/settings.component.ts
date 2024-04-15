import { Component, OnInit } from '@angular/core';
import { DefaultPageComponent } from '../common/components/default-page.component';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { AuthModel } from 'pocketbase';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [DefaultPageComponent, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  public currentAvatarUrl: string = this.pb.getFiles(this.pb.getUser(), this.pb.getUser()?.['avatar']);
  public user: AuthModel = this.pb.getUser();

  constructor(
    private pb: PocketbaseService
  ) {}

  public ngOnInit(): void {
    console.log(this.user);
  }
}
