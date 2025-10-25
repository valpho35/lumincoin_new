import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');

        this.emailElement.classList.remove('is-invalid');
        this.passwordElement.classList.remove('is-invalid');
        this.commonErrorElement.style.display = 'none';

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;

        if (this.emailElement) {
            this.emailElement.classList.remove('is-invalid');
        }
        if (this.passwordElement) {
            this.passwordElement.classList.remove('is-invalid');
        }

        if (this.emailElement && this.emailElement.value &&
            this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
        } else if (this.emailElement) {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }

        if (this.passwordElement && this.passwordElement.value) {
        } else if (this.passwordElement) {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    async login(event) {
        event.preventDefault();

        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        if (this.validateForm()) {
            const result = await HttpUtils.request('/login', 'POST', {
                email: this.emailElement ? this.emailElement.value : '',
                password: this.passwordElement ? this.passwordElement.value : '',
                rememberMe: this.rememberMeElement ? this.rememberMeElement.checked : false
            });

            if (result.error || !result.response || (result.response &&
                (!result.response.tokens.accessToken || !result.response.tokens.refreshToken ||
                    !result.response.user.id || !result.response.user.name ||
                    !result.response.user.lastName))) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }
                return;
            }

            AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                id: result.response.user.id,
                name: result.response.user.name,
                lastName: result.response.user.lastName
            });

            this.openNewRoute('/');
        }
    }
}