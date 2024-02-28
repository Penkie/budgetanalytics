import { Component } from '@angular/core';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
})
export class AuthComponent {
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
}
