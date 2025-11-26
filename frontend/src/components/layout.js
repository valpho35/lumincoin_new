import { AuthUtils } from "../utils/auth-utils.js";
import { ApiUtils } from "../utils/api-utils.js";

export class Layout {
    constructor() {
        this.init();
    }

    async init() {
        this.updateUserInfo();
        await this.loadBalance();
    }

    updateUserInfo() {
        const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
        if (userInfo) {
            try {
                const userData = JSON.parse(userInfo);
                const userNameElement = document.querySelector('.user .dropdown-toggle .user-name');
                if (userNameElement) {
                    userNameElement.textContent = `${userData.name} ${userData.lastName}`;
                }
            } catch (e) {
                console.error('Ошибка данных пользователя:', e);
            }
        }
    }

    async loadBalance() {
        try {
            const balanceData = await ApiUtils.request('GET', '/balance');
            this.updateBalanceDisplay(balanceData.balance);
        } catch (error) {
            console.error('Ошибка загрузки баланса:', error);
            this.updateBalanceDisplay(0);
        }
    }

    updateBalanceDisplay(balance) {
        const balanceElement = document.querySelector('.balance .amount');
        if (balanceElement) {
            balanceElement.textContent = `${balance}$`;
        }
    }

    static async refreshBalance() {
        try {
            const balanceData = await ApiUtils.request('GET', '/balance');
            const balanceElement = document.querySelector('.balance .amount');
            if (balanceElement) {
                balanceElement.textContent = `${balanceData.balance}$`;
            }
        } catch (error) {
            console.error('Ошибка обновления баланса:', error);
        }
    }
}