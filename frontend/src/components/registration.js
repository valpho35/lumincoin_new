import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils.js";

export class Registration {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            openNewRoute('/login');
            return;
        }

        this.form = document.getElementById('registration-form');
        this.form.addEventListener('submit', this.register.bind(this));
    }

    async register(event) {
        event.preventDefault();
        this.clearErrors();

        const formData = {
            name: document.getElementById('name').value.trim(),
            lastName: document.getElementById('last-name').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirm-password').value
        };

        if (!this.validateForm(formData)) {
            return;
        }

        try {
            const result = await ApiUtils.request('POST', '/signup', {
                body: {
                    name: formData.name,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    passwordRepeat: formData.confirmPassword
                }
            }, false);

            if (result && result.user) {
                alert('Регистрация успешна! Теперь войдите в систему.');
                this.openNewRoute('/login');
            }

        } catch (error) {
            console.error('Registration error:', error);

            if (error.message.includes('Почта уже существует')) {
                this.showError('email', 'Этот email уже зарегистрирован');
                this.showCommonError('Этот email уже зарегистрирован. Используйте другой email или войдите в существующий аккаунт.');
            } else {
                this.showCommonError('Ошибка соединения с сервером');
            }
        }
    }

    validateForm(data) {
        let valid = true;

        if (!data.name) {
            this.showError('name', 'Введите имя');
            valid = false;
        }

        if (!data.lastName) {
            this.showError('last-name', 'Введите фамилию');
            valid = false;
        }

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
        } else if (!this.isValidPassword(data.password)) {
            this.showError('password', 'Минимум 8 символов: цифры, строчные и заглавные латинские буквы');
            valid = false;
        }

        if (!data.confirmPassword) {
            this.showError('confirm-password', 'Подтвердите пароль');
            valid = false;
        } else if (data.password !== data.confirmPassword) {
            this.showError('confirm-password', 'Пароли не совпадают');
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

            const title = document.querySelector('.title');
            if (title && title.nextElementSibling) {
                title.parentNode.insertBefore(commonError, title.nextElementSibling);
            } else {
                this.form.parentNode.insertBefore(commonError, this.form);
            }
        }

        commonError.innerHTML = `
        <div style="text-align: center; padding: 10px;">
            <strong>Этот email уже зарегистрирован</strong><br>
            <small>Используйте другой email или войдите в существующий аккаунт</small>
        </div>
    `;
        commonError.style.display = 'block';
        commonError.style.width = '397px';
        commonError.style.margin = '0 auto 20px auto';
        commonError.style.whiteSpace = 'normal';
        commonError.style.wordWrap = 'break-word';
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

    isValidPassword(password) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password);
    }
}