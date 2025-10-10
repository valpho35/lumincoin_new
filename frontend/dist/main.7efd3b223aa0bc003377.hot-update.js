"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatelumincoin"]("main",{

/***/ "./src/components/registration.js":
/*!****************************************!*\
  !*** ./src/components/registration.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Registration: () => (/* binding */ Registration)\n/* harmony export */ });\nclass Registration {\r\n    constructor(openNewRoute) {\r\n        this.openNewRoute = openNewRoute;\r\n\r\n         if (localStorage.getItem('accessToken')) {\r\n            return this.openNewRoute('/');\r\n        }\r\n\r\n        this.nameElement = document.getElementById('name');\r\n        this.lastNameElement = document.getElementById('last-name');\r\n        this.emailElement = document.getElementById('email');\r\n        this.passwordElement = document.getElementById('password');\r\n        this.confirmPasswordElement = document.getElementById('confirm-password');\r\n        this.commonErrorElement = document.getElementById('common-error');\r\n        document.getElementById('process-button').addEventListener('click', this.registration.bind(this));\r\n    }\r\n\r\n    validateForm() {\r\n        let isValid = true;\r\n\r\n        if (this.nameElement.value) {\r\n            this.nameElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.nameElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n          if (this.lastNameElement.value) {\r\n            this.lastNameElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.lastNameElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.emailElement.value && this.emailElement.value.match(/^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/)) {\r\n            this.emailElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.emailElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {\r\n            this.passwordElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.passwordElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.confirmPasswordElement.value && this.confirmPasswordElement.value === this.passwordElement.value) {\r\n            this.confirmPasswordElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.confirmPasswordElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        return isValid;\r\n\r\n    }\r\n\r\n    async registration(event) {\r\n        event.preventDefault();\r\n        this.commonErrorElement.style.display = 'none';\r\n        if (this.validateForm()) {\r\n            const response = await fetch('http://localhost:3000/api/signup', {\r\n                method: 'POST',\r\n                headers: {\r\n                    'Content-type': 'application/json',\r\n                    'Accept': 'applicaion/json',\r\n                },\r\n                body: JSON.stringify({\r\n                    name: this.nameElement.value,\r\n                    lastName: this.lastNameElement.value,\r\n                    email: this.emailElement.value,\r\n                    password: this.passwordElement.value,\r\n                })\r\n            });\r\n\r\n            const result = await response.json();\r\n            if (result.error || !result.user.id || !result.user.name || !result.user.lastName || !result.user.email) {\r\n                this.commonErrorElement.style.display = 'block';\r\n                return;\r\n            }\r\n\r\n            localStorage.setItem('accessToken', result.accessToken);\r\n            localStorage.setItem('refreshToken', result.refreshToken);\r\n            localStorage.setItem('userInfo', JSON.stringify({ id: result.user.id, name: result.user.name, lastName: result.user.lastName, email: result.user.email }));\r\n\r\n            this.openNewRoute('/login');\r\n        }\r\n    }\r\n   \r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/registration.js?\n}");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("332f0cef9550b227dca3")
/******/ })();
/******/ 
/******/ }
);