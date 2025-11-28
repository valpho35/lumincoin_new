import { ApiUtils } from "./api-utils";

export class MenuUtils {
    static initOperationsMenu(): void {
        this.setUpOperationsMenuEvents('.operations-menu');
    }

    static initMainMenu(): void {
        this.setUpOperationsMenuEvents('.menu');
    }

    static setUpOperationsMenuEvents(menuSelector: string): void {
        const menus = document.querySelectorAll(menuSelector);
        if (!menus.length) return;

        menus.forEach(menu => {
            const buttons = menu.querySelectorAll('.btn');

            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const period = this.getPeriodFromButton(button as HTMLElement);
                    if (period) {
                        this.handlePeriodSelection(period, button as HTMLElement, menu as HTMLElement);
                    }
                });
            });

            if (buttons.length > 0) {
                const monthButton = Array.from(buttons).find(btn =>
                    btn.textContent?.trim().toLowerCase() === 'месяц'
                ) as HTMLElement;

                if (monthButton) {
                    this.setActiveButton(monthButton, buttons as NodeListOf<HTMLElement>);
                    this.applyPeriodFilter('month');
                } else {
                    this.setActiveButton(buttons[0] as HTMLElement, buttons as NodeListOf<HTMLElement>);
                }
            }
        });
    }

    static getPeriodFromButton(button: HTMLElement): string | null {
        const text = button.textContent.trim().toLowerCase() || '';
        const periodMap: { [key: string]: string } = {
            'сегодня': 'today',
            'неделя': 'week',
            'месяц': 'month',
            'год': 'year',
            'все': 'all',
            'интервал': 'interval'
        };
        return periodMap[text] || null;
    }

    static handlePeriodSelection(period: string, button: HTMLElement, menu: HTMLElement): void {
        const allButtons = menu.querySelectorAll('.btn');
        this.setActiveButton(button, allButtons as NodeListOf<HTMLElement>);

        if (period === 'interval') {
            this.showDateInterval(menu);
        } else {
            this.hideDateInterval(menu);
            this.applyPeriodFilter(period);
        }
    }

    static setActiveButton(activeButton: HTMLElement, allButtons: NodeListOf<HTMLElement>): void {
        allButtons.forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-secondary');
        });

        activeButton.classList.add('active', 'btn-primary');
        activeButton.classList.remove('btn-outline-secondary');
    }

    static showDateInterval(menu: HTMLElement): void {
        const dateContainer = menu.querySelector('.date') as HTMLElement;
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

            const startDateInput = dateContainer.querySelector('.start-date') as HTMLInputElement;
            const endDateInput = dateContainer.querySelector('.end-date') as HTMLInputElement;

            if (startDateInput) startDateInput.value = weekAgoStr;
            if (endDateInput) endDateInput.value = today;

            const applyButton = dateContainer.querySelector('.apply-interval');
            applyButton?.addEventListener('click', () => {
                this.applyDateInterval(menu);
            });
        }
    }

    static hideDateInterval(menu: HTMLElement): void {
        const dateContainer = menu.querySelector('.date') as HTMLElement;
        if (dateContainer) {
            dateContainer.style.display = 'none';
        }
    }

    static async applyPeriodFilter(period: string): Promise<void> {
        try {
            const params = new URLSearchParams();
            params.append('period', period);
            const today = new Date();

            let dateFrom, dateTo;

            switch (period) {
                case 'today':
                    dateFrom = today.toISOString().split('T')[0];
                    dateTo = dateFrom;
                    params.append('dateFrom', dateFrom);
                    params.append('dateTo', dateTo);
                    break;
                case 'week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    dateFrom = weekAgo.toISOString().split('T')[0];
                    dateTo = today.toISOString().split('T')[0];
                    params.append('dateFrom', dateFrom);
                    params.append('dateTo', dateTo);
                    break;
                case 'month':
                    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    dateFrom = monthStart.toISOString().split('T')[0];
                    dateTo = monthEnd.toISOString().split('T')[0];
                    params.append('dateFrom', dateFrom);
                    params.append('dateTo', dateTo);
                    break;
                case 'year':
                    const yearStart = new Date(today.getFullYear(), 0, 1);
                    const yearEnd = new Date(today.getFullYear(), 11, 31);
                    dateFrom = yearStart.toISOString().split('T')[0];
                    dateTo = yearEnd.toISOString().split('T')[0];
                    params.append('dateFrom', dateFrom);
                    params.append('dateTo', dateTo);
                    break;
                case 'all':
                    break;
            }

            const url = `/operations?${params.toString()}`;

            if ((window as any).operationsInstance) {
                const operations = await ApiUtils.request('GET', url);
                (window as any).operationsInstance.displayOperations(operations);
            } else {

            }

            if ((window as any).diagramsInstance) {
                const filterParams: any = { period };
                if (dateFrom) filterParams.dateFrom = dateFrom;
                if (dateTo) filterParams.dateTo = dateTo;
                await (window as any).diagramsInstance.updateCharts(filterParams);
            } else {

            }

            if ((window as any).layoutInstance) {
                await (window as any).layoutInstance.loadBalance(
                    period,
                    dateFrom,
                    dateTo
                );
            } else {

            }
        } catch (error) {

        }
    }

    static async applyDateInterval(menu: HTMLElement): Promise<void> {
        const startInput = menu.querySelector('.start-date') as HTMLInputElement;
        const endInput = menu.querySelector('.end-date') as HTMLInputElement;

        if (!startInput || !endInput || !startInput.value || !endInput.value) {
            return;
        }

        const startDate = new Date(startInput.value);
        const endDate = new Date(endInput.value);

        if (startDate > endDate) {
            return;
        }

        try {
            const dateFrom = startInput.value;
            const dateTo = endInput.value;

            const params = new URLSearchParams({
                period: 'interval',
                dateFrom: dateFrom,
                dateTo: dateTo
            });

            const url = `/operations?${params.toString()}`;

            if ((window as any).operationsInstance) {
                const operations = await ApiUtils.request('GET', url);
                (window as any).operationsInstance.displayOperations(operations);
            } else {

            }

            if ((window as any).diagramsInstance) {
                await (window as any).diagramsInstance.updateCharts({
                    period: 'interval',
                    dateFrom: dateFrom,
                    dateTo: dateTo
                });
            } else {

            }

            if ((window as any).layoutInstance) {
                await (window as any).layoutInstance.loadBalance(
                    'interval',
                    dateFrom,
                    dateTo
                );
            } else {

            }

        } catch (error) {

        }
    }
}