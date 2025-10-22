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
                const userNameElement = document.querySelector('.user .dropdown-toggle');

                if (userNameElement && userData.name && userData.lastName) {
                    userNameElement.innerHTML = userNameElement.innerHTML.replace(/Roman Chernov/, `${userData.name} ${userData.lastName}`);
                }
            } catch (e) {
                console.error('Error in user info:', e);
            }
        }
    }
}

// export class Layout {
//     constructor() {
//         this.initUserInfo();
//     }

//     initUserInfo() {
//         // Обновляем при загрузке страницы
//         this.updateUserName();
//     }

//     updateUserName() {
//         const userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
//         if (userInfo) {
//             try {
//                 const userData = JSON.parse(userInfo);
//                 const userNameElements = document.querySelectorAll('.user-name');
                
//                 userNameElements.forEach(element => {
//                     if (userData.name && userData.lastName) {
//                         element.textContent = `${userData.name} ${userData.lastName}`;
//                     }
//                 });
//             } catch (e) {
//                 console.error('Error updating user name:', e);
//             }
//         }
//     }
// }