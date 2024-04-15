import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RangeType } from '../models/range-type';
import { DateRange } from '../models/date-range';
import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subMonths,
    subWeeks,
    subYears,
} from 'date-fns';
import { ClickOutsideDirective } from '../directive/clickoutside.directive';

@Component({
    selector: 'date-selection',
    standalone: true,
    imports: [CommonModule, ClickOutsideDirective],
    template: `
        <div class="menu-container">
            <button (click)="opened = !opened" (clickOutside)="opened = false" class="menu">
                {{ type }}
                <img
                    width="15px"
                    src="assets/icons/chevron_down.svg"
                    alt="chevron dwon"
                />
            </button>
            @if (opened) {
                <div class="opened-menu">
                    @for (typeItem of types; track $index) {
                    <div
                        [class.selected]="type === typeItem"
                        (mousedown)="type = typeItem; setValues()"
                        class="item"
                    >
                        {{ typeItem }}
                    </div>
                    }
                </div>
            }
        </div>
        <div class="value-selector">
            <div (click)="changePosition('down')" class="arrow arrow-left">
                <img src="assets/icons/arrow_back.svg" alt="back_arrow" />
            </div>
            <div class="values">
                @for (map of values; track $index) {
                <div
                    (click)="selectValue(map[1])"
                    [class.selected]="selectedValue === map[1]"
                    class="value"
                >
                    {{ map[0] }}
                </div>
                }
            </div>
            @if (this.valuesPosition !== 0) {
            <div (click)="changePosition('up')" class="arrow arrow-right">
                <img src="assets/icons/arrow_front.svg" alt="front_arrow" />
            </div>
            }
        </div>
    `,
    styles: `
        :host {
            display: flex;
            align-items: center;

            .menu-container {
                margin-right: 10px;
                position: relative;

                .menu {
                    border: none;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    background-color: white;
                    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
                        rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
                    border-radius: 8px;
                    padding: 5px 10px;
                    cursor: pointer;
                    text-transform: capitalize;

                    img {
                        margin-left: 5px;
                    }
                }

                .opened-menu {
                    position: absolute;
                    background-color: white;
                    transform: translateY(0.4rem);
                    background-color: white;
                    padding: 5px;
                    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
                        rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
                    color: #4e4e4e;
                    z-index: 10;
                    border-radius: 8px;
                    // opacity: 0;
                    // transition: all 0.1s cubic-bezier(0.16, 1, 0.5, 1);

                    .item {
                        padding: 10px;
                        border-radius: 8px;
                        min-width: 20px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        text-transform: capitalize;

                        img {
                            margin-right: 10px;
                        }

                        &:hover {
                            background-color: rgb(231, 231, 231);
                        }
                    }

                    .selected {
                        background-color: rgba(128, 128, 128, 0.1);
                    }
                }
            }

            .value-selector {
                display: flex;
                align-items: center;
                justify-content: center;

                .values {
                    display: flex;

                    .value {
                        cursor: pointer;
                        padding: 2px 5px;
                        border-radius: 8px;

                        &:not(:first-child) {
                            margin-left: 5px;
                        }
                    }

                    .selected {
                        background-color: rgba(128, 128, 128, 0.1)
                    }
                }

                .arrow {
                    display: flex;
                    justify-content: center;
                    cursor: pointer;

                    &:first-child {
                        margin-right: 5px;
                    }

                    &:not(:first-child) {
                        margin-left: 5px;
                    }
                    
                    img {
                        width: 15px;
                        height: 15px;
                    }
                }
            }
        }
    `,
})
export class DateSelectionComponent {
    @Input() type: RangeType = RangeType.month;

    @Output() dateRange = new EventEmitter<DateRange>();
    public selectedValue: DateRange;

    public types: Array<RangeType> = Object.values(RangeType);

    public values: Map<string, DateRange> = new Map<string, DateRange>();

    public valuesPosition: number = 0;

    public opened = false;

    constructor() {
        this.setValues();
    }

    public selectValue(range: DateRange): void {
        this.selectedValue = range;
        // TODO: figure out why on init it doesn't emit on the parent's side and that we have to add a setTimeoutc for it to work
        setTimeout(() => {
            this.dateRange.emit(range);
        });
    }

    public changePosition(direction: 'up' | 'down'): void {
        if (direction === 'up') {
            this.valuesPosition -= 1;
        } else if (direction === 'down') {
            this.valuesPosition += 1;
        }

        this.setValues();
    }

    public setValues(): void {
        this.values.clear();

        switch (this.type) {
            case RangeType.month:
                this.setValuesByMonth(this.valuesPosition);
                break;
            case RangeType.week:
                this.setValuesByWeek(this.valuesPosition);
                break;
            case RangeType.year:
                this.setValuesByYear(this.valuesPosition);
                break;
        }

        this.selectValue([...this.values][2][1]);
    }

    public setValuesByMonth(position: number): void {
        const currentDate = new Date();
        const date = subMonths(currentDate, position * 3);
        const firstDay = startOfMonth(date);
        const lastDay = endOfMonth(date);

        for (let i = 2; i >= 0; i--) {
            const firstDayY = subMonths(firstDay, i);
            const lastDayY = subMonths(lastDay, i);
            this.values.set(
                `${format(firstDayY, 'LLLL')} ${format(firstDay, 'yyyy')}`,
                {
                    from: firstDayY,
                    to: lastDayY,
                }
            );
        }
    }

    public setValuesByWeek(position: number): void {
        const currentDate = new Date();
        const date = subWeeks(currentDate, position * 3);
        const firstDay = startOfWeek(date);
        const lastDay = endOfWeek(date);

        for (let i = 2; i >= 0; i--) {
            const firstDayY = subWeeks(firstDay, i);
            const lastDayY = subWeeks(lastDay, i);
            this.values.set(
                `${format(firstDayY, 'dd/MM/yyyy')} to ${format(
                    lastDayY,
                    'dd/MM/yyyy'
                )}`,
                {
                    from: firstDayY,
                    to: lastDayY,
                }
            );
        }
    }

    public setValuesByYear(position: number): void {
        const currentDate = new Date();
        const date = subYears(currentDate, position * 3);
        const firstDay = startOfYear(date);
        const lastDay = endOfYear(date);

        for (let i = 2; i >= 0; i--) {
            const firstDayY = subYears(firstDay, i);
            const lastDayY = subYears(lastDay, i);
            this.values.set(`${format(firstDayY, 'yyyy')}`, {
                from: firstDayY,
                to: lastDayY,
            });
        }
    }
}
