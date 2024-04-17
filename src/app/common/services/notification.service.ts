import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AppNotification, NotificationType } from "../models/notification";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {

    public notifications = new BehaviorSubject<Array<AppNotification>>([]);
    public currentNotifications: Array<AppNotification> = [];

    public addNotification(message: string, timing: number, type: NotificationType) {
        const newNotification = new AppNotification(Math.random().toString(16).slice(2), message, type);
        this.currentNotifications.push(newNotification);
        this.notifications.next(this.currentNotifications);

        setTimeout(() => {
            this.deleteNotification(newNotification);
        }, timing)
    }
    
    public deleteNotification(notification: AppNotification) {
        const findToDeleteIndex = this.currentNotifications.findIndex((e) => e.id = notification.id);
        if (findToDeleteIndex != null) {
            this.currentNotifications.splice(findToDeleteIndex, 1);
            this.notifications.next(this.currentNotifications);
        }
    }
}