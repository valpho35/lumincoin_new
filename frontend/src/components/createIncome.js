import { ApiUtils } from "../utils/api-utils.js";
import { AuthUtils } from "../utils/auth-utils.js";
export class CreateIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        if (!accessToken) {
            return this.openNewRoute('/login');
        }

        this.setUpEvents();
    }

    setUpEvents() {
        const saveBtn = document.querySelector('.btn-success');
        const cancelBtn = document.querySelector('.btn-danger');
        const input = document.querySelector('.form-control');
        const feedback = document.querySelector('.invalid-feedback');

        if (saveBtn) {
            saveBtn.onclick = () => this.createCategory();
        }

        if (cancelBtn) {
            cancelBtn.onclick = () => this.openNewRoute('/income');
        }

        if (input) {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
                feedback.classList.add('d-none');
            });
            input.focus();
        }
    }

    async createCategory() {
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
            await ApiUtils.post('/categories/income', { title: input.value.trim() });
            this.openNewRoute('/income');
        } catch (error) {
            console.log('Ошибка создания категории:', error);
            input.classList.add('is-invalid');
            feedback.classList.remove('d-none');
        }
    }
}
