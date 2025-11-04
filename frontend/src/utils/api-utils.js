import { AuthUtils } from './auth-utils.js';
import config from '../config/common-config.js';

export class ApiUtils {
    static async request(method, url, options = {}, useToken = true) {
        const fullUrl = config.api + url;


        try {
            if (!options.headers) {
                options.headers = {};
            }

            options.headers['Content-Type'] = 'application/json';

            const token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (useToken) {
                options.headers['x-auth-token'] = token;
            }

            if (options.body) {
                options.body = JSON.stringify(options.body);
            }

            options.method = method;

            const response = await fetch(fullUrl, options);
           
            if (response.status === 401) {
                AuthUtils.removeAuthInfo();
                window.location.href = '/login';
                return;
            }

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

                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            throw new Error('Не удалось подключится к серверу: ' + error.message);
        }
    }

    // static get(url) {
    //     return this.request(url);
    // }

    // static post(url, data) {
    //     return this.request(url, {
    //         method: 'POST',
    //         body: data
    //     });
    // }
    
    // static put(url, data) {
    //     return this.request(url, {
    //         method: 'PUT',
    //         body: data
    //     });
    // }

    // static delete(url) {
    //     return this.request(url, {
    //         method: 'DELETE'
    //     });
    // }
}