import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.logout();
    }

    async logout() {
        const refreshToken = AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey);

        if (refreshToken) {
            try {
                await HttpUtils.request('/logout', 'POST', {
                    refreshToken: refreshToken,
                });
            } catch (error) {
            }
        }

        AuthUtils.removeAuthInfo();

        this.openNewRoute('/login');
    }
}


// export class Logout {
//     constructor(openNewRoute) {
//         this.openNewRoute = openNewRoute;
//         this.logout();
//     }

//     logout() {
//         AuthUtils.removeAuthInfo();
//         this.openNewRoute('/login');
//     }
// }