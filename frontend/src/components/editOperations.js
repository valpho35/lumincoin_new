import { ApiUtils } from "../utils/api-utils.js";
export class EditOperations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationId = new URLSearchParams(window.location.search).get('id');
        this.isEditMode = !!this.operationId;
        this.categories = [];
        this.currentOperation = null;
        this.operationType = this.getOperationTypeFromUrl();
        this.init();
    }

    async init() {
        if (this.isEditMode) {
            await this.loadOperation();
        } else {
            this.setupCreateMode();
        }
        await this.loadCategories();
        this.setUpEvents();
        this.updateUI();
    }

    async loadOperation() {
        try {
            const operation = await ApiUtils.request('GET', `/operations/${this.operationId}`);

            this.currentOperation = operation;

            this.populateForm(operation);
        } catch (error) {
            console.error('Ошибка загрузки операции:', error);
            this.openNewRoute('/operations');
        }
    }

    async loadCategories() {
        try {
            const operationType = this.currentOperation ? this.currentOperation.type : this.getOperationTypeFromUrl();
            const endpoint = operationType === 'income'
                ? '/categories/income'
                : '/categories/expense';

            this.categories = await ApiUtils.request('GET', endpoint);
            this.populateCategorySelect();

        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
            this.populateCategorySelect();
        }
    }

    populateCategorySelect() {
        const categorySelect = document.getElementById('category');
        if (!categorySelect) return;

        categorySelect.innerHTML = '<option value="">Выберите категорию</option>';

        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.title;
            categorySelect.appendChild(option);
        });

        if (this.currentOperation) {
            let categoryId;
            if (this.currentOperation.type === 'income') {
                categoryId = this.currentOperation.category_income_id;
            } else {
                categoryId = this.currentOperation.category_expense_id;
            }
            if (categoryId) {
                categorySelect.value = categoryId;
            }
        }
    }

    populateForm(operation) {
        const typeSelect = document.getElementById('type');
        const amountInput = document.getElementById('amount');
        const dateInput = document.getElementById('date');
        const commentInput = document.getElementById('comment');
        const titleElement = document.getElementById('operation-title');

        if (typeSelect) typeSelect.value = operation.type || 'income';
        if (amountInput) amountInput.value = operation.amount || '';

        if (dateInput && operation.date) {
            const date = new Date(operation.date);
            dateInput.value = date.toISOString().split('T')[0];
        }

        if (commentInput) commentInput.value = operation.comment || '';

        if (titleElement) {
            titleElement.textContent = `Редактирование ${operation.type === 'income' ? 'дохода' : 'расхода'}`;
        }
    }

    getOperationTypeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('type') || 'income';
    }

    setupCreateMode() {
        this.setDefaultDate();

        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const typeSelect = document.getElementById('type');
        if (typeSelect && type) {
            typeSelect.value = type;
        }
    }

    setDefaultDate() {
        const dateInput = document.getElementById('date');
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    setUpEvents() {
        const form = document.getElementById('operation-form');
        const cancelBtn = document.getElementById('cancel-btn');
        const typeSelect = document.getElementById('type');

        if (form) {
            form.addEventListener('submit', (e) => this.saveOperation(e));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openNewRoute('/operations');
            });
        }

        typeSelect.addEventListener('change', async () => {
            await this.handleTypeChange();
        });
    }

    async handleTypeChange() {
        const typeSelect = document.getElementById('type');
        if (!typeSelect) return;

        this.operationType = typeSelect.value;

        if (this.isEditMode) {
            this.currentOperation = null;
        }

        await this.loadCategories();
        this.updateTitle();

        const categorySelect = document.getElementById('category');
        if (categorySelect) {
            categorySelect.value = "";
        }
    }

    setupValidation() {
        const form = document.getElementById('operation-form');
        if (form) {
            form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
                field.addEventListener('input', () => this.validateField(field));
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('change', () => this.validateField(field));
            });
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

    updateUI() {
        const titleElement = document.getElementById('operation-title');
        const submitButton = document.querySelector('button[type="submit"]');

        if (!this.isEditMode && titleElement) {
            const typeSelect = document.getElementById('type');
            const type = typeSelect ? typeSelect.value : 'income';
            titleElement.textContent = type === 'income' ? 'Создание дохода' : 'Создание расхода';
        }

        if (submitButton) {
            submitButton.textContent = this.isEditMode ? 'Сохранить' : 'Создать';
        }
    }

    updateTitle() {
        if (this.isEditMode) return;

        const typeSelect = document.getElementById('type');
        const titleElement = document.getElementById('operation-title');

        if (titleElement && typeSelect) {
            const type = typeSelect.value === 'income' ? 'дохода' : 'расхода';
            titleElement.textContent = `Создание ${type}`;
        }
    }

    async saveOperation(e) {
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
            if (this.isEditMode) {
                await ApiUtils.request('PUT', `/operations/${this.operationId}`, {
                    body: operationData
                });
            } else {
                await ApiUtils.request('POST', '/operations', {
                    body: operationData
                });
            }

            await this.refreshBalance();

            this.openNewRoute('/operations');

        } catch (error) {
            console.error('Ошибка сохранения операции:', error);
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
