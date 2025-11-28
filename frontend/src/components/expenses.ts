import { ApiUtils } from "../utils/api-utils";
export class Expenses {
    private openNewRoute: (url: string) => void;
    private categoryToDelete: string | null = null;

    constructor(openNewRoute: (url: string) => void) {
        this.openNewRoute = openNewRoute;
        this.init();
    }

    async init() {
        await this.showCategories();
        this.setUpEvents();
    }

    async showCategories() {
        try {
            const response = await ApiUtils.request('GET', '/categories/expense');
            const categories = Array.isArray(response) ? response : [];
            const container = document.querySelector('.bookmarks');

            if (!container) {
                return;
            }

            container.innerHTML = '';

            categories.forEach((cat: any) => {
                container.innerHTML += `
                     <div class="bookmark">
                        <div class="bookmark-title">${cat.title}</div>
                        <div class="actions">
                            <a href="/edit-category?type=expense&id=${cat.id}" class="btn btn-primary">Редактировать</a>
                            <button class="btn btn-danger" data-id="${cat.id}">Удалить</button>
                        </div>
                    </div>
                `;
            });

            container.innerHTML += `
                <a href="/create-category?type=expense">
                    <div class="bookmark add">
                        <div>+</div>
                    </div>
                </a>
            `;

        } catch (error) {
            console.error('Ошибка загрузки категорий расходов:', error);
        }
    }

    setUpEvents() {
        const popupSuccess = document.querySelector('.popup .btn-success');
        const popupDanger = document.querySelector('.popup .btn-danger');
        const popupContainer = document.querySelector('.popup-container');

        if (popupSuccess) {
            popupSuccess.addEventListener('click', () => this.confirmDelete());
        }
        if (popupDanger) {
            popupDanger.addEventListener('click', () => this.hidePopup());
        }
        if (popupContainer) {
            popupContainer.addEventListener('click', (e) => {
                if ((e.target as Element).classList.contains('popup-container')) {
                    this.hidePopup();
                }
            });
        }

        const bookmarks = document.querySelector('.bookmarks');
        if (bookmarks) {
            bookmarks.addEventListener('click', (e) => {
                const target = e.target as Element;
                if (target.classList.contains('btn-danger')) {
                    const categoryId = target.getAttribute('data-id');
                    if (categoryId) {
                        this.showDeletePopup(categoryId);
                    }
                }
            });
        }
    }

    showDeletePopup(categoryId: string) {
        this.categoryToDelete = categoryId;
        const popupContainer = document.querySelector('.popup-container') as HTMLElement;
        if (popupContainer) popupContainer.style.display = 'block';
    }

    hidePopup() {
        this.categoryToDelete = null;
        const popupContainer = document.querySelector('.popup-container') as HTMLElement;
        if (popupContainer) popupContainer.style.display = 'none';
    }

    async confirmDelete() {
        if (!this.categoryToDelete) return;

        try {
            await ApiUtils.request('DELETE', `/categories/expense/${this.categoryToDelete}`);
            this.hidePopup();
            await this.showCategories();
        } catch (error) {
            this.hidePopup();
        }
    }
}