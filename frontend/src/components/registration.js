import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils.js";
export class Registration {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/login');
        }

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.confirmPasswordElement = document.getElementById('confirm-password');
        this.commonErrorElement = document.getElementById('common-error');

        this.nameElement.classList.remove('is-invalid');
        this.lastNameElement.classList.remove('is-invalid');
        this.emailElement.classList.remove('is-invalid');
        this.passwordElement.classList.remove('is-invalid');
        this.confirmPasswordElement.classList.remove('is-invalid');
        this.commonErrorElement.style.display = 'none';

        document.getElementById('process-button').addEventListener('click', this.registration.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.lastNameElement.value) {
            this.lastNameElement.classList.remove('is-invalid');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.emailElement.value &&
            this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value &&
            this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.confirmPasswordElement.value &&
            this.confirmPasswordElement.value === this.passwordElement.value) {
            this.confirmPasswordElement.classList.remove('is-invalid');
        } else {
            this.confirmPasswordElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async registration(event) {
        event.preventDefault();
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            try {
                const result = await ApiUtils.request('POST', '/signup', {
                    body: {
                        name: this.nameElement.value,
                        lastName: this.lastNameElement.value,
                        email: this.emailElement.value,
                        password: this.passwordElement.value,
                        passwordRepeat: this.confirmPasswordElement.value,
                    }
                }, false);

                if (result.error || !result.response || (result.response &&
                    (!result.response.user.id || !result.response.user.name ||
                        !result.response.user.lastName || !result.response.user.email))) {
                    this.commonErrorElement.style.display = 'block';
                    return;
                }

                this.openNewRoute('/login');
            } catch (error) {
                console.error('Ошибка регистрации:', error);
                this.commonErrorElement.style.display = 'block';
                this.commonErrorElement.textContent = 'Ошибка регистрации: ' + (error.message || 'Неизвестная ошибка');
                this.commonErrorElement.style.display = 'block';
            }
        }
    }
}