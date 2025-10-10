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

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Login: () => (/* binding */ Login)\n/* harmony export */ });\n/* harmony import */ var _utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/auth-utils */ \"./src/utils/auth-utils.js\");\n/* harmony import */ var _utils_http_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/http-utils */ \"./src/utils/http-utils.js\");\n\r\n\r\n\r\nclass Login {\r\n    constructor(openNewRoute) {\r\n        this.openNewRoute = openNewRoute;\r\n\r\n        if (_utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.getAuthInfo(_utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.accessTokenKey)) {\r\n            return this.openNewRoute('/');\r\n        }\r\n\r\n        this.emailElement = document.getElementById('email');\r\n        this.passwordElement = document.getElementById('password');\r\n        this.rememberMeElement = document.getElementById('remember-me');\r\n        this.commonErrorElement = document.getElementById('common-error');\r\n        document.getElementById('process-button').addEventListener('click', this.login.bind(this));\r\n\r\n    }\r\n\r\n    validateForm() {\r\n        let isValid = true;\r\n        if (this.emailElement.value && this.emailElement.value.match(/^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/)) {\r\n            this.emailElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.emailElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.passwordElement.value) {\r\n            this.passwordElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.passwordElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        return isValid;\r\n\r\n    }\r\n\r\n    async login(event) {\r\n        event.preventDefault();\r\n        this.commonErrorElement.style.display = 'none';\r\n        if (this.validateForm()) {\r\n            const result = await _utils_http_utils__WEBPACK_IMPORTED_MODULE_1__.HttpUtils.request('/login', 'POST', {\r\n                email: this.emailElement.value,\r\n                password: this.passwordElement.value,\r\n                rememberMe: this.rememberMeElement.checked\r\n            });\r\n\r\n            // const result = await response.json();\r\n            if (result.error || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.id || !result.user.name) {\r\n                this.commonErrorElement.style.display = 'block';\r\n                return;\r\n            }\r\n\r\n            _utils_auth_utils__WEBPACK_IMPORTED_MODULE_0__.AuthUtils.setAuthInfo(result.tokens.accessToken, result.tokens.refreshToken, { id: result.user.id, name: result.user.name });\r\n\r\n            this.openNewRoute('/');\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/login.js?\n}");

/***/ }),

/***/ "./src/config/common-config.js":
/*!*************************************!*\
  !*** ./src/config/common-config.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst config = {\r\n    api: 'http://localhost:3000/api'\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config);\n\n//# sourceURL=webpack://lumincoin/./src/config/common-config.js?\n}");

/***/ }),

/***/ "./src/utils/http-utils.js":
/*!*********************************!*\
  !*** ./src/utils/http-utils.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   HttpUtils: () => (/* binding */ HttpUtils)\n/* harmony export */ });\n/* harmony import */ var _config_common_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/common-config */ \"./src/config/common-config.js\");\n\r\n\r\nclass HttpUtils {\r\n    static async request(url, method = 'GET', body = null, useToken) {\r\n        const result = {\r\n            error: false,\r\n            response: null\r\n        };\r\n\r\n        const params = {\r\n            method: method,\r\n            headers: {\r\n                'Content-type': 'application/json',\r\n                'Accept': 'applicaion/json',\r\n            },\r\n        };\r\n\r\n        if (body) {\r\n            params.body = JSON.stringify(body);\r\n        }\r\n\r\n        let response = null;\r\n        try {\r\n            response = await fetch(_config_common_config__WEBPACK_IMPORTED_MODULE_0__[\"default\"].api + url, params);\r\n            result.response = await response.json();\r\n        } catch (e) {\r\n            result.error = true;\r\n            return result;\r\n        }\r\n\r\n        if (response.status <200 || response.status >=300) {\r\n            result.error = true;\r\n        }\r\n\r\n        return result;\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/utils/http-utils.js?\n}");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("d1696d070e260acf3546")
/******/ })();
/******/ 
/******/ }
);