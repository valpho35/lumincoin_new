import { ApiUtils } from "../utils/api-utils.js";
export class Expenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryToDelete = null;

        this.init();
    }

    async init() {
        await this.showCategories();
        this.setUpEvents();
    }

    async showCategories() {
        try {
            const categories = await ApiUtils.request('GET', '/categories/expense');

        //      // Фильтруем дефолтные категории только на странице просмотра
        // const defaultTitles = ['Зарплата', 'Фриланс', 'Инвестиции', 'Подарки'];
        // const filteredCategories = categories.filter(cat => 
        //     !defaultTitles.includes(cat.title)
        // );
        
            const container = document.querySelector('.bookmarks');

            if (!container) {
                return;
            }

            container.innerHTML = '';

            categories.forEach(cat => {
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
            popupSuccess.onclick = () => this.confirmDelete();
        }
        if (popupDanger) {
            popupDanger.onclick = () => this.hidePopup();
        }
        if (popupContainer) {
            popupContainer.onclick = (e) => {
                if (e.target.classList.contains('popup-container')) {
                    this.hidePopup();
                }
            };
        }

        const bookmarks = document.querySelector('.bookmarks');
        if (bookmarks) {
            bookmarks.onclick = (e) => {
                if (e.target.classList.contains('btn-danger')) {
                    const categoryId = e.target.getAttribute('data-id');
                    if (categoryId) {
                        this.showDeletePopup(categoryId);
                    }
                }
            };
        }
    }

    showDeletePopup(categoryId) {
        this.categoryToDelete = categoryId;
        document.querySelector('.popup-container').style.display = 'block';
    }

    hidePopup() {
        this.categoryToDelete = null;
        document.querySelector('.popup-container').style.display = 'none';
    }

    async confirmDelete() {
        if (!this.categoryToDelete) return;

        try {
            await ApiUtils.request('DELETE', `/categories/expense/${this.categoryToDelete}`);
            this.hidePopup();
            await this.showCategories();
        } catch (error) {
            // console.error('Ошибка удаления категории:', error);
            this.hidePopup();
        }
    }
}