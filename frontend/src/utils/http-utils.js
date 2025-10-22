import config from "../config/common-config";
import { AuthUtils } from "./auth-utils.js";

export class HttpUtils {
    static async request(url, method = 'GET', body = null, useToken = true) {
        const result = {
            error: false,
            response: null
        };

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'applicaion/json',
            },
        };

        if (useToken) {
            const token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['Authoriazaion'] = `Bearer ${token}`;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);

            if (response.status === 401) {
                this.handleUnauthorized();
                result.error = true;
                return result;
            }
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
        }

        return result;
    }

    static handleUnauthorized() {
        AuthUtils.removeAuthInfo();
        window.location.href = '/login';
    }
}