import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils";

interface LoginFormData {
    email: string;
    password: string;
}

export class Login {
    private openNewRoute: (url: string) => void;
    private form: HTMLFormElement | null;
    private emailElement: HTMLInputElement | null;
    private passwordElement: HTMLInputElement | null;
    private rememberMeElement: HTMLInputElement | null;

    constructor(openNewRoute: (url: string) => void) {
        this.openNewRoute = openNewRoute;
        this.form = document.getElementById('login-form') as HTMLFormElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement;

        if (AuthUtils.isAuthenticated()) {
            console.log('🔐 User already authenticated, redirecting to /');
            this.openNewRoute('/');
            // return;
        }

        if (!this.form) {
            return;
        }

        this.form.addEventListener('submit', this.login.bind(this));
    }

    async login(event: Event): Promise<void> {
        event.preventDefault();
        event.stopPropagation();
        this.clearErrors();

        const formData: LoginFormData = {
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

        } catch (error: any) {
            if (error.message.includes('неверный') || error.message.includes('invalid') ||
                error.message.includes('401') || error.message.includes('Unauthorized')) {
                this.showCommonError('Неправильный email или пароль');
            } else if (error.message.includes('Ошибка валидации')) {
                this.showCommonError('Проверьте правильность введенных данных');
            } else {
                this.showCommonError('Ошибка соединения с сервером');
            }
        }
    }

    validateForm(data: LoginFormData): boolean {
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

    showError(fieldId: string, message: string): void {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.add('is-invalid');

        let errorElement = document.getElementById(`${fieldId}-error`);

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = `${fieldId}-error`;
            errorElement.className = 'invalid-feedback';
            field.parentNode?.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    showCommonError(message: string): void {
        let commonError = document.getElementById('common-error');

        if (!commonError) {
            commonError = document.createElement('div');
            commonError.id = 'common-error';
            commonError.className = 'alert alert-danger';

            if (this.form && this.form.parentNode) {
                this.form.parentNode.insertBefore(commonError, this.form);
            }
        }

        commonError.textContent = message;
        commonError.style.display = 'block';
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
}