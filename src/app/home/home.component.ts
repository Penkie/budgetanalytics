import { Component } from '@angular/core';
import { Transaction } from '../common/models/transaction.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    public mockTransactions: Transaction[] = [
        {
            amount: -10,
            description: 'Nails',
            type: { color: '#3480eb', icon: 'home', name: 'Home expenses' },
        },
        {
            amount: -20.5,
            description: 'Blanket',
            type: { color: '#3480eb', icon: 'home', name: 'Home expenses' },
        },
        {
            amount: -102.2,
            description: 'Cups',
            type: { color: '#3480eb', icon: 'home', name: 'Home expenses' },
        },
    ];

    public month = new Date().toLocaleDateString('default', { month: 'long' });

    public currency: string = 'CHF';
}
