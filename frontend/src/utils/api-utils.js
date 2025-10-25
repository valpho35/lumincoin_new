import { AuthUtils } from './auth-utils.js';

export class ApiUtils {
    static async request(url, options = {}) {
        const baseUrl = 'http://localhost:3000/api';
        const fullUrl = baseUrl + url;


        try {
            const token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            options.headers = {
                'Content-Type': 'application/json',
                'x-auth-token': token,
                ...options.headers
            };

            if (options.body) {
                options.body = JSON.stringify(options.body);
            }

            const response = await fetch(fullUrl, options);
           
            if (response.status === 401) {
                AuthUtils.removeAuthInfo();
                window.location.href = '/login';
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            throw new Error('Не удалось подключится к серверу: ' + error.message);
        }
    }

    static get(url) {
        return this.request(url);
    }

    static post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: data
        });
    }
    
    static put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: data
        });
    }

    static delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    }
}