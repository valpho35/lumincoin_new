// import { AuthUtils } from "../utils/auth-utils.js";
// import { ApiUtils } from "../utils/api-utils.js";

// export class Layout {
//     constructor() {
//         this.init();
//     }

//     async init() {
//         this.updateUserInfo();
//         await this.loadBalance();
//     }

//     updateUserInfo() {
//         const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
//         if (userInfo) {
//             try {
//                 const userData = JSON.parse(userInfo);
//                 const userNameElement = document.querySelector('.user .dropdown-toggle .user-name');
//                 if (userNameElement) {
//                     userNameElement.textContent = `${userData.name} ${userData.lastName}`;
//                 }
//             } catch (e) {
//                 console.error('Ошибка данных пользователя:', e);
//             }
//         }
//     }

//     async loadBalance() {
//         try {
//             const balanceData = await ApiUtils.request('GET', '/balance');
//             this.updateBalanceDisplay(balanceData.balance);
//             if (balanceData && typeof balanceData.balance === 'number') {
//                 this.updateBalanceDisplay(balanceData.balance);
//             } else {
//                 console.error('Invalid balance data:', balanceData);
//                 this.updateBalanceDisplay(0);
//             }
//         } catch (error) {
//             console.error('Ошибка загрузки баланса:', error);
//             this.updateBalanceDisplay(0);
//         }
//     }

//     updateBalanceDisplay(balance) {
//         const balanceElement = document.querySelector('.balance .amount');
//         // if (balanceElement) {
//         //     balanceElement.textContent = `${balance}$`;
//         // }
//         if (balanceElement) {
//             // Форматируем баланс для лучшего отображения
//             const formattedBalance = new Intl.NumberFormat('ru-RU', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//             }).format(balance);
//             balanceElement.textContent = `${formattedBalance}$`;
//         }
//     }

//     static async refreshBalance() {
//         try {
//             const balanceData = await ApiUtils.request('GET', '/balance');
//             const balanceElement = document.querySelector('.balance .amount');
//             // if (balanceElement) {
//             //     balanceElement.textContent = `${balanceData.balance}$`;
//             // }
//             if (balanceElement && balanceData && typeof balanceData.balance === 'number') {
//                 const formattedBalance = new Intl.NumberFormat('ru-RU', {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2
//                 }).format(balanceData.balance);
//                 balanceElement.textContent = `${formattedBalance}$`;
//             }
//         } catch (error) {
//             console.error('Ошибка обновления баланса:', error);
//         }
//     }
// }

import { AuthUtils } from "../utils/auth-utils.js";
import { ApiUtils } from "../utils/api-utils.js";

export class Layout {
    constructor() {
        this.init();
    }

    async init() {
        this.updateUserInfo();
        await this.forceRefreshBalance();
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

    async forceRefreshBalance() {
        try {
            console.log('Force refreshing balance...');
            const balanceData = await ApiUtils.request('GET', '/balance');
            console.log('Balance data received:', balanceData);
            
            if (balanceData && typeof balanceData.balance === 'number') {
                this.updateBalanceDisplay(balanceData.balance);
            } else {
                console.error('Invalid balance data, setting to 0');
                this.updateBalanceDisplay(0);
            }
        } catch (error) {
            console.error('Ошибка загрузки баланса:', error);
            this.updateBalanceDisplay(0);
        }
    }

    updateBalanceDisplay(balance) {
        const balanceElement = document.querySelector('.balance .amount');
        if (balanceElement) {
            const formattedBalance = new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(balance);
            balanceElement.textContent = `${formattedBalance}$`;
        }
    }

    static async refreshBalance() {
        try {
            console.log('Refreshing balance...');
            const balanceData = await ApiUtils.request('GET', '/balance');
            console.log('Refreshed balance data:', balanceData);
            
            const balanceElement = document.querySelector('.balance .amount');
            if (balanceElement && balanceData && typeof balanceData.balance === 'number') {
                const formattedBalance = new Intl.NumberFormat('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(balanceData.balance);
                balanceElement.textContent = `${formattedBalance}$`;
            }
        } catch (error) {
            console.error('Ошибка обновления баланса:', error);
        }
    }
}