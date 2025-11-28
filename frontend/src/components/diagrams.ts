import { ApiUtils } from "../utils/api-utils";

declare const Chart: any;

export interface Operation {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    date: string;
    comment: string;
    category?: string;
    category_income_id?: number;
    category_expense_id?: number;
}

export interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        borderWidth: number;
    }[];
}

export interface FilterParams {
    period?: string;
    dateFrom?: string;
    dateTo?: string;
}


export class Diagrams {
    private incomeChart: any = null;
    private expenseChart: any = null;
    private incomeChartData: ChartData | null = null;
    private expenseChartData: ChartData | null = null;
    private currentOperations: Operation[] = [];

    constructor() {
        this.init();
    }

    async init(): Promise<void> {
        await this.loadData();
        this.createCharts();
    }

    async loadData(): Promise<void> {
        try {
            const operations: Operation[] = await ApiUtils.request('GET', '/operations');
            this.prepareChartData(operations);
        } catch (error) {
            console.error('Ошибка загрузки данных для диаграмм:', error);
            this.prepareChartData([]);
        }
    }

    prepareChartData(operations: Operation[]): void {
        const incomeOperations = operations.filter((op: Operation) => op.type === 'income');
        const expenseOperations = operations.filter((op: Operation) => op.type === 'expense');

        // console.log('Доходы:', incomeOperations.length, 'Расходы:', expenseOperations.length);

        const incomeData = this.groupByCategory(incomeOperations);
        const expenseData = this.groupByCategory(expenseOperations);

        // console.log('Группировка доходов:', incomeData);
        // console.log('Группировка расходов:', expenseData);

        this.incomeChartData = this.formatChartData(incomeData);
        this.expenseChartData = this.formatChartData(expenseData);
    }

    groupByCategory(operations: Operation[]): Record<string, number> {
        const groups: Record<string, number> = {};

        operations.forEach(operation => {
            const category = operation.category || 'Без категории';
            if (!groups[category]) {
                groups[category] = 0;
            }
            groups[category] += operation.amount;
        });

        return groups;
    }

    formatChartData(data: Record<string, number>): ChartData {
        const categories = Object.keys(data);
        const amounts = Object.values(data);
        const backgroundColors = this.generateColors(categories.length);

        return {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderWidth: 1
            }]
        };
    }

    generateColors(count: number): string[] {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
            '#7CFFB2', '#F465C3', '#8AE6FF', '#FFD166'
        ];
        return colors.slice(0, count);
    }

    createCharts(): void {
        if (typeof Chart === 'undefined') {
            return;
        }

        if (this.incomeChart) this.incomeChart.destroy();
        if (this.expenseChart) this.expenseChart.destroy();

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top' as const,
                    labels: {
                        boxWidth: 16,
                        boxHeight: 16,
                        usePointStyle: false,
                        font: {
                            size: 14,
                            family: 'Arial, sans-serif',
                            weight: 'normal' as const
                        },
                        color: '#000000',
                        padding: 8,
                        generateLabels: (chart: any) => {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label: string, i: number) => ({
                                    text: label,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].backgroundColor[i],
                                    lineWidth: 0,
                                    hidden: false,
                                    index: i
                                }));
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function (context: any) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value}$ (${percentage}%)`;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: -10,
                    bottom: 50
                }
            }
        };

        const incomeCtx = document.getElementById('income-chart') as HTMLCanvasElement;
        if (incomeCtx && this.incomeChartData) {
            this.incomeChart = new Chart(incomeCtx, {
                type: 'pie',
                data: this.incomeChartData,
                options: commonOptions
            });
        } else {
            console.log('Не удалось создать диаграмму доходов:', {
                canvas: !!incomeCtx,
                data: !!this.incomeChartData
            });
        }

        const expenseCtx = document.getElementById('expense-chart') as HTMLCanvasElement;
        if (expenseCtx && this.expenseChartData) {
            this.expenseChart = new Chart(expenseCtx, {
                type: 'pie',
                data: this.expenseChartData,
                options: commonOptions
            });
        } else {
            console.log('Не удалось создать диаграмму расходов:', {
                canvas: !!expenseCtx,
                data: !!this.expenseChartData
            });
        }
    }

    async updateCharts(filterParams: any = null): Promise<void> {
        try {
            let url = '/operations';
            if (filterParams && Object.keys(filterParams).length > 0) {
                const params = new URLSearchParams();
                if (filterParams.period) {
                    params.append('period', filterParams.period);
                }
                if (filterParams.dateFrom) {
                    params.append('dateFrom', filterParams.dateFrom);
                }
                if (filterParams.dateTo) {
                    params.append('dateTo', filterParams.dateTo);
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }

            }
            const operations: Operation[] = await ApiUtils.request('GET', url);
            this.prepareChartData(operations);
            this.createCharts();
        } catch (error) {
            console.error('Ошибка обновления диаграмм:', error);
        }
    }
}