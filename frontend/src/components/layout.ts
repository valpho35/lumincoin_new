import { AuthUtils } from "../utils/auth-utils";
import { ApiUtils } from "../utils/api-utils";
import { Logout } from "./logout";

export class Layout {
    constructor(private openNewRoute: (url: string) => void) {
        this.init();
        this.setupLogout();
    }

    async init(): Promise<void> {
        this.updateUserInfo();
        await this.loadBalance();
    }

    updateUserInfo(): void {
        const userInfo = AuthUtils.getUserInfo();
        if (userInfo) {
            const userNameElement = document.querySelector('.user .dropdown-toggle .user-name');
            if (userNameElement) {
                userNameElement.textContent = `${userInfo.name} ${userInfo.lastName}`;
            }
        }
    }

    async loadBalance(period?: string, dateFrom?: string, dateTo?: string): Promise<void> {
        try {
            let url = '/balance';
            const params = new URLSearchParams();

            if (period && period !== 'all') {
                params.append('period', period);
            }

            if (dateFrom) {
                params.append('dateFrom', dateFrom);
            }

            if (dateTo) {
                params.append('dateTo', dateTo);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const balanceData = await ApiUtils.request('GET', url);
            this.updateBalanceDisplay(balanceData.balance || 0);
        } catch (error) {
            console.error('Ошибка загрузки баланса:', error);
            this.updateBalanceDisplay(0);
        }
    }

    updateBalanceDisplay(balance: number): void {
        const balanceElement = document.querySelector('.balance .amount');
        if (balanceElement) {
            balanceElement.textContent = `${balance}$`;

            balanceElement.classList.toggle('text-success', balance >= 0);
            balanceElement.classList.toggle('text-danger', balance < 0);
        }
    }

    static async refreshBalance(): Promise<void> {
        try {
            const balanceData = await ApiUtils.request('GET', '/balance');
            const balanceElement = document.querySelector('.balance .amount');
            if (balanceElement) {
                balanceElement.textContent = `${balanceData.balance}$`;
                balanceElement.classList.toggle('text-success', balanceData.balance >= 0);
                balanceElement.classList.toggle('text-danger', balanceData.balance < 0);
            }
        } catch (error) {
            console.error('Ошибка обновления баланса:', error);
        }
    }

    private setupLogout(): void {
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', async (e) => {
                e.preventDefault();
                const logout = new Logout(this.openNewRoute);
                await logout.logout();
            });
        }
    }
}