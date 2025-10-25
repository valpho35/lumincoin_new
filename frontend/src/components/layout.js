import { AuthUtils } from "../utils/auth-utils";

export class Layout {
    constructor() {
        this.updateUserInfo();
    }

    updateUserInfo() {
        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
        if (userInfo) {
            try {
                const userData = JSON.parse(userInfo);
                const userNameElement = document.querySelector('.user .dropdown-toggle .user-name');

                if (userNameElement && userData.name && userData.lastName) {
                    userNameElement.textContent = `${userData.name} ${userData.lastName}`;
                }
            } catch (e) {
                console.error('Error in user info:', e);
            }
        }
    }
}