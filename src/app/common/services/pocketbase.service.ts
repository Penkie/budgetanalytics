import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase from 'pocketbase';

@Injectable({
    providedIn: 'root',
})
export class PocketbaseService {
    // TODO: change to env variable
    private pb = new PocketBase('https://budgetanalytics.oscarprince.ch/api');

    constructor(
      private router: Router
    ) {}

    public async authWithProvider(provider: 'google'): Promise<{ token: string }> {
        return await this.pb.collection('users').authWithOAuth2({ provider });
    }

    public canActivate(): boolean {
      if (!this.pb.authStore.isValid) {
        this.router.navigate(['auth']);
      }

      return this.pb.authStore.isValid;
    }
}
