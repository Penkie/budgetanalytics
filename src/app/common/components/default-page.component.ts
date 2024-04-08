import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconButtonComponent } from './icon-button.component';

@Component({
    selector: 'default-page',
    standalone: true,
    imports: [CommonModule, RouterModule, IconButtonComponent],
    template: `
        <div class="heading">
            <span class="title">{{ title }}</span>
        </div>
        <div class="back-container">
            <icon-button
                iconName="arrow_back"
                pathToUrl="{{ goBackPathUrl }}"
            ></icon-button>
        </div>
        <div class="box">
            <ng-content />
        </div>
    `,
    styles: `
        :host {
            animation: fadeInScroll 0.3s cubic-bezier(.42,.83,.31,1.28);
            max-width: 850px;
            margin: 0 auto;
            display: block;
            padding-bottom: 20px;

            .heading {
                text-align: center;
                margin: 25px 0;

                .title {
                    font-family: "Sentient-Variable";
                    font-size: large;
                }
            }

            .back-btn {
                all: unset;
                cursor: pointer;
                border-radius: 50%;
                padding: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 5px;

                &:hover {
                    background-color: rgba(128, 128, 128, 0.075);
                }
            }

            .box {
                border-radius: 8px;
                background-color: white;
                height: fit-content;
                width: fit-content;
                width: 100%;
                box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
                    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
                padding: 20px;
            }
        }
    `,
})
export class DefaultPageComponent {
    @Input() title: string;
    @Input() goBackPathUrl: string;
}
