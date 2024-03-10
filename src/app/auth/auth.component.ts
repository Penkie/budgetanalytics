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

    public registerForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      repeatPassword: new FormControl('', Validators.required)
    });

    public submitted = false;
    public errorOnLogin = false;

    public errorOnRegister = '';
    public registerSuccess = false;

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

    public submitLogin(): void {
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
            this.submitted = false;
          }
        })

    }

    public submitRegister(): void {
      this.submitted = true;

      if (!this.registerForm.valid) {
        return;
      }

      this.pbService.registerWithEmail(this.registerForm.controls.email.value!, this.registerForm.controls.password.value!, this.registerForm.controls.repeatPassword.value!)
        .subscribe({
          next: () => {
            this.authMode = 'signin';
            this.registerSuccess = true;
          },
          error: (err) => {
            if (err.response && err.response.data && err.response.data.email && err.response.data.email.code === 'validation_invalid_email') {
              this.errorOnRegister = 'Invalid email or email already in use';
            } else if (err.response && err.response.data && err.response.data.passwordConfirm && err.response.data.passwordConfirm.code === 'validation_values_mismatch') {
              this.errorOnRegister = 'Passwords values don\'t match';
            } else {
              this.errorOnRegister = 'Something went wrong while creating the account';
            }
          }
        })
    }
  }
