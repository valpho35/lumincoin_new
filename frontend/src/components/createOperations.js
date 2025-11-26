import { ApiUtils } from "../utils/api-utils.js";
export class CreateOperations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationType = this.getOperationTypeFromUrl();
        this.categories = [];
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

            if (!this.categories || this.categories.length === 0) {
                console.log('Категории не найдены, создаем по умолчанию...');
                await this.createDefaultCategories();
                this.categories = await ApiUtils.request('GET', endpoint);
            }

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
        const typeSelect = document.getElementById('type');

        if (form) {
            form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
                field.addEventListener('input', () => this.validateField(field));
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('change', () => this.validateField(field));
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

        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    async handleTypeChange() {
        const typeSelect = document.getElementById('type');
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

    validateField(field) {
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

    validateForm(form) {
        let isValid = true;

        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            this.validateField(field);
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

    async createOperations(e) {
        e.preventDefault();

        const form = e.target;

        if (!this.validateForm(form)) {
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        const formData = new FormData(form);

        const amount = parseFloat(formData.get('amount'));
        const categoryId = formData.get('category');
        const date = formData.get('date');
        const comment = formData.get('comment');
        const type = formData.get('type');

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
            const { Layout } = await import("../components/layout.js");
            await Layout.refreshBalance();
        } catch (error) {
            console.error('Ошибка обновления баланса:', error);
        }
    }
}

