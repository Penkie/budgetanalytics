import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './common/services/notification.service';
import { NotificationComponent } from './common/components/notification.component';
import { AppNotification } from './common/models/notification';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NotificationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    animations: [
        trigger('inOutAnimation',
        [
            transition(
            ':enter', 
            [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('0.1s ease-out', 
                        style({ transform: 'translateY(0%)', opacity: 1 }))
            ]
            ),
            transition(
            ':leave', 
            [
                style({ transform: 'translateY(0%)', opacity: 1 }),
                animate('0.1s ease-in', 
                        style({ transform: 'translateY(100%)', opacity: 0 }))
            ]
            )
        ])
    ]
})
export class AppComponent implements OnInit {

    public notifications: Array<AppNotification>;
    
    constructor(
        private notificationService: NotificationService
    ) {}

    public ngOnInit(): void {
        // this.notificationService.addNotification('test notification', 100000, NotificationType.SUCCESS);
        this.notificationService.notifications.subscribe(notification => {
            this.notifications = notification;
        });
    }
}
