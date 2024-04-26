import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'icon-button',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <button routerLink="{{ pathToUrl }}" class="btn">
            <img
                width="25"
                src="assets/icons/{{ iconName }}.svg"
                alt="icon button"
            />
        </button>
    `,
    styles: `
        :host {
            .btn {
                all: unset;
                cursor: pointer;
                border-radius: 50%;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;

                &:hover {
                    background-color: rgba(128, 128, 128, 0.075);
                }
            }
        }
    `,
})
export class IconButtonComponent {
    @Input() iconName: string;
    @Input() pathToUrl?: string;
}
