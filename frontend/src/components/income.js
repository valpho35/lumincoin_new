import { ApiUtils } from '../utils/api-utils.js';
export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryToDelete = null;
        this.init();
    }

    async init() {
        await this.showCategories();
        this.setupEvents();
    }

    async showCategories() {
        try {
            const categories = await ApiUtils.get('/categories/income');
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
                            <a href="/edit-income-cat?id=${cat.id}" class="btn btn-primary">Редактировать</a>
                            <button class="btn btn-danger" data-id="${cat.id}">Удалить</button>
                        </div>
                    </div>
                `;
            });

            container.innerHTML += `
                <a href="/create-income-cat">
                    <div class="bookmark add">
                        <div>+</div>
                    </div>
                </a>
            `;

        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
            this.showError('Не удалось загрузить категории');
        }
    }

    setupEvents() {
        document.querySelector('.popup .btn-success').onclick = () => this.confirmDelete();
        document.querySelector('.popup .btn-danger').onclick = () => this.hidePopup();

        document.querySelector('.popup-container').onclick = (e) => {
            if (e.target.classList.contains('popup-container')) {
                this.hidePopup();
            }
        };
        document.querySelector('.bookmarks').onclick = (e) => {
            if (e.target.classList.contains('btn-danger')) {
                const categoryId = e.target.getAttribute('data-id');
                if (categoryId) {
                    this.showDeletePopup(categoryId);
                }
            }
        };
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
            await ApiUtils.delete(`/categories/income/${this.categoryToDelete}`);
            this.hidePopup();
            await this.showCategories();
        } catch (error) {
            this.hidePopup();
        }
    }
}