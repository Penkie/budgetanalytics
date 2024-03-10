import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: 'alert',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div [ngClass]="type" class="alert">
            <img width="25" [src]="type === 'error' ? 'assets/icons/warning.svg' : 'assets/icons/check.svg'" alt="warning">
            {{ message }}
        </div>
    `,
    styles: `
        :host {
            .alert {
                padding: 10px 20px;
                border-radius: 8px;
                width: fit-content;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    margin-right: 5px;
                }
            }

            .error {
                background-color: rgba(255, 0, 0, 0.189);
            }

            .success {
                background-color: rgba(63, 199, 32, 0.189);
            }
        }
    `
})
export class AlertComponent {

    @Input() type: 'error' | 'success';
    @Input() message: string;
}
