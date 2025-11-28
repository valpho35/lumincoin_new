export class Validation {
    static validateInput(input: string, regExp: RegExp): boolean {
        // input.classList.add('is-invalid');
        return regExp.test(input);
    }

     static isValidEmail(email: string): boolean {
        const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        return this.validateInput(email, emailRegex);
    }

    static isValidPassword(password: string): boolean {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return this.validateInput(password, passwordRegex);
    }
}