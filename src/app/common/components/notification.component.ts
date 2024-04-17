import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppNotification } from '../models/notification';

@Component({
    selector: 'notification',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [ngClass]="{
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
                background-color: #5cb85c2d;
                color: #367136;
            }

            .info {

            }
        }
    `,
})
export class NotificationComponent {

    @Input() public notification: AppNotification;
    
}
