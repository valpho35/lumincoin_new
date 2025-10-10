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

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Registration: () => (/* binding */ Registration)\n/* harmony export */ });\nclass Registration {\r\n    constructor() {\r\n        this.nameElement = document.getElementById('name');\r\n        this.lastNameElement = document.getElementById('last-name');\r\n        this.emailElement = document.getElementById('email');\r\n        this.passwordElement = document.getElementById('password');\r\n        this.confirmPasswordElement = document.getElementById('confirm-password');\r\n        document.getElementById('process-button').addEventListener('click', this.registration.bind(this));\r\n    }\r\n\r\n    validateForm() {\r\n        let isValid = true;\r\n\r\n        if (this.nameElement.value) {\r\n            this.nameElement.classList.remove('invalid-feedback');\r\n        } else {\r\n            this.nameElement.classList.add('invalid-feedback');\r\n            isValid = false;\r\n        }\r\n\r\n          if (this.lastNameElement.value) {\r\n            this.lastNameElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.lastNameElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.emailElement.value && this.emailElement.value.match(/^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/)) {\r\n            this.emailElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.emailElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {\r\n            this.passwordElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.passwordElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        if (this.confirmPasswordElement.value && this.confirmPasswordElement.value === this.passwordElement.value) {\r\n            this.confirmPasswordElement.classList.remove('is-invalid');\r\n        } else {\r\n            this.confirmPasswordElement.classList.add('is-invalid');\r\n            isValid = false;\r\n        }\r\n\r\n        return isValid;\r\n\r\n    }\r\n\r\n    registration(event) {\r\n        event.preventDefault();\r\n        this.validateForm();\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/registration.js?\n}");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("ae020e929881dab161bf")
/******/ })();
/******/ 
/******/ }
);