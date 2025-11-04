import { ApiUtils } from "../utils/api-utils.js";
export class EditOperations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationId = new URLSearchParams(window.location.search).get('id');
        this.isEditMode = !!this.operationId;
        this.init();
    }

    async init() {
        if (this.isEditMode) {
            await this.loadOperation();
        } else {
            this.setupCreateMode();
        }
        this.setUpEvents();
        this.updateUI();
    }

    async loadOperation() {
        try {
            console.log('Загрузка', this.operationId);
            const operation = await ApiUtils.request('GET', `/operations/${this.operationId}`);

            this.populateForm(operation);
        } catch (error) {
            console.error('Ошибка загрузки операции:', error);
            // alert('Не удалось загрузить данные операции');
            this.openNewRoute('/operations');
        }
    }

    populateForm(operation) {
        const typeSelect = document.getElementById('type');
        const categoryInput = document.getElementById('category');
        const amountInput = document.getElementById('amount');
        const dateInput = document.getElementById('date');
        const commentInput = document.getElementById('comment');
        const titleElement = document.getElementById('operation-title');

        if (typeSelect) typeSelect.value = operation.type || 'income';
        if (categoryInput) categoryInput.value = operation.category || '';
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

        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                this.updateTitle();
            });
        }
        this.setupValidation();
    }

    setupValidation() {
        const amountInput = document.getElementById('amount');
        const categoryInput = document.getElementById('category');

        if (amountInput) {
            amountInput.addEventListener('input', () => {
                if (amountInput.value && parseFloat(amountInput.value) > 0) {
                    amountInput.classList.remove('is-invalid');
                }
            });
        }

        if (categoryInput) {
            categoryInput.addEventListener('input', () => {
                if (categoryInput.value.trim()) {
                    categoryInput.classList.remove('is-invalid');
                }
            });
        }
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
        const formData = new FormData(form);

        if (!this.validateForm(formData)) {
            return;
        }

        const operationData = {
            type: formData.get('type'),
            category: formData.get('category').trim(),
            amount: parseFloat(formData.get('amount')),
            date: formData.get('date'),
            comment: formData.get('comment') || ''
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

            this.openNewRoute('/operations');

        } catch (error) {
            console.error('Ошибка сохранения операции:', error);
            // alert('Не удалось сохранить операцию.');
        }
    }

    validateForm(formData) {
        let isValid = true;
        const amount = parseFloat(formData.get('amount'));
        const category = formData.get('category').trim();
        const date = formData.get('date');

        const amountInput = document.getElementById('amount');
        const categoryInput = document.getElementById('category');
        const dateInput = document.getElementById('date');

        if (!amount || amount <= 0) {
            amountInput.classList.add('is-invalid');
            isValid = false;
        } else {
            amountInput.classList.remove('is-invalid');
        }

        if (!category) {
            categoryInput.classList.add('is-invalid');
            isValid = false;
        } else {
            categoryInput.classList.remove('is-invalid');
        }

        if (!date) {
            dateInput.classList.add('is-invalid');
            isValid = false;
        } else {
            dateInput.classList.remove('is-invalid');
        }

        return isValid;
    }
}