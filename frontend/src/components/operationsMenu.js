export class OperationsMenu {
    constructor(onFilterChange) {
        this.onFilterChange = onFilterChange;
        this.currentFilter = 'today';
        this.dateRange = {
            start: null,
            end: null
        };
        this.init();
    }

    init() {
        this.setUpEvents();
        this.setActiveButton('today');
        this.applyFilter('today');
    }

    setUpEvents() {
        const periodButtons = document.querySelectorAll('.operations-menu .btn-outline-secondary');
        
        periodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = e.target.textContent.trim().toLowerCase();
                console.log('Клик по кнопке:', buttonText);
                this.handleButtonClick(buttonText, e.target);
            });
        });

        this.setupDateInputs();
    }

    setupDateInputs() {
        const dateContainer = document.querySelector('.operations-menu .date');
        if (dateContainer) {
            dateContainer.innerHTML = '';
            
            const startLabel = document.createElement('span');
            startLabel.textContent = 'с';
            
            const startDateInput = document.createElement('input');
            startDateInput.type = 'date';
            startDateInput.className = 'form-control';
            startDateInput.id = 'start-date';
            startDateInput.style.cssText = 'display: inline-block; width: 150px; margin: 0 10px;';
            
            const endLabel = document.createElement('span');
            endLabel.textContent = 'по';
            
            const endDateInput = document.createElement('input');
            endDateInput.type = 'date';
            endDateInput.className = 'form-control';
            endDateInput.id = 'end-date';
            endDateInput.style.cssText = 'display: inline-block; width: 150px; margin: 0 10px;';

            dateContainer.appendChild(startLabel);
            dateContainer.appendChild(startDateInput);
            dateContainer.appendChild(endLabel);
            dateContainer.appendChild(endDateInput);

            dateContainer.style.display = 'none';

            startDateInput.addEventListener('change', () => this.handleDateChange());
            endDateInput.addEventListener('change', () => this.handleDateChange());

            const today = new Date().toISOString().split('T')[0];
            startDateInput.value = today;
            endDateInput.value = today;
            
            this.startDateInput = startDateInput;
            this.endDateInput = endDateInput;
        }
    }

    handleButtonClick(period, button) {
        console.log('Обработка периода:', period);
        this.setActiveButton(period);
        
        if (period === 'интервал') {
            this.showDateInputs();
        } else {
            this.hideDateInputs();
            this.applyFilter(period);
        }
    }

    handleDateChange() {
        if (!this.startDateInput || !this.endDateInput) return;
        
        const startValue = this.startDateInput.value;
        const endValue = this.endDateInput.value;

        if (startValue && endValue) {
            this.dateRange.start = new Date(startValue);
            this.dateRange.end = new Date(endValue);
            
            console.log('Даты интервала изменены:', {
                start: this.dateRange.start.toISOString(),
                end: this.dateRange.end.toISOString()
            });

            this.applyCustomDateFilter();
        }
    }

    showDateInputs() {
        const dateContainer = document.querySelector('.operations-menu .date');
        if (dateContainer) {
            dateContainer.style.display = 'flex';
            dateContainer.style.alignItems = 'center';
            dateContainer.style.flexWrap = 'wrap';
            
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            if (this.startDateInput && this.endDateInput) {
                this.startDateInput.value = startDate.toISOString().split('T')[0];
                this.endDateInput.value = endDate.toISOString().split('T')[0];

                this.dateRange.start = startDate;
                this.dateRange.end = endDate;

                setTimeout(() => {
                    this.applyCustomDateFilter();
                }, 100);
            }
        }
    }

    hideDateInputs() {
        const dateContainer = document.querySelector('.operations-menu .date');
        if (dateContainer) {
            dateContainer.style.display = 'none';
        }
    }

    setActiveButton(activePeriod) {
        const allButtons = document.querySelectorAll('.operations-menu .btn-outline-secondary');
        
        allButtons.forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-secondary');
        });

        const activeButton = Array.from(allButtons).find(btn => 
            btn.textContent.trim().toLowerCase() === activePeriod
        );
        
        if (activeButton) {
            activeButton.classList.add('active', 'btn-primary');
            activeButton.classList.remove('btn-outline-secondary');
            console.log('Активная кнопка установлена:', activePeriod);
        }

        this.currentFilter = activePeriod;
    }

    applyFilter(period) {
        const today = new Date();
        let startDate, endDate;

        console.log('Применение фильтра:', period);

        switch (period) {
            case 'сегодня':
                startDate = new Date(today);
                endDate = new Date(today);
                break;
            case 'неделя':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                endDate = new Date(today);
                break;
            case 'месяц':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'год':
                startDate = new Date(today.getFullYear(), 0, 1);
                endDate = new Date(today.getFullYear(), 11, 31);
                break;
            case 'все':
                startDate = null;
                endDate = null;
                break;
            default:
                console.log('Неизвестный период, используем "все"');
                startDate = null;
                endDate = null;
        }

        console.log('Период фильтра:', { 
            period, 
            startDate: startDate?.toISOString(), 
            endDate: endDate?.toISOString() 
        });

        if (this.onFilterChange) {
            this.onFilterChange({
                startDate,
                endDate,
                filterType: period,
                displayText: period
            });
        }
    }

    applyCustomDateFilter() {
        if (this.dateRange.start && this.dateRange.end) {
            console.log('Применение кастомного фильтра по датам:', {
                start: this.dateRange.start.toISOString(),
                end: this.dateRange.end.toISOString()
            });

            if (this.onFilterChange) {
                this.onFilterChange({
                    startDate: this.dateRange.start,
                    endDate: this.dateRange.end,
                    filterType: 'interval',
                    displayText: `Интервал: ${this.dateRange.start.toLocaleDateString()} - ${this.dateRange.end.toLocaleDateString()}`
                });
            }
        }
    }
}