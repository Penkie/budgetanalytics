import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { AppNotification } from '../models/notification';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'notification',
    standalone: true,
    imports: [CommonModule],
    animations: [
        trigger('smoothOpen', [
            state('hidden', style({
                transform: 'translateY(100%)',
                opacity: 0
            })),
            state('shown', style({
                transform: 'translateY(0%)',
                opacity: 1
            })),
            transition('hidden => shown', [
                animate('0.1s')
            ])
        ])
    ],
    template: `
        <div [@smoothOpen]="state" [ngClass]="{
                        success: notification.type === 0,
                        error: notification.type === 1,
                        info: notification.type === 2
                    }" class="notification">
            <div class="content">
                {{ notification.message }}
            </div>
        </div>
    `,
    styles: `
        :host {
            position: fixed;
            bottom: 0;
            width: 100%;

            .notification {
                padding: 15px;
                border-radius: 0 0 8px 8px;
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;

                .content {
                    max-width: 850px;
                    margin: 0 auto;
                }
            }

            .error {

            }

            .success {
                background-color: #dfebd0;
                color: #367136;
            }

            .info {

            }
        }
    `,
})
export class NotificationComponent implements AfterViewInit, OnDestroy {

    public state = 'hidden';

    @Input() public notification: AppNotification;
    
    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.state = 'shown';    
        })
    }

    public ngOnDestroy(): void {
        this.state = 'hidden';
    }
}
