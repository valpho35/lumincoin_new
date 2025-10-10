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

/***/ "./src/components/login.js":
/*!*********************************!*\
  !*** ./src/components/login.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Login: () => (/* binding */ Login)\n/* harmony export */ });\nclass Login {\r\n    constructor() {\r\n        this.emailElement = document.getElementById('email');\r\n        this.passwordElement = document.getElementById('password');\r\n        this.rememberMeElement = document.getElementById('remember-me');\r\n        this.commonErrorElement = document.getElementById('common-error');\r\n        document.getElementById('process-button').addEventListener('click', this.login.bind(this));\r\n\r\n    }\r\n\r\n    validateForm() {\r\n        let isValid = true;\r\n        if (this.emailElement.value && this.emailElement.value.match(/^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/)) {\r\n            this.emailElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.emailElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.passwordElement.value) {\r\n            this.passwordElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.passwordElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        return isValid;\r\n\r\n    }\r\n\r\n    async login(event) {\r\n        event.preventDefault();\r\n\r\n        if (this.validateForm()) {\r\n            const response = await fetch('http://localhost:3000/api/login', {\r\n                method: 'POST',\r\n                headers: {\r\n                    'Content-type': 'application/json',\r\n                    'Accept': 'applicaion/json',\r\n                },\r\n                body: JSON.stringify({\r\n                    email: this.emailElement.value,\r\n                    password: this.emailElement.password,\r\n                    rememberMe: this.rememberMeElement.checked\r\n                })\r\n            });\r\n\r\n            const result = await response.json();\r\n            if (result.error || !result.accessToken || !result.refreshToken || !result.id || !result.name) {\r\n                this.commonErrorElement.style.display = 'block';\r\n            }\r\n            console.log(result);\r\n        } else {\r\n\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/login.js?\n}");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("fd74b48cff2a6cf0f4fb")
/******/ })();
/******/ 
/******/ }
);