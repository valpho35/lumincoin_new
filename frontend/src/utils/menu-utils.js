import { ApiUtils } from "./api-utils.js";

export class MenuUtils {
    static initOperationsMenu() {
        this.setUpOperationsMenuEvents('.operations-menu');
    }

    static initMainMenu() {
        this.setUpOperationsMenuEvents('.menu');
    }

    static setUpOperationsMenuEvents(menuSelector) {
        const menus = document.querySelectorAll(menuSelector);
        if (!menus.length) return;

        menus.forEach(menu => {
            const buttons = menu.querySelectorAll('.btn');

            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const period = this.getPeriodFromButton(button);
                    if (period) {
                        this.handlePeriodSelection(period, button, menu);
                    }
                });
            });

            if (buttons.length > 0) {
                this.setActiveButton(buttons[0], buttons);
            }
        });
    }

    static getPeriodFromButton(button) {
        const text = button.textContent.trim().toLowerCase();
        const periodMap = {
            'сегодня': 'today',
            'неделя': 'week',
            'месяц': 'month',
            'год': 'year',
            'все': 'all',
            'интервал': 'interval'
        };
        return periodMap[text];
    }

    static handlePeriodSelection(period, button, menu) {
        const allButtons = menu.querySelectorAll('.btn');
        this.setActiveButton(button, allButtons);

        if (period === 'interval') {
            this.showDateInterval(menu);
        } else {
            this.hideDateInterval(menu);
            this.applyPeriodFilter(period);
        }
    }

    static setActiveButton(activeButton, allButtons) {
        allButtons.forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-secondary');
        });

        activeButton.classList.add('active', 'btn-primary');
        activeButton.classList.remove('btn-outline-secondary');
    }

    static showDateInterval(menu) {
        const dateContainer = menu.querySelector('.date');
        if (!dateContainer) return;

        dateContainer.style.display = 'flex';
        dateContainer.style.alignItems = 'center';
        dateContainer.style.gap = '10px';

        if (!dateContainer.querySelector('input[type="date"]')) {
            dateContainer.innerHTML = `
                <span>с</span>
                <input type="date" class="form-control start-date" style="width: 150px;">
                <span>по</span>
                <input type="date" class="form-control end-date" style="width: 150px;">
                <button class="btn btn-primary apply-interval">Применить</button>
            `;

            const today = new Date().toISOString().split('T')[0];
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weekAgoStr = weekAgo.toISOString().split('T')[0];

            dateContainer.querySelector('.start-date').value = weekAgoStr;
            dateContainer.querySelector('.end-date').value = today;

            dateContainer.querySelector('.apply-interval').addEventListener('click', () => {
                this.applyDateInterval(menu);
            });
        }
    }

    static hideDateInterval(menu) {
        const dateContainer = menu.querySelector('.date');
        if (dateContainer) {
            dateContainer.style.display = 'none';
        }
    }

    static async applyPeriodFilter(period) {
        try {
            const params = new URLSearchParams();
            params.append('period', period);
            const today = new Date();

            switch (period) {
                case 'today':
                    const todayStr = today.toISOString().split('T')[0];
                    params.append('dateFrom', todayStr);
                    params.append('dateTo', todayStr);
                    break;
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    params.append('dateFrom', weekAgo.toISOString().split('T')[0]);
                    params.append('dateTo', today.toISOString().split('T')[0]);
                    break;
                case 'month':
                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    params.append('dateFrom', monthStart.toISOString().split('T')[0]);
                    params.append('dateTo', monthEnd.toISOString().split('T')[0]);
                    break;
                case 'year':
                    const yearStart = new Date(today.getFullYear(), 0, 1);
                    const yearEnd = new Date(today.getFullYear(), 11, 31);
                    params.append('dateFrom', yearStart.toISOString().split('T')[0]);
                    params.append('dateTo', yearEnd.toISOString().split('T')[0]);
                    break;
                case 'all':
                    break;
                default:
                    return;
            }

            const url = `/operations?${params.toString()}`;

            if (window.operationsInstance) {
                const operations = await ApiUtils.request('GET', url);
                window.operationsInstance.displayOperations(operations);
            } else if (window.diagramsInstance) {
                await window.diagramsInstance.updateCharts({ period });
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    static async applyDateInterval(menu) {
        const startInput = menu.querySelector('.start-date');
        const endInput = menu.querySelector('.end-date');

        if (!startInput || !endInput || !startInput.value || !endInput.value) {
            return;
        }

        const startDate = new Date(startInput.value);
        const endDate = new Date(endInput.value);

        if (startDate > endDate) {
            return;
        }

        try {
            const params = new URLSearchParams({
                period: 'interval',
                dateFrom: startInput.value,
                dateTo: endInput.value
            });

            const url = `/operations?${params.toString()}`;

            if (window.operationsInstance) {
                const operations = await ApiUtils.request('GET', url);
                window.operationsInstance.displayOperations(operations);
            } else if (window.diagramsInstance) {
                await window.diagramsInstance.updateCharts({
                    period: 'interval',
                    dateFrom: startInput.value,
                    dateTo: endInput.value
                });
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
}