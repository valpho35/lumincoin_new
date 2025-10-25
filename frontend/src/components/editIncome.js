import { ApiUtils } from "../utils/api-utils.js";
export class EditIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryId = new URLSearchParams(window.location.search).get('id');

        this.loadAndSetup();
    }

    async loadAndSetup() {
        if (!this.categoryId) {
            return this.openNewRoute('/income');
        }
        try {
            const category = await ApiUtils.get(`/categories/income/${this.categoryId}`);
            const input = document.querySelector('.form-control')
            if (input) {
                input.value = category.title;
            }
        } catch (error) {
            console.log('ошибка загрузки категории');
        }

        this.setUpEvents();
    }

    setUpEvents() {
        const saveBtn = document.querySelector('.btn-success');
        const cancelBtn = document.querySelector('.btn-danger');
        const input = document.querySelector('.form-control');

        if (saveBtn) {
            saveBtn.onclick = (e) => this.saveCategory(e);
        }

        if (cancelBtn) {
            cancelBtn.onclick = () => this.openNewRoute('/income');
        }

        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
            });
        }
    }

    async saveCategory() {
        // e.preventDefault();

        const input = document.querySelector('.form-control');
        const feedback = document.querySelector('.invalid-feedback');
        if (!input) return;

        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            feedback.classList.remove('d-none');
            input.focus();
            return;
        }

        try {
            await ApiUtils.put(`/categories/income/${this.categoryId}`, { title: input.value.trim() });
            this.openNewRoute('/income');
        } catch (error) {
            console.log('Ошибка сохранения');
            input.classList.add('is-invalid');
            feedback.classList.remove('d-none');
        }
    }
}