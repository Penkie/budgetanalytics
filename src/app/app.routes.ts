import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { inject } from '@angular/core';
import { PocketbaseService } from './common/services/pocketbase.service';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()]
    },
    {
        path: 'auth',
        component: AuthComponent,
    }
];
