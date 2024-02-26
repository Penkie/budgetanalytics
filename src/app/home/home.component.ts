import { Component, OnInit } from '@angular/core';
import { Transaction } from '../common/models/transaction.model';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, NgxEchartsDirective],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    providers: [provideEcharts()],
})
export class HomeComponent implements OnInit {
    public mockTransactions: Transaction[] = [
        {
            amount: -10,
            description: 'Nails',
            date: new Date(),
            type: { color: '#4587e3', icon: '🏠', name: 'Home expenses' },
        },
        {
            amount: -20.5,
            description: 'Blanket',
            date: new Date(),
            type: { color: '#4587e3', icon: '🏠', name: 'Home expenses' },
        },
        {
            amount: -122,
            description: 'Selecta',
            date: new Date(),
            type: { color: '#d43d3d', icon: '🍕', name: 'Food' },
        },
        {
            amount: -102.2,
            description: 'Cups',
            date: new Date(),
            type: { color: '#4587e3', icon: '🏠', name: 'Home expenses' },
        },
        {
            amount: 1500,
            description: 'Salary',
            date: new Date(),
            type: { color: '#66f542', icon: '💰', name: 'Income' },
        },
        {
            amount: -800,
            description: 'Rent',
            date: new Date(),
            type: { color: '#4587e3', icon: '🏠', name: 'Home expenses' },
        },
    ];

    public month = new Date().toLocaleDateString('default', { month: 'long' });
    
    public optionPieChart!: EChartsOption;
    public optionBarChart!: EChartsOption;

    public currency: string = 'CHF';

    public totalSpent = 0;
    public totalRevenue = 0;

    public ngOnInit(): void {
        const chartData = this.constructPieChartData();
        this.calculateTotals();

        this.optionPieChart = {
            tooltip: {
                trigger: 'item',
                formatter: `{c} ${this.currency} ({d}%)`,
            },
            series: [
                {
                    name: 'Analytics',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    padAngle: 5,
                    itemStyle: {
                        borderRadius: 8,
                    },
                    data: chartData,
                },
            ],
        };

        this.optionBarChart = {
            xAxis: {
                type: 'category',
                data: ['Revenue', 'Spending'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [
                        {
                            value: this.totalRevenue,
                            itemStyle: {
                                color: '#24b330',
                            },
                        },
                        {
                            value: this.totalSpent,
                            itemStyle: {
                                color: '#eb4934',
                            },
                        },
                    ],
                    type: 'bar',
                },
            ],
        };
    }

    public constructPieChartData(): Array<{ value: number; name: string }> {
        const data: Array<{ value: number; name: string }> = [];

        this.mockTransactions.forEach((transaction) => {
            if (transaction.amount < 0) {
                const findTypeInData = data.find(
                    (e) => e.name === transaction.type.name
                );
                if (findTypeInData) {
                    findTypeInData.value += transaction.amount;
                } else {
                    data.push({
                        name: transaction.type.name,
                        value: transaction.amount,
                    });
                }
            }
        });

        data.forEach((element) => {
            element.value = Math.abs(element.value);
        });

        return data;
    }

    public calculateTotals(): void {
        this.mockTransactions.forEach((transaction) => {
            if (transaction.amount < 0) {
                this.totalSpent += transaction.amount;
            } else {
                this.totalRevenue += transaction.amount;
            }
        })
    }

    public round(value: number): number {
        return Math.round(value * 100) / 100;
    }
}
