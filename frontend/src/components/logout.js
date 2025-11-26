import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils.js";
export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.logout();
    }

    async logout() {
        const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        if (refreshToken) {
            try {
                await ApiUtils.request('POST', '/logout', {
                    body: {
                    refreshToken: refreshToken,
                    }
                });
            } catch (error) {
            }
        }

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}