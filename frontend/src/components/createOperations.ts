import { ApiUtils } from "../utils/api-utils";
export class CreateOperations {
    private openNewRoute: (url: string) => void;
    private operationType: string;
    private categories: any[] = [];

    constructor(openNewRoute: (url: string) => void) {
        this.openNewRoute = openNewRoute;
        this.operationType = this.getOperationTypeFromUrl();
       
        this.init();
    }

    async init() {
        await this.loadCategories();
        this.setUpEvents();
    }
    async loadCategories() {
        try {
            const endpoint = this.operationType === 'income'
                ? '/categories/income'
                : '/categories/expense';

            this.categories = await ApiUtils.request('GET', endpoint);

            this.populateCategorySelect();

        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
            this.categories = [];
            this.populateCategorySelect();
        }
    }

    populateCategorySelect() {
        const select = document.getElementById('category');
        if (!select) return;

        select.innerHTML = '<option value="">Выберите категорию</option>';

        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.title;
            select.appendChild(option);
        });
    }

    setUpEvents() {
        const form = document.getElementById('operation-form');
        const cancelBtn = document.getElementById('cancel-btn');
        const typeSelect = document.getElementById('type') as HTMLSelectElement;

        if (form) {
            form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
                field.addEventListener('input', () => this.validateField(field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement));
                field.addEventListener('blur', () => this.validateField(field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement));
                field.addEventListener('change', () => this.validateField(field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement));
            });

            form.addEventListener('submit', (e) => this.createOperations(e));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.openNewRoute('/operations');
            });
        }

        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                this.handleTypeChange();
            });
        }

        const dateInput = document.getElementById('date') as HTMLInputElement;
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    async handleTypeChange() {
        const typeSelect = document.getElementById('type') as HTMLSelectElement;
        if (!typeSelect) return;

        this.operationType = typeSelect.value;
        await this.loadCategories();
        this.updateTitle();
    }

    updateTitle() {
        const titleElement = document.getElementById('operation-title');
        if (titleElement) {
            const type = this.operationType === 'income' ? 'дохода' : 'расхода';
            titleElement.textContent = `Создание ${type}`;
        }
    }

    validateField(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
        field.classList.remove('is-invalid');
        field.classList.remove('is-valid');

        const value = field.value.trim();
        let isValid = true;

        switch (field.id) {
            case 'amount':
                const numericValue = parseFloat(value);
                isValid = !isNaN(numericValue) && numericValue > 0;
                break;

            case 'comment':
                if (field.hasAttribute('required')) {
                    isValid = value !== '';
                } else {
                    isValid = true;
                }
                break;

            case 'category':
            case 'type':
            case 'date':
                isValid = value !== '';
                break;

            default:
                isValid = field.checkValidity();
        }

        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
        }
    }

    validateForm(form: Element) {
        let isValid = true;

        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            this.validateField(field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement);
            if (field.classList.contains('is-invalid')) {
                isValid = false;
            }
        });

        return isValid;
    }

    getOperationTypeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('type') || 'income';
    }

    async createOperations(e: SubmitEvent) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        if (!this.validateForm(form)) {
            const firstInvalid = form.querySelector('.is-invalid') as HTMLElement;
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        const formData = new FormData(form);

        const amount = parseFloat(formData.get('amount') as string);
        const categoryId = formData.get('category') as string;
        const date = formData.get('date') as string;
        const comment = formData.get('comment') as string;
        const type = formData.get('type') as string;

        const operationData = {
            type: type,
            amount: amount,
            date: date,
            comment: comment || '',
            category_id: parseInt(categoryId)
        };

        try {
            await ApiUtils.request('POST', '/operations', {
                body: operationData
            });

            await this.refreshBalance();

            this.openNewRoute('/operations');
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    async refreshBalance() {
        try {
            const { Layout } = await import("../components/layout");
            await Layout.refreshBalance();
        } catch (error) {
            console.error('Ошибка обновления баланса:', error);
        }
    }
}

