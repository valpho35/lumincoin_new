import { AuthUtils } from './auth-utils.js';
import config from '../config/common-config.js';

export class ApiUtils {
    static async request(method, url, options = {}, useToken = true) {
        const fullUrl = config.api + url;

        console.log(`API Request: ${method} ${fullUrl}`, options);

        try {
            options.method = method;
            options.headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            const token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                options.headers['x-auth-token'] = token;
            }

            if (options.body) {
                options.body = JSON.stringify(options.body);
            }

            const response = await fetch(fullUrl, options);
            if (!response.ok) {
                let errorDetails;
                try {
                    errorDetails = await response.json();
                } catch (e) {
                    errorDetails = await response.text();
                }

                console.error('Server error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: fullUrl,
                    details: errorDetails
                });

            // Редирект на логин при 401
            if (response.status === 401) {
                AuthUtils.removeAuthInfo();
                // window.location.href = '/login';
                // return;
            }
            if (response.status === 400) {
                    const errorMessage = errorDetails.message || errorDetails.error || JSON.stringify(errorDetails);
                    throw new Error(`Ошибка валидации: ${errorMessage}`);
                }

                if (response.status === 404) {
                    throw new Error('Ресурс не найден');
                }

                if (response.status >= 500) {
                    throw new Error('Внутренняя ошибка сервера');
                }

                throw new Error(`HTTP error! status: ${response.status}`);
            }
             return await response.json();

        } catch (error) {
            console.error('API Request failed:', {
                method,
                url: fullUrl,
                error: error.message
            });
            throw error;
        }
    }
}