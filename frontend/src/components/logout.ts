import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils";

export class Logout {
     private openNewRoute: (url: string) => void;

    constructor(openNewRoute: (url: string) => void) {
        this.openNewRoute = openNewRoute;
        this.logout();
    }

    async logout(): Promise<void> {
        const refreshToken = AuthUtils.getRefreshToken();

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

     static async quickLogout(openNewRoute: (url: string) => void): Promise<void> {
        const logout = new Logout(openNewRoute);
        await logout.logout();
    }
}