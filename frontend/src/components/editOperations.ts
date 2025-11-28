import { ApiUtils } from "../utils/api-utils";

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

export interface Category {
    id: string;
    title: string;
    type?: 'income' | 'expense';
}

export interface OperationData {
    type: string;
    amount: number;
    date: string;
    comment: string;
    category_id: number;
}

export class EditOperations {
    private openNewRoute: (url: string) => void;
    private operationId: string | null;
    private isEditMode: boolean;
    private categories: Category[];
    private currentOperation: Operation | null;
    private operationType: string;

    constructor(openNewRoute: (url: string) => void) {
        this.openNewRoute = openNewRoute;
        console.log('EditOperations component initialized');
        this.operationId = new URLSearchParams(window.location.search).get('id');
        this.isEditMode = !!this.operationId;
        this.categories = [];
        this.currentOperation = null;
        this.operationType = this.getOperationTypeFromUrl();
        this.init();
    }

    async init(): Promise<void> {
        if (this.isEditMode) {
            await this.loadOperation();
        } else {
            this.setupCreateMode();
        }
        await this.loadCategories();
        this.setUpEvents();
        this.updateUI();
    }

    async loadOperation(): Promise<void> {
        try {
            const operation: Operation = await ApiUtils.request('GET', `/operations/${this.operationId}`);

            this.currentOperation = operation;

            this.populateForm(operation);
        } catch (error) {
            console.error('Ошибка загрузки операции:', error);
            this.openNewRoute('/operations');
        }
    }

    async loadCategories(): Promise<void> {
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

    populateCategorySelect(): void {
        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        if (!categorySelect) return;

        categorySelect.innerHTML = '<option value="">Выберите категорию</option>';

        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id.toString();
            option.textContent = category.title;
            categorySelect.appendChild(option);
        });

        if (this.currentOperation) {
            let categoryId: string | undefined;
            if (this.currentOperation.type === 'income') {
                categoryId = this.currentOperation.category_income_id?.toString();
            } else {
                categoryId = this.currentOperation.category_expense_id?.toString();
            }
            if (categoryId) {
                categorySelect.value = categoryId;
            }
        }
    }

    populateForm(operation: Operation): void {
        const typeSelect = document.getElementById('type') as HTMLSelectElement;
        const amountInput = document.getElementById('amount') as HTMLInputElement;
        const dateInput = document.getElementById('date') as HTMLInputElement;
        const commentInput = document.getElementById('comment') as HTMLTextAreaElement;
        const titleElement = document.getElementById('operation-title');

        if (typeSelect) typeSelect.value = operation.type || 'income';
        if (amountInput) amountInput.value = operation.amount?.toString() || '';

        if (dateInput && operation.date) {
            const date = new Date(operation.date);
            dateInput.value = date.toISOString().split('T')[0];
        }

        if (commentInput) commentInput.value = operation.comment || '';

        if (titleElement) {
            titleElement.textContent = `Редактирование ${operation.type === 'income' ? 'дохода' : 'расхода'}`;
        }
    }

    getOperationTypeFromUrl(): string {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('type') || 'income';
    }

    setupCreateMode(): void {
        this.setDefaultDate();

        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        const typeSelect = document.getElementById('type') as HTMLSelectElement;
        if (typeSelect && type) {
            typeSelect.value = type;
        }
    }

    setDefaultDate(): void {
        const dateInput = document.getElementById('date') as HTMLInputElement;
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    setUpEvents(): void {
        const form = document.getElementById('operation-form') as HTMLFormElement;
        const cancelBtn = document.getElementById('cancel-btn');
        const typeSelect = document.getElementById('type') as HTMLSelectElement;

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

    async handleTypeChange(): Promise<void> {
        const typeSelect = document.getElementById('type') as HTMLSelectElement;
        if (!typeSelect) return;

        this.operationType = typeSelect.value;

        if (this.isEditMode) {
            this.currentOperation = null;
        }

        await this.loadCategories();
        this.updateTitle();

        const categorySelect = document.getElementById('category') as HTMLSelectElement;
        if (categorySelect) {
            categorySelect.value = "";
        }
    }

    setupValidation(): void {
        const form = document.getElementById('operation-form');
        if (form) {
            form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
                field.addEventListener('input', () => this.validateField(field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement));
                field.addEventListener('blur', () => this.validateField(field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement));
                field.addEventListener('change', () => this.validateField(field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement));
            });
        }
    }

    validateField(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): void {
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

    validateForm(form: HTMLElement): boolean {
        let isValid = true;

        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            this.validateField(field as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement);
            if (field.classList.contains('is-invalid')) {
                isValid = false;
            }
        });
        return isValid;
    }

    updateUI(): void {
        const titleElement = document.getElementById('operation-title');
        const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

        if (!this.isEditMode && titleElement) {
            const typeSelect = document.getElementById('type') as HTMLSelectElement;
            const type = typeSelect ? typeSelect.value : 'income';
            titleElement.textContent = type === 'income' ? 'Создание дохода' : 'Создание расхода';
        }

        if (submitButton) {
            submitButton.textContent = this.isEditMode ? 'Сохранить' : 'Создать';
        }
    }

    updateTitle(): void {
        if (this.isEditMode) return;

        const typeSelect = document.getElementById('type') as HTMLSelectElement;
        const titleElement = document.getElementById('operation-title');

        if (titleElement && typeSelect) {
            const type = typeSelect.value === 'income' ? 'дохода' : 'расхода';
            titleElement.textContent = `Создание ${type}`;
        }
    }

    async saveOperation(e: Event): Promise<void> {
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

     async refreshBalance(): Promise<void> {
        try {
            const { Layout } = await import("../components/layout");
            await Layout.refreshBalance();
        } catch (error) {
            console.error('Ошибка обновления баланса:', error);
        }
    }
}
