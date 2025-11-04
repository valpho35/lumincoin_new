import { ApiUtils } from "../utils/api-utils.js";
export class CreateOperations {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationType = this.getOperationTypeFromUrl();
        this.setUpEvents();
        this.updateUI();
    }

    getOperationTypeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('type') || 'income';
    }

    setUpEvents() {
        const form = document.getElementById('operation-form');
        const cancelBtn = document.getElementById('cancel-btn');
        const typeSelect = document.getElementById('type');

        if (form) {

            form.querySelectorAll('input, select, textarea').forEach(element => {
                element.addEventListener('input', () => {
                    if (element.checkValidity()) {
                        element.classList.remove('is-invalid');
                        element.classList.add('is-valid');
                    }
                });
            });

            form.addEventListener('submit', (e) => this.createOperations(e));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openNewRoute('/operations');
            });
        }

        if (typeSelect) {
            typeSelect.addEventListener('change', () => {
                this.operationType = typeSelect.value;
                this.updateUI();
            });
        }
        this.setDefaultDate();

        this.resetFormValidation();
    }
    resetFormValidation() {
        const form = document.getElementById('operation-form');
        if (form) {
            form.classList.remove('was-validated');
            form.querySelectorAll('.is-invalid, .is-valid').forEach(element => {
                element.classList.remove('is-invalid', 'is-valid');
            });
        }
    }

    setDefaultDate() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    updateUI() {
        const titleElement = document.getElementById('operation-title');
        const typeSelect = document.getElementById('type');

        if (titleElement) {
            titleElement.textContent = this.operationType === 'income'
                ? 'Создание дохода'
                : 'Создание расхода';
        }

        if (typeSelect) {
            typeSelect.value = this.operationType;
        }
    }

    async createOperations(e) {
        e.preventDefault();

        const form = e.target;
        this.resetFormValidation();

        const formData = new FormData(form);
        const amount = parseFloat(formData.get('amount'));
        const category = formData.get('category').trim();
        const date = formData.get('date');
        const comment = formData.get('comment');
        const type = formData.get('type');

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            form.querySelectorAll(':invalid').forEach(element => {
                element.classList.add('is-invalid');
            });
            return;
        }

        let isValid = true;

        if (!category || category === '') {
            document.getElementById('category').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('category').classList.remove('is-invalid');
            document.getElementById('category').classList.add('is-valid');
        }

        if (!amount || amount <= 0 || isNaN(amount)) {
            document.getElementById('amount').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('amount').classList.remove('is-invalid');
            document.getElementById('amount').classList.add('is-valid');
        }

        if (!isValid) {
            return;
        }

        try {
            const operationData = {
                type: type,
                amount: amount,
                category: category,
                date: date,
                comment: comment || ''
            };

            await ApiUtils.request('POST', '/operations', {
                body: operationData
            });

            this.openNewRoute('/operations');

        } catch (error) {
            console.error('Ошибка', error);

            if (error.message.includes('category') || error.message.includes('404')) {
                try {
                    const simplifiedData = {
                        type: type,
                        amount: amount,
                        date: date,
                        comment: comment || '',
                        category_title: category 
                    };

                    await ApiUtils.request('POST', '/operations', {
                        body: simplifiedData
                    });

                    this.openNewRoute('/operations');

                } catch (secondError) {
                    console.error('Ошибка при создании операции', secondError);
                }
            } else {
                alert('Ошибка при создании операции. Проверьте данные и попробуйте еще раз.');
            }
        }
    }
}