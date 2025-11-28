import { ApiUtils } from "../utils/api-utils";

export interface Category {
    id: string;
    title: string;
    type?: 'income' | 'expense';
}

export class EditCategory {
    private openNewRoute: (url: string) => void;
    private categoryType: 'income' | 'expense';
    private categoryId: string | null;

    constructor(openNewRoute: (url: string) => void, type: string) {
        this.openNewRoute = openNewRoute;
        this.categoryType = type as 'income' | 'expense';
        this.categoryId = new URLSearchParams(window.location.search).get('id');

        if (!this.categoryId) {
            const returnRoute = this.categoryType === 'income' ? '/income' : '/expenses';
            this.openNewRoute(returnRoute);
            return;
        }
        this.loadAndSetup();
    }

    getCategoryTypeFromUrl(): 'income' | 'expense' {
        const urlParams = new URLSearchParams(window.location.search);
        const typeFromUrl = urlParams.get('type');

        if (!typeFromUrl) {
            const currentPath = window.location.pathname;
            if (currentPath.includes('income')) return 'income';
            if (currentPath.includes('expense')) return 'expense';
        }
        return (typeFromUrl as 'income' | 'expense') || 'income';
    }

    async loadAndSetup(): Promise<void> {
        if (!this.categoryId) {
            const returnRoute = this.categoryType === 'income' ? '/income' : '/expenses';
            return this.openNewRoute(returnRoute);
        }

        try {
            const endpoint = this.categoryType === 'income'
                ? `/categories/income/${this.categoryId}`
                : `/categories/expense/${this.categoryId}`;

            const category: Category = await ApiUtils.request('GET', endpoint);

            const input = document.getElementById('category-name') as HTMLInputElement;
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

    setUpEvents(): void {
        const saveBtn = document.getElementById('save-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const input = document.getElementById('category-name');
        const feedback = document.getElementById('category-error');

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
                if (feedback) feedback.classList.add('d-none');
            });
            input.focus();
        }
    }

    async saveCategory(e: Event): Promise<void> {
        e.preventDefault();

        const input = document.getElementById('category-name') as HTMLInputElement;
        const feedback = document.getElementById('category-error');

        if (!input || !input.value.trim()) {
            input.classList.add('is-invalid');
            if (feedback) feedback.classList.remove('d-none');
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
            if (feedback) feedback.classList.remove('d-none');
        }
    }

    returnToCategories(): void {
        const returnRoute = this.categoryType === 'income' ? '/income' : '/expenses';
        this.openNewRoute(returnRoute);
    }
}