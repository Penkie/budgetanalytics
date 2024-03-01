import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'category-item',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div
            [ngStyle]="{
                'background-color': color,
                color: pickTextColorBasedOnBgColor(color)
            }"
            class="category"
        >
            <div class="icon">{{ icon }}</div>
            <div class="name">{{ name }}</div>
        </div>
    `,
    styles: `
        :host {
            .category {
                padding: 10px 10px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                border: none;
                font-size: 16px;
                width: fit-content;

                .icon {
                    font-size: 24px;
                }
            }
        }
    `,
})
export class CategoryItemComponent {
    @Input() name: string;
    @Input() color: string;
    @Input() icon: string;

    public pickTextColorBasedOnBgColor(
        bgColor: string,
        lightColor = '#FFF',
        darkColor = '#000'
    ) {
        var color =
            bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
        var r = parseInt(color.substring(0, 2), 16); // hexToR
        var g = parseInt(color.substring(2, 4), 16); // hexToG
        var b = parseInt(color.substring(4, 6), 16); // hexToB
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
    }
}
