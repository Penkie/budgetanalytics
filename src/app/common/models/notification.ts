export class AppNotification {

    public id: string;
    public type: NotificationType;
    public message: string;

    constructor(id: string, message: string, type: NotificationType) {
        this.id = id;
        this.message = message;
        this.type = type;
    }
}

export enum NotificationType {
    SUCCESS, ERROR, INFO
}