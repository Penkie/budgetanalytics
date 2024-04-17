import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './common/services/notification.service';
import { NotificationComponent } from './common/components/notification.component';
import { AppNotification, NotificationType } from './common/models/notification';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NotificationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
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
