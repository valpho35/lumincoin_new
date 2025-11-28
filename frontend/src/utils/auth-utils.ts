export interface UserInfo {
    id: string | number;
    name: string;
    lastName: string;
    email?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthData {
    tokens: AuthTokens;
    user: UserInfo;
}

export interface AuthStorage {
    accessToken: string | null;
    refreshToken: string | null;
    userInfo: UserInfo | null;
}

export class AuthUtils {
    static readonly accessTokenKey: string = 'accessToken';
    static readonly refreshTokenKey: string = 'refreshToken';
    static readonly userInfoTokenKey: string = 'userInfo';

    static getAuthInfo(key?: string): string | null;
    static getAuthInfo(key: null): AuthStorage;
    static getAuthInfo(key?: string | null): string | null | AuthStorage {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            const accessToken = localStorage.getItem(this.accessTokenKey);
            const refreshToken = localStorage.getItem(this.refreshTokenKey);
            const userInfoStr = localStorage.getItem(this.userInfoTokenKey);

            let userInfo: UserInfo | null = null;
            if (userInfoStr) {
                try {
                    userInfo = JSON.parse(userInfoStr);
                } catch (error) {
                    console.error('Error user info:', error);
                }
            }

            return {
                accessToken,
                refreshToken,
                userInfo
            };
        }
    }

    static setAuthInfo(accessToken: string, refreshToken: string, userInfo: UserInfo): void {
        try {
            localStorage.setItem(this.accessTokenKey, accessToken);
            localStorage.setItem(this.refreshTokenKey, refreshToken);
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        } catch (error) {
            console.error('Error saving info:', error);
            throw new Error('Failed to save authentication data');
        }
    }

    static removeAuthInfo(): void {
        try {
            localStorage.removeItem(this.accessTokenKey);
            localStorage.removeItem(this.refreshTokenKey);
            localStorage.removeItem(this.userInfoTokenKey);
        } catch (error) {
            console.error('Error removing auth info from localStorage:', error);
        }
    }

    static isAuthenticated(): boolean {
        const accessToken = localStorage.getItem(this.accessTokenKey);
        return !!accessToken;
    }

    static getAccessToken(): string | null {
        return localStorage.getItem(this.accessTokenKey);
    }

    static getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    static getUserInfo(): UserInfo | null {
        try {
            const userInfo = localStorage.getItem(this.userInfoTokenKey);
            return userInfo ? JSON.parse(userInfo) : null;
        } catch (error) {
            console.error('Error parsing user info:', error);
            return null;
        }
    }

    static updateAccessToken(newAccessToken: string): void {
        try {
            localStorage.setItem(this.accessTokenKey, newAccessToken);
        } catch (error) {
            console.error('Error updating access token:', error);
            throw new Error('Failed to update access token');
        }
    }

    static updateUserInfo(userInfo: Partial<UserInfo>): void {
        try {
            const currentUserInfo = this.getUserInfo();
            if (currentUserInfo) {
                const updatedUserInfo = { ...currentUserInfo, ...userInfo };
                localStorage.setItem(this.userInfoTokenKey, JSON.stringify(updatedUserInfo));
            }
        } catch (error) {
            console.error('Error updating user info:', error);
        }
    }

    static clearAuth(): void {
        this.removeAuthInfo();
    }

    static isTokenExpired(token: string): boolean {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    static needsTokenRefresh(): boolean {
        const accessToken = this.getAccessToken();
        return !accessToken || this.isTokenExpired(accessToken);
    }

    static getFullName(): string {
        const userInfo = this.getUserInfo();
        if (userInfo) {
            return `${userInfo.name} ${userInfo.lastName}`.trim();
        }
        return '';
    }

    static getInitials(): string {
        const userInfo = this.getUserInfo();
        if (userInfo && userInfo.name && userInfo.lastName) {
            return `${userInfo.name[0]}${userInfo.lastName[0]}`.toUpperCase();
        }
        return 'User';
    }

    static getAuthStorage(): AuthStorage {
        return this.getAuthInfo(null);
    }
}