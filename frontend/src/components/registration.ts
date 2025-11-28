import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils";

interface RegistrationFormData {
    name: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export class Registration {
    private openNewRoute: (url: string) => void;
    private form: HTMLFormElement;

    constructor(openNewRoute: (url: string) => void) {
        this.openNewRoute = openNewRoute;
        this.form = document.getElementById('registration-form') as HTMLFormElement;

        if (AuthUtils.getAccessToken()) {
            openNewRoute('/login');
            return;
        }
      
        this.form.addEventListener('submit', this.register.bind(this));
    }

    async register(event: Event): Promise<void> {
        event.preventDefault();
        this.clearErrors();

        const formData: RegistrationFormData = {
            name: (document.getElementById('name') as HTMLInputElement).value.trim(),
            lastName: (document.getElementById('last-name') as HTMLInputElement).value.trim(),
            email: (document.getElementById('email') as HTMLInputElement).value.trim(),
            password: (document.getElementById('password') as HTMLInputElement).value,
            confirmPassword: (document.getElementById('confirm-password') as HTMLInputElement).value
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

        } catch (error: any) {
            console.error('Registration error:', error);

            if (error.message.includes('Почта уже существует')) {
                this.showError('email', 'Этот email уже зарегистрирован');
                this.showCommonError('Этот email уже зарегистрирован. Используйте другой email или войдите в существующий аккаунт.');
            } else {
                this.showCommonError('Ошибка соединения с сервером');
            }
        }
    }

    validateForm(data: RegistrationFormData): boolean {
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

    showError(fieldId: string, message: string): void {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.add('is-invalid');

        let errorElement = field.parentElement?.nextElementSibling as HTMLElement;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message invalid-feedback';
            field.parentElement?.parentElement?.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    showCommonError(message: string): void {
        let commonError = document.getElementById('common-error');
        if (!commonError) {
            commonError = document.createElement('div');
            commonError.id = 'common-error';
            commonError.className = 'alert alert-danger text-center mb-3';

            const title = document.querySelector('.title');
            if (title && title.nextElementSibling) {
                title.parentNode?.insertBefore(commonError, title.nextElementSibling);
            } else {
                this.form.parentNode?.insertBefore(commonError, this.form);
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

    clearErrors(): void {
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        const commonError = document.getElementById('common-error');
        if (commonError) commonError.remove();

        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }

    isValidEmail(email: string): boolean {
        return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
    }

    isValidPassword(password: string): boolean {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password);
    }
}