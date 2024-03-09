import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Transaction } from '../models/transaction.model';

@Component({
    selector: 'transaction-item',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div routerLink="/transaction/{{ transaction.id }}" class="transaction">
            <div class="info-and-img">
                <div
                    class="icon"
                    [ngStyle]="{
                        'background-color': transaction.category.color
                    }"
                >
                    <img
                        width="20"
                        src="assets/category_icons/{{
                            transaction.category.icon
                        }}.fill.svg"
                        alt="{{ transaction.category.icon }}"
                    />
                </div>
                <div class="what">
                    <span class="description">{{
                        transaction.description
                    }}</span>
                    <span class="type-name">{{
                        transaction.category.name
                    }}</span>
                </div>
            </div>
            <div class="amount-and-date">
                <div
                    [ngClass]="{
                        red: transaction.amount < 0,
                        green: transaction.amount > 0
                    }"
                    class="amount"
                >
                    {{ transaction.amount }} {{ currency }}
                </div>
                <div class="date">{{ transaction.date | date }}</div>
            </div>
        </div>
    `,
    styles: `
        :host {
            .transaction {
                display: flex;
                align-items: center;
                padding: 10px;
                justify-content: space-between;
                border-radius: 8px;

                &:hover {
                    cursor: pointer;
                    background-color: rgba(128, 128, 128, 0.075);
                }

                .info-and-img {
                    display: flex;

                    .icon {
                        margin-right: 10px;
                        width: 40px;
                        height: 40px;
                        padding: 10px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 50%;
                    }

                    .what {
                        display: flex;
                        flex-direction: column;

                        .type-name {
                            font-size: 12px;
                            color: grey;
                        }

                        span {
                            display: block;
                        }
                    }
                }

                .amount-and-date {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .amount {
                    align-self: flex-end;
                }

                .date {
                    align-self: flex-end;
                    font-size: 12px;
                    color: grey;
                    margin-top: 2px;
                }
            }

            .red {
                background-color: #ff00001f;
                color: red;
                padding: 1px 6px;
                border-radius: 8px;
                width: fit-content;
            }

            .green {
                background-color: #00ff001f;
                color: green;
                padding: 1px 6px;
                border-radius: 8px;
                width: fit-content;
            }
        }
    `,
})
export class TransactionItemComponent {
    @Input() transaction: Transaction;
    @Input() currency: string = 'CHF';
}
