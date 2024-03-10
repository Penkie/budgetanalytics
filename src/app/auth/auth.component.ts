import { Component } from '@angular/core';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../common/components/alert.component';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [ReactiveFormsModule, AlertComponent],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
})
export class AuthComponent {
    public authMode: 'signin' | 'signup' = 'signin';

    public loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });

    public submitted = false;
    public errorOnLogin = false;

    constructor(
      private pbService: PocketbaseService,
      private router: Router
    ) {}

    public async login(provider: 'google'): Promise<void> {
        const res: { token: string } = await this.pbService.authWithProvider(provider);
        if (res.token) {
          this.router.navigate(['']);
        }
    }

    public submit(type: 'register' | 'login'): void {
      this.submitted = true;

      if (!this.loginForm.valid) {
        return;
      }

      this.pbService.authWithEmail(this.loginForm.controls.email.value!, this.loginForm.controls.password.value!)
        .subscribe({
          next: () => {
            this.router.navigate(['']);
          },
          error: () => {
            this.errorOnLogin = true;
          }
        })

    }
  }
