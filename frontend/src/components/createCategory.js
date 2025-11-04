import { ApiUtils } from "../utils/api-utils.js";

export class CreateCategory {
    constructor(openNewRoute, categoryType = null) {
        this.openNewRoute = openNewRoute;
        this.categoryType = categoryType || this.getCategoryTypeFromUrl();

        this.setUpEvents();
        this.updateUI();
    }

    getCategoryTypeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const typeFromUrl = urlParams.get('type');

        return typeFromUrl;
    }

    setUpEvents() {
        const createBtn = document.getElementById('create-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const input = document.getElementById('category-name');
        const feedback = document.getElementById('category-error');

        if (createBtn) {
            createBtn.addEventListener('click', () => {
                this.createCategory();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.returnToCategories();
            });
        }

        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
                if (feedback) feedback.classList.add('d-none');
            });

            // setTimeout(() => {
            //     input.focus();
            // }, 100);
        }
    }

    updateUI() {
        const titleElement = document.getElementById('category-title');

        if (titleElement) {
            if (this.categoryType === 'income') {
                titleElement.textContent = 'Создание категории доходов';
            } else if (this.categoryType === 'expense') {
                titleElement.textContent = 'Создание категории расходов';
            } else {
                titleElement.textContent = 'Создание категории';
            }
        }
    }

    async createCategory() {
        const input = document.getElementById('category-name');
        const feedback = document.getElementById('category-error');

        if (!input) {
            console.error('Инпут не найден');
            return;
        }

        const categoryName = input.value.trim();

        if (!categoryName) {
            input.classList.add('is-invalid');
            if (feedback) {
                feedback.classList.remove('d-none');
            }
            input.focus();
            return;
        }
        let endpoint;

        if (this.categoryType === 'income' || this.categoryType === 'expenses' || this.categoryType === 'expense') {
            endpoint = this.categoryType.includes('income') ? '/categories/income' : '/categories/expense';
        } else {
            alert('Неизвестный тип категории');
            return;
        }

        try {
            await ApiUtils.request('POST', endpoint, {
                body: { title: categoryName }
            });

            this.returnToCategories();
        } catch (error) {
            console.log(`Ошибка создания категории ${this.categoryType}:`, error);
            input.classList.add('is-invalid');
            if (feedback) {
                feedback.classList.remove('d-none');
            }
        }
    }

    returnToCategories() {
        let returnRoute;
        if (this.categoryType === 'income') {
            returnRoute = '/income';
        } else if (this.categoryType === 'expense') {
            returnRoute = '/expenses';
        } else {
            returnRoute = '/';
        }

        this.openNewRoute(returnRoute);
    }
}