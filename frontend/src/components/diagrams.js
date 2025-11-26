import { ApiUtils } from "../utils/api-utils.js";

export class Diagrams {
    constructor() {
        this.incomeChart = null;
        this.expenseChart = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.createCharts();
    }

    async loadData() {
        try {
            const operations = await ApiUtils.request('GET', '/operations');
            this.prepareChartData(operations);
        } catch (error) {
            console.error('Ошибка загрузки данных для диаграмм:', error);
            this.prepareChartData([]);
        }
    }

    prepareChartData(operations) {
        const incomeData = this.groupByCategory(operations.filter(op => op.type === 'income'));
        const expenseData = this.groupByCategory(operations.filter(op => op.type === 'expense'));

        this.incomeChartData = this.formatChartData(incomeData);
        this.expenseChartData = this.formatChartData(expenseData);
    }

    groupByCategory(operations) {
        const groups = {};

        operations.forEach(operation => {
            const category = operation.category || 'Без категории';
            if (!groups[category]) {
                groups[category] = 0;
            }
            groups[category] += operation.amount;
        });

        return groups;
    }

    formatChartData(data) {
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

    generateColors(count) {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
            '#7CFFB2', '#F465C3', '#8AE6FF', '#FFD166'
        ];
        return colors.slice(0, count);
    }

    createCharts() {
        if (this.incomeChart) this.incomeChart.destroy();
        if (this.expenseChart) this.expenseChart.destroy();

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 16,
                        boxHeight: 16,
                        usePointStyle: false,
                        font: {
                            size: 14,
                            family: 'Arial, sans-serif',
                            weight: 'normal'
                        },
                        color: '#000000',
                        padding: 8,
                        generateLabels: (chart) => {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => ({
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
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
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

        const incomeCtx = document.getElementById('income-chart');
        if (incomeCtx) {
            this.incomeChart = new Chart(incomeCtx, {
                type: 'pie',
                data: this.incomeChartData,
                options: commonOptions
            });
        }

        const expenseCtx = document.getElementById('expense-chart');
        if (expenseCtx) {
            this.expenseChart = new Chart(expenseCtx, {
                type: 'pie',
                data: this.expenseChartData,
                options: commonOptions
            });
        }
    }

    async updateCharts(filterParams = null) {
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
            const operations = await ApiUtils.request('GET', url);
            this.prepareChartData(operations);
            this.createCharts();
        } catch (error) {
            console.error('Ошибка обновления диаграмм:', error);
        }
    }
}