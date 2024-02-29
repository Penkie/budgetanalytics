import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
})
export class CategoryComponent {
    public nameModel = "";

    public availableColors = [
        '#eb4034',
        '#eb9334',
        '#5fdb32',
        '#2ad191',
        '#2a97d1',
        '#862ad1',
        '#d12aad',
    ];
    public selectedColor = '#eb4034';

    public availableIcons = ['🏠', '🛒', '🚎'];
    public selectedIcon = '🏠';

    // TODO: don't repeat this code
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
