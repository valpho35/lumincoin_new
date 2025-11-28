import config from "../config/common-config";
import { AuthUtils } from "./auth-utils";

export interface HttpRequestParams {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
}

export interface HttpResponse {
    error: boolean;
    response: any;
}

export class HttpUtils {
    static async request(url: string, method: string = 'GET', body: any = null, useToken: boolean = true): Promise<HttpResponse> {
        const result: HttpResponse = {
            error: false,
            response: null
        };

        const params: HttpRequestParams & { headers: Record<string, string> } = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'applicaion/json',
            },
        };

        if (useToken) {
            const token = AuthUtils.getAccessToken;
            if (token) {
                params.headers['Authorization'] = `Bearer ${token}`;
            }
        }

        if (body) {
            (params as any).body = JSON.stringify(body);
        }

        let response: Response | null = null;
        try {
            response = await fetch(config.api + url, params as RequestInit);

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

    static handleUnauthorized(): void {
        AuthUtils.removeAuthInfo();
        window.location.href = '/login';
    }
}