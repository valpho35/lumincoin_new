import { AuthUtils } from './auth-utils';
import config from '../config/common-config';

export class ApiUtils {
    static async request(method: string, url: string, options: any = {}, useToken: boolean = true): Promise<any> {
        const fullUrl = config.api + url;

        try {
            const requestOptions: any = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };
            if (useToken) {
                const token = AuthUtils.getAccessToken();
                if (token) {
                    requestOptions.headers['x-auth-token'] = token;
                }
            }

            if (options.body) {
                requestOptions.body = JSON.stringify(options.body);
            }

            const response = await fetch(fullUrl, requestOptions);

            const responseText = await response.text();
            let result;
            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch {
                result = { message: responseText };
            }

            if (!response.ok) {
                console.error('Server error:', {
                    status: response.status,
                    statusText: response.statusText,
                    url: fullUrl,
                    details: result
                });

                if (response.status === 401) {
                    AuthUtils.removeAuthInfo();
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    throw new Error('Необходима авторизация');
                }

                if (response.status === 400) {
                    const errorMessage = result.message || result.error || JSON.stringify(result);
                    throw new Error(`Ошибка валидации: ${errorMessage}`);
                }

                if (response.status === 404) {
                    throw new Error('Ресурс не найден');
                }

                if (response.status >= 500) {
                    throw new Error('Внутренняя ошибка сервера');
                }
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }
            return result;

        } catch (error: any) {
            throw error;
        }
    }
}