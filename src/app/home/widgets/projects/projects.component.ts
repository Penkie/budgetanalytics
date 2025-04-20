import { Component, input, OnInit } from '@angular/core';
import { PocketbaseService } from '../../../common/services/pocketbase.service';
import { Account } from '../../../common/models/account.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectAccount } from '../../../common/models/project-account.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, iif, switchMap, tap } from 'rxjs';
import { Project } from '../../../common/models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  public projectAccount: ProjectAccount;
  public loading = true;

  public accounts = input<Account[]>();
  public projects: Array<Project> = [];
  
  public selectedProjectId: string;

  constructor(
    private pb: PocketbaseService
  ) {}

  public ngOnInit(): void {
    this.pb.getUserProjectAccount()
      .pipe(
        tap(projectAccount => {
          if (projectAccount.length > 0) {
            // for now, set the project to the first one. Maybe in the future a user can have multiple set of projects ? Linked to multiple accounts ?
            this.projectAccount = projectAccount[0];
          }
  
          this.loading = false;
        }),
        filter(() => !!this.projectAccount),
        switchMap(() => this.pb.getUserProjects(this.projectAccount.account))
      ).subscribe(projects => {
        this.projects = projects;
      });
  }

  public validate(): void {
    if (this.selectedProjectId) {
      this.pb.createUserProjectAccount(this.selectedProjectId)
        .subscribe(projectAccount => {
          if (projectAccount) {
            this.projectAccount = projectAccount;
          }
        });
    }
  }
}
