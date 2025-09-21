/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n\r\n\r\nclass App {\r\n    constructor() {\r\n        this.router = new _router_js__WEBPACK_IMPORTED_MODULE_0__.Router();\r\n        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));\r\n        window.addEventListener('popstate', this.handleRouteChanging.bind(this));\r\n    }\r\n    handleRouteChanging() {\r\n        this.router.openRoute();\r\n    }\r\n}\r\n\r\n(new App());\n\n//# sourceURL=webpack://lumincoin/./src/app.js?\n}");

/***/ }),

/***/ "./src/components/createExpense.js":
/*!*****************************************!*\
  !*** ./src/components/createExpense.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CreateExpense: () => (/* binding */ CreateExpense)\n/* harmony export */ });\nclass CreateExpense {\r\n    constructor() {\r\n        console.log(СоздатьРасход);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/createExpense.js?\n}");

/***/ }),

/***/ "./src/components/createIncome.js":
/*!****************************************!*\
  !*** ./src/components/createIncome.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CreateIncome: () => (/* binding */ CreateIncome)\n/* harmony export */ });\nclass CreateIncome {\r\n    constructor() {\r\n        console.log(СоздатьДоход);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/createIncome.js?\n}");

/***/ }),

/***/ "./src/components/createOperations.js":
/*!********************************************!*\
  !*** ./src/components/createOperations.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CreateOperations: () => (/* binding */ CreateOperations)\n/* harmony export */ });\nclass CreateOperations {\r\n    constructor() {\r\n        console.log(СоздатьОперацию);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/createOperations.js?\n}");

/***/ }),

/***/ "./src/components/editExpense.js":
/*!***************************************!*\
  !*** ./src/components/editExpense.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EditExpense: () => (/* binding */ EditExpense)\n/* harmony export */ });\nclass EditExpense {\r\n    constructor() {\r\n        console.log(РедактироватьРасход);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/editExpense.js?\n}");

/***/ }),

/***/ "./src/components/editIncome.js":
/*!**************************************!*\
  !*** ./src/components/editIncome.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EditIncome: () => (/* binding */ EditIncome)\n/* harmony export */ });\nclass EditIncome {\r\n    constructor() {\r\n        console.log(РедактироватьДоход);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/editIncome.js?\n}");

/***/ }),

/***/ "./src/components/editOperations.js":
/*!******************************************!*\
  !*** ./src/components/editOperations.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EditOperations: () => (/* binding */ EditOperations)\n/* harmony export */ });\nclass EditOperations {\r\n    constructor() {\r\n        console.log(РедактироватьОперацию);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/editOperations.js?\n}");

/***/ }),

/***/ "./src/components/expenses.js":
/*!************************************!*\
  !*** ./src/components/expenses.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Expenses: () => (/* binding */ Expenses)\n/* harmony export */ });\nclass Expenses {\r\n    constructor() {\r\n        console.log(Расходы);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/expenses.js?\n}");

/***/ }),

/***/ "./src/components/income.js":
/*!**********************************!*\
  !*** ./src/components/income.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Income: () => (/* binding */ Income)\n/* harmony export */ });\nclass Income {\r\n    constructor() {\r\n        console.log(Доходы);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/income.js?\n}");

/***/ }),

/***/ "./src/components/index.js":
/*!*********************************!*\
  !*** ./src/components/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Index: () => (/* binding */ Index)\n/* harmony export */ });\nclass Index {\r\n    constructor() {\r\n        console.log(Главная);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/index.js?\n}");

/***/ }),

/***/ "./src/components/layout.js":
/*!**********************************!*\
  !*** ./src/components/layout.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Layout: () => (/* binding */ Layout)\n/* harmony export */ });\nclass Layout {\r\n    constructor() {\r\n        console.log(Сайдбар);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/layout.js?\n}");

/***/ }),

/***/ "./src/components/login.js":
/*!*********************************!*\
  !*** ./src/components/login.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Login: () => (/* binding */ Login)\n/* harmony export */ });\nclass Login {\r\n    constructor() {\r\n        console.log(Вход);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/login.js?\n}");

/***/ }),

/***/ "./src/components/operations.js":
/*!**************************************!*\
  !*** ./src/components/operations.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Operations: () => (/* binding */ Operations)\n/* harmony export */ });\nclass Operations {\r\n    constructor() {\r\n        console.log(Операции);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/operations.js?\n}");

/***/ }),

/***/ "./src/components/registration.js":
/*!****************************************!*\
  !*** ./src/components/registration.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Registration: () => (/* binding */ Registration)\n/* harmony export */ });\nclass Registration {\r\n    constructor() {\r\n        console.log(Регистрация);\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/components/registration.js?\n}");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Router: () => (/* binding */ Router)\n/* harmony export */ });\n/* harmony import */ var _components_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/index.js */ \"./src/components/index.js\");\n/* harmony import */ var _components_registration_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/registration.js */ \"./src/components/registration.js\");\n/* harmony import */ var _components_login_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/login.js */ \"./src/components/login.js\");\n/* harmony import */ var _components_income_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/income.js */ \"./src/components/income.js\");\n/* harmony import */ var _components_createIncome_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/createIncome.js */ \"./src/components/createIncome.js\");\n/* harmony import */ var _components_editIncome_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/editIncome.js */ \"./src/components/editIncome.js\");\n/* harmony import */ var _components_expenses_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/expenses.js */ \"./src/components/expenses.js\");\n/* harmony import */ var _components_createExpense_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/createExpense.js */ \"./src/components/createExpense.js\");\n/* harmony import */ var _components_editExpense_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/editExpense.js */ \"./src/components/editExpense.js\");\n/* harmony import */ var _components_operations_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/operations.js */ \"./src/components/operations.js\");\n/* harmony import */ var _components_createOperations_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/createOperations.js */ \"./src/components/createOperations.js\");\n/* harmony import */ var _components_editOperations_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/editOperations.js */ \"./src/components/editOperations.js\");\n/* harmony import */ var _components_layout_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/layout.js */ \"./src/components/layout.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nclass Router {\r\n    constructor() {\r\n        this.titlePageElement = document.getElementById('title');\r\n        this.contentPageElement = document.getElementById('content');\r\n\r\n        this.initEvents();\r\n        this.routes = [\r\n            {\r\n                route: '/',\r\n                title: 'Главная',\r\n                filePathTemplate: 'templates/index.html',\r\n                useLayout: 'templates/layout.html',\r\n                styles: 'styles/styles.css',\r\n                load: () => {\r\n                    new _components_index_js__WEBPACK_IMPORTED_MODULE_0__.Index();\r\n                },\r\n            },\r\n            {\r\n                route: '/registration',\r\n                title: 'Регистрация',\r\n                filePathTemplate: 'templates/registration.html',\r\n                styles: 'styles/styles.css',\r\n                load: () => {\r\n                    new _components_registration_js__WEBPACK_IMPORTED_MODULE_1__.Registration();\r\n                },\r\n                useLayout: false,\r\n            },\r\n            {\r\n                route: '/login',\r\n                title: 'Вход',\r\n                filePathTemplate: 'templates/login.html',\r\n                styles: 'styles/styles.css',\r\n                load: () => {\r\n                    new _components_login_js__WEBPACK_IMPORTED_MODULE_2__.Login();\r\n                },\r\n                useLayout: false,\r\n            },\r\n            {\r\n                route: '/income',\r\n                title: 'Доходы',\r\n                filePathTemplate: 'templates/income.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_income_js__WEBPACK_IMPORTED_MODULE_3__.Income();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n            {\r\n                route: '/create-income-cat',\r\n                title: 'Создание категории доходов',\r\n                filePathTemplate: 'templates/create-income-cat.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_createIncome_js__WEBPACK_IMPORTED_MODULE_4__.CreateIncome();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n            {\r\n                route: '/edit-income-cat',\r\n                title: 'Редактирование категории доходов',\r\n                filePathTemplate: 'templates/edit-income-cat.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_editIncome_js__WEBPACK_IMPORTED_MODULE_5__.EditIncome();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n            {\r\n                route: '/expenses',\r\n                title: 'Расходы',\r\n                filePathTemplate: 'templates/expenses.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_expenses_js__WEBPACK_IMPORTED_MODULE_6__.Expenses();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n            {\r\n                route: '/create-expense-cat',\r\n                title: 'Создание категрии расходов',\r\n                filePathTemplate: 'templates/creat-expense-cat.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_createExpense_js__WEBPACK_IMPORTED_MODULE_7__.CreateExpense();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n            {\r\n                route: '/edit-expense-cat',\r\n                title: 'Редактирование категории расходов',\r\n                filePathTemplate: 'templates/edit-expense-cat.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_editExpense_js__WEBPACK_IMPORTED_MODULE_8__.EditExpense();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n            {\r\n                route: '/operations',\r\n                title: 'Доходы и Расходы',\r\n                filePathTemplate: 'templates/operations.html',\r\n                useLayout: 'templates/layout.html',\r\n                styles: 'styles/styles.css',\r\n                load: () => {\r\n                    new _components_operations_js__WEBPACK_IMPORTED_MODULE_9__.Operations();\r\n                },\r\n            },\r\n            {\r\n                route: '/create-operations',\r\n                title: 'Создание дохода/расхода',\r\n                filePathTemplate: 'templates/create-operations.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_createOperations_js__WEBPACK_IMPORTED_MODULE_10__.CreateOperations();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n            {\r\n                route: '/edit-operations',\r\n                title: 'Редактирование дохода/расхода',\r\n                filePathTemplate: 'templates/edit-operations.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_editOperations_js__WEBPACK_IMPORTED_MODULE_11__.EditOperations();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n            {\r\n                route: '/layout',\r\n                title: 'Сайдбар',\r\n                filePathTemplate: 'templates/layout.html',\r\n                useLayout: 'templates/layout.html',\r\n                load: () => {\r\n                    new _components_layout_js__WEBPACK_IMPORTED_MODULE_12__.Layout();\r\n                },\r\n                styles: 'styles/styles.css',\r\n            },\r\n        ];\r\n    }\r\n\r\n    initEvents() {\r\n        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));\r\n        window.addEventListener('popstate', this.activateRoute.bind(this));\r\n    }\r\n\r\n    async activateRoute() {\r\n        const urlRoute = window.location.pathname;\r\n        const newRoute = this.routes.find(item => item.route === urlRoute);\r\n\r\n        if (newRoute) {\r\n            if (newRoute.title) {\r\n                this.titlePageElement.innerText = newRoute.title;\r\n            }\r\n\r\n            if (newRoute.filePathTemplate) {\r\n                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());\r\n            }\r\n\r\n            if (newRoute.load && typeof newRoute.load === 'function') {\r\n                newRoute.load();\r\n            } \r\n        } else {\r\n            console.log('Необходимо авторизоваться!');\r\n            window.location = '/login';\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://lumincoin/./src/router.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;