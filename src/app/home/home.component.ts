import { Component, OnInit } from '@angular/core';
import { Transaction } from '../common/models/transaction.model';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEcharts } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { PocketbaseService } from '../common/services/pocketbase.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, NgxEchartsDirective],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    providers: [provideEcharts()],
})
export class HomeComponent implements OnInit {
    public transactions: Transaction[] = [];

    public month = new Date().toLocaleDateString('default', { month: 'long' });
    
    public optionPieChart!: EChartsOption;
    public optionBarChart!: EChartsOption;

    public currency: string = 'CHF';

    public totalSpent = 0;
    public totalRevenue = 0;

    // public toggleProfileMenu = false;

    constructor(
        private pbService: PocketbaseService,
        private router: Router
    ) {}

    public ngOnInit(): void {    
        this.pbService.getTransactions()
            .subscribe((res) => {
                this.transactions = res.items;

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
            });

    }

    public constructPieChartData(): Array<{ value: number; name: string }> {
        const data: Array<{ value: number; name: string }> = [];

        this.transactions.forEach((transaction) => {
            if (transaction.amount < 0) {
                const findTypeInData = data.find(
                    (e) => e.name === transaction.category.name
                );
                if (findTypeInData) {
                    findTypeInData.value += transaction.amount;
                } else {
                    data.push({
                        name: transaction.category.name,
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
        this.transactions.forEach((transaction) => {
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

    public logout(): void {
        this.pbService.logoutUser();
        this.router.navigate(['/auth']);
    }
}
