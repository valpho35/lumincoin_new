import { AuthUtils } from "../utils/auth-utils";
export class Registration {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo('accessToken')) {
            return this.openNewRoute('/');
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
            const response = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'applicaion/json',
                },
                body: JSON.stringify({
                    name: this.nameElement.value,
                    lastName: this.lastNameElement.value,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                })
            });

            const result = await response.json();
            if (result.error || !result.user.id || !result.user.name || !result.user.lastName || !result.user.email) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(result.tokens.accessToken, result.tokens.refreshToken, {id: result.user.id, name: result.user.name, lastName: result.user.lastName, email: result.user.email});
           
            this.openNewRoute('/login');
        }
    }

}