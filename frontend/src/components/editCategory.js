import { ApiUtils } from "../utils/api-utils.js";

export class EditCategory {
    constructor(openNewRoute, categoryType = null) {
        this.openNewRoute = openNewRoute;

        this.categoryType = categoryType || this.getCategoryTypeFromUrl();
        this.categoryId = new URLSearchParams(window.location.search).get('id');

        if (!this.categoryId) {
            console.error('No category ID provided');
            const returnRoute = this.categoryType === 'income' ? '/income' : '/expenses';
            return;
        }

        this.loadAndSetup();
    }

    getCategoryTypeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const typeFromUrl = urlParams.get('type');

        if (!typeFromUrl) {
            const currentPath = window.location.pathname;
            if (currentPath.includes('income')) return 'income';
            if (currentPath.includes('expense')) return 'expense';
        }

        return typeFromUrl || 'income';
    }

    async loadAndSetup() {
        if (!this.categoryId) {
            const returnRoute = this.categoryType === 'income' ? '/income' : '/expenses';
            return this.openNewRoute(returnRoute);
        }

        try {
            const endpoint = this.categoryType === 'income'
                ? `/categories/income/${this.categoryId}`
                : `/categories/expense/${this.categoryId}`;

            const category = await ApiUtils.request('GET', endpoint);

            const input = document.getElementById('category-name');
            if (input) {
                input.value = category.title;
            }
        } catch (error) {
            console.log('Ошибка загрузки категории:', error);
            const returnRoute = this.categoryType === 'income' ? '/income' : '/expenses';
            this.openNewRoute(returnRoute);
        }

        this.setUpEvents();
    }

    setUpEvents() {
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const input = document.getElementById('category-name');

        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => this.saveCategory(e));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const returnRoute = this.categoryType === 'income' ? '/income' : '/expenses';
                this.openNewRoute(returnRoute);
            });
        }

        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
                document.getElementById('category-error').classList.add('d-none');
            });
            input.focus();
        }
    }

    async saveCategory(e) {
        e.preventDefault();

        const input = document.getElementById('category-name');
        const feedback = document.getElementById('category-error');

        if (!input || !input.value.trim()) {
            input.classList.add('is-invalid');
            feedback.classList.remove('d-none');
            input.focus();
            return;
        }

        try {
            const endpoint = this.categoryType === 'income'
                ? `/categories/income/${this.categoryId}`
                : `/categories/expense/${this.categoryId}`;

            await ApiUtils.request('PUT', endpoint, {
                body: { title: input.value.trim() }
            });

            this.returnToCategories();

        } catch (error) {
            // console.log('Ошибка сохранения категории:', error);
            input.classList.add('is-invalid');
            feedback.classList.remove('d-none');
        }
    }

    returnToCategories() {
        const returnRoute = this.categoryType === 'income' ? '/income' : '/expenses';
        this.openNewRoute(returnRoute);
    }
}