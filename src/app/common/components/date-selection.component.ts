import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RangeType } from '../models/range-type';
import { DateRange } from '../models/date-range';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';

@Component({
    selector: 'date-selection',
    standalone: true,
    imports: [CommonModule],
    template: `
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

    public values: Map<string, DateRange> = new Map<string, DateRange>();

    public valuesPosition: number = 0;

    constructor() {
        this.setValues();
    }

    public selectValue(range: DateRange): void {
        this.selectedValue = range;
        this.dateRange.emit(range);
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
}
