import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";
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

        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.confirmPasswordElement.value && this.confirmPasswordElement.value === this.passwordElement.value) {
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
            const result = await HttpUtils.request('/signup', 'POST', {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.confirmPasswordElement.value,
            });

            if (result.error || !result.response || (result.response && (!result.response.user.id || !result.response.user.name || !result.response.user.lastName || !result.response.user.email))) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            this.openNewRoute('/login');

            // AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, { id: result.response.user.id, name: result.response.user.name, lastName: result.response.user.lastName, email: result.response.user.email });
        }
    }
}