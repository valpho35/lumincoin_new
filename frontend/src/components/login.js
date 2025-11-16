import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils.js";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.form = document.getElementById('login-form');
        if (!this.form) {
            console.error('Login form not found');
            return;
        }
        this.form.addEventListener('submit', this.login.bind(this));
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
    }

    async login(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clearErrors();

        const formData = {
            email: this.emailElement ? this.emailElement.value.trim() : '',
            password: this.passwordElement ? this.passwordElement.value : ''
        };

        if (!this.validateForm(formData)) {
            return;
        }

        try {
            const result = await ApiUtils.request('POST', '/login', {
                body: {
                    email: formData.email,
                    password: formData.password,
                    rememberMe: this.rememberMeElement ? this.rememberMeElement.checked : false
                }
            }, false);

            if (result && result.tokens && result.user) {
                AuthUtils.setAuthInfo(
                    result.tokens.accessToken,
                    result.tokens.refreshToken,
                    {
                        id: result.user.id,
                        name: result.user.name,
                        lastName: result.user.lastName
                    }
                );
                this.openNewRoute('/');
            } else {
                this.showCommonError('Ошибка при входе в систему');
            }

        } catch (error) {
            console.error('Login error:', error);

            if (error.message.includes('неверный') || error.message.includes('invalid') ||
                error.message.includes('401') || error.message.includes('Unauthorized')) {
                this.showCommonError('Неправильный email или пароль');
            } else if (error.message.includes('Ошибка валидации')) {
                this.showCommonError('Проверьте правильность введенных данных');
            } else {
                this.showCommonError('Ошибка соединения с сервером');
            }
        }
        return false;
    }

    validateForm(data) {
        let valid = true;

        if (!data.email) {
            this.showError('email', 'Введите email');
            valid = false;
        } else if (!this.isValidEmail(data.email)) {
            this.showError('email', 'Введите корректный email');
            valid = false;
        }

        if (!data.password) {
            this.showError('password', 'Введите пароль');
            valid = false;
        }

        return valid;
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.add('is-invalid');

        let errorElement = field.parentNode.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message invalid-feedback';
            field.parentNode.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    showCommonError(message) {
        let commonError = document.getElementById('common-error');
        if (!commonError) {
            commonError = document.createElement('div');
            commonError.id = 'common-error';
            commonError.className = 'alert alert-danger text-center mb-3';
            this.form.insertBefore(commonError, this.form.firstChild);
        }

        commonError.textContent = message;
        commonError.style.display = 'block';
    }

    setupErrorAutoClose(errorElement) {
        if (!errorElement.querySelector('.close-error')) {
            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'close-error btn-close float-end';
            closeButton.setAttribute('aria-label', 'Close');
            closeButton.onclick = () => errorElement.remove();
            errorElement.appendChild(closeButton);
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        const commonError = document.getElementById('common-error');
        if (commonError) commonError.remove();

        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }

    isValidEmail(email) {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
    }
}