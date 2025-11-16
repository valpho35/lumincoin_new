import { ApiUtils } from "../utils/api-utils.js";
import { OperationsMenu } from "./operationsMenu.js";
export class Operations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationToDelete = null;
        this.operationsMenu = new OperationsMenu(this.handleFilterChange.bind(this));
        this.init();
    }

    async init() {
        await this.loadOperations();
        this.setUpEvents();
    }

    async loadOperations() {
        try {
            const operations = await ApiUtils.request('GET', '/operations');
            this.displayOperations(operations);
        } catch (error) {
            this.displayOperations([]);
        }
    }

    handleFilterChange(filter) {
    // console.log('=== FILTER CHANGE ===');
    // console.log('Тип фильтра:', filter.filterType);
    // console.log('Начальная дата:', filter.startDate?.toISOString());
    // console.log('Конечная дата:', filter.endDate?.toISOString());
    // console.log('=====================');
    
    this.filterOperations(filter);
}

async filterOperations(filter) {
    try {
        let url = '/operations';
        
        if (filter.startDate && filter.endDate) {
            const startStr = filter.startDate.toISOString().split('T')[0];
            const endStr = filter.endDate.toISOString().split('T')[0];
            
            console.log('Запрос с датами:', { startStr, endStr });
            
            const params = new URLSearchParams({
                start_date: startStr,
                end_date: endStr
            });
            url += `?${params}`;
        }
        
        console.log('URL запроса:', url);
        const operations = await ApiUtils.request('GET', url);
        console.log('Получено операций:', operations.length);
        console.log('Операции:', operations);
        this.displayOperations(operations);
    } catch (error) {
        console.error('Ошибка фильтрации операций:', error);
        this.displayOperations([]);
    }
}

    displayOperations(operations) {
        console.log('Operations data for table:', operations);
        const tbody = document.querySelector('.table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!operations || operations.length === 0) {
            tbody.innerHTML = `
                <tr>
                <td colspan="7" class="text-center py-4">
                    <div class="text-muted">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                        <p class="mt-2 mb-0">Операций пока нет</p>
                        <small>Создайте первую операцию, нажав кнопку выше</small>
                    </div>
                </td>
            </tr>
            `;
            return;
        }

        operations.forEach((operation, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td class="${operation.type === 'income' ? 'inc' : 'exp'}">
                    ${operation.type === 'income' ? 'доход' : 'расход'}
                </td>
                <td>${operation.category || ''}</td>
                <td>${operation.amount}$</td>
                <td>${new Date(operation.date).toLocaleDateString('ru-RU')}</td>
                <td>${operation.comment || ''}</td>
                <td>
                <button class="btn btn-sm delete-btn" data-id="${operation.id}">
                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="black"/>
                        <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="black"/>
                        <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="black"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="black"/>
                    </svg>
                </button>
                    <button class="btn btn-sm edit-btn" data-id="${operation.id}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z" fill="black"/>
                        </svg>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    setUpEvents() {
        document.getElementById('create-income-btn')?.addEventListener('click', () => {
            this.openNewRoute('/create-operations?type=income');
        });

        document.getElementById('create-expense-btn')?.addEventListener('click', () => {
            this.openNewRoute('/create-operations?type=expense');
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
                const button = e.target.classList.contains('edit-btn') ? e.target : e.target.closest('.edit-btn');
                const operationId = button.getAttribute('data-id');
                if (operationId && !operationId.startsWith('template-')) {
                    this.openNewRoute(`/edit-operations?id=${operationId}`);
                }
            }

            if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                const button = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
                const operationId = button.getAttribute('data-id');
                if (operationId && !operationId.startsWith('template-')) {
                    this.showDeletePopup(operationId);
                }
            }
        });

        this.setupDeletePopup();
    }

    setupDeletePopup() {
        document.getElementById('confirmDeleteOperation')?.addEventListener('click', () => this.confirmDelete());
        document.getElementById('cancelDeleteOperation')?.addEventListener('click', () => this.hideDeletePopup());

        const popup = document.getElementById('deleteOperationPopup');
        popup?.addEventListener('click', (e) => {
            if (e.target === popup) this.hideDeletePopup();
        });
    }

    showDeletePopup(operationId) {
        this.operationToDelete = operationId;
        const popup = document.getElementById('deleteOperationPopup');
        if (popup) popup.style.display = 'block';
    }

    hideDeletePopup() {
        this.operationToDelete = null;
        const popup = document.getElementById('deleteOperationPopup');
        if (popup) popup.style.display = 'none';
    }

    async confirmDelete() {
        if (!this.operationToDelete) return;

        try {
            await ApiUtils.request('DELETE', `/operations/${this.operationToDelete}`);
            this.hideDeletePopup();
            await this.loadOperations();
        } catch (error) {
            console.error('Ошибка удаления операции:', error);
            alert('Не удалось удалить операцию');
            this.hideDeletePopup();
        }
    }
}