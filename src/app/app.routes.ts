import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { inject } from '@angular/core';
import { PocketbaseService } from './common/services/pocketbase.service';
import { CategoryComponent } from './category/category.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account/account.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    },
    {
        path: 'auth',
        component: AuthComponent,
    },
    {
        path: 'category',
        component: CategoryComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    },
    {
        path: 'category/:id',
        component: CategoryComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    },
    {
        path: 'transaction',
        component: TransactionComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    },
    {
        path: 'transaction/:id',
        component: TransactionComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    },
    {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    },
    {
        path: 'account',
        component: AccountComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    },
    {
        path: 'account/:id',
        component: AccountComponent,
        canActivate: [() => inject(PocketbaseService).canActivate()],
    }
];
