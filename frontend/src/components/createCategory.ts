import { ApiUtils } from "../utils/api-utils";

export class CreateCategory {
    private openNewRoute: (url: string) => void;
    private categoryType: string;

    constructor(openNewRoute: (url: string) => void, type: string) {
        this.openNewRoute = openNewRoute;
        this.categoryType = type;
    
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
        const input = document.getElementById('category-name') as HTMLInputElement;

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
                const feedback = document.getElementById('category-error');
                if (feedback) feedback.classList.add('d-none');
            });
        }
    }

    private updateUI(): void {
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

    private async createCategory(): Promise<void> {
        const input = document.getElementById('category-name') as HTMLInputElement;
        const feedback = document.getElementById('category-error');

        if (!input) {
            console.error('Инпут не найден');
            return;
        }

        const categoryName = input.value.trim();

        if (!categoryName) {
            input.classList.add('is-invalid');
            if (feedback) {
                feedback.textContent = 'Название категории не может быть пустым';
                feedback.classList.remove('d-none');
            }
            input.focus();
            return;
        }
        let endpoint: string;
    if (this.categoryType === 'income') {
        endpoint = '/categories/income'; 
    } else if (this.categoryType === 'expense') {
        endpoint = '/categories/expense';
    } else {
        alert('Неизвестный тип категории');
        return;
    }


        try {
            await ApiUtils.request('POST', endpoint, {
                body: { title: categoryName }
            });

            this.returnToCategories();
        } catch (error: any) {
            console.log(`Ошибка создания категории ${this.categoryType}:`, error);

            let errorMessage = 'Ошибка при создании категории';
            if (error.message && error.message.includes('Cannot POST')) {
                errorMessage = 'Сервер недоступен. Проверьте API endpoint.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            input.classList.add('is-invalid');
            if (feedback) {
                feedback.textContent = errorMessage;
                feedback.classList.remove('d-none');
            }
        }
    }

    private returnToCategories(): void {
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