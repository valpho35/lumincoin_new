import { Index } from "./components/index.js";
import { Registration } from "./components/registration.js";
import { Login } from "./components/login.js";
import { Income } from "./components/income.js";
import { CreateIncome } from "./components/createIncome.js";
import { EditIncome } from "./components/editIncome.js";
import { Expenses } from "./components/expenses.js";
import { CreateExpense } from "./components/createExpense.js";
import { EditExpense } from "./components/editExpense.js";
import { Operations } from "./components/operations.js";
import { CreateOperations } from "./components/createOperations.js";
import { EditOperations } from "./components/editOperations.js";
import { Layout } from "./components/layout.js";
import { Logout } from "./components/logout.js";
import { VisualUtils } from "./utils/visual-utils.js";
import { AuthUtils } from "./utils/auth-utils.js";


export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.navElement = document.querySelector('nav');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/index.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Index();
                },
                authRequired: true
            },
            {
                route: '/registration',
                title: 'Регистрация',
                filePathTemplate: '/templates/registration.html',
                load: () => {
                    new Registration(this.openNewRoute.bind(this));
                },
                useLayout: false,
                authRequired: false
            },
            {
                route: '/login',
                title: 'Вход',
                filePathTemplate: '/templates/login.html',
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                },
                useLayout: false,
                authRequired: false
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/create-income-cat',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/create-income-cat.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncome(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/edit-income-cat',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/edit-income-cat.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncome(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/create-expense-cat',
                title: 'Создание категрии расходов',
                filePathTemplate: '/templates/create-expense-cat.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpense(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/edit-expense-cat',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/edit-expense-cat.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditExpense(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/operations',
                title: 'Доходы и Расходы',
                filePathTemplate: '/templates/operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Operations(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/create-operations',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/create-operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateOperations(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/edit-operations',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/edit-operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditOperations(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/layout',
                title: 'Сайдбар',
                filePathTemplate: '/templates/layout.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Layout(this.openNewRoute.bind(this));
                },
                authRequired: true
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
                authRequired: false
            }
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        window.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        const link = e.target.closest('a');
        if (!link) return;

        e.preventDefault();

        const href = link.getAttribute('href');
        if (href && href !== 'javascript:void(0)') {
            await this.openNewRoute(href);
        }
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute) {
                if (newRoute.authRequired && !this.isAuthenticated()) {
                    console.log('need to login in');
                    this.openNewRoute('/login');
                    return;
                }
                if ((urlRoute === '/login' || urlRoute === '/registration') && this.isAuthenticated()) {
                    this.openNewRoute('/');
                    return;
                }
            }

            setTimeout(() => {
                VisualUtils.SidebarMenu(newRoute.route);
                VisualUtils.initBootstrap();
            }, 150);

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('Необходимо авторизоваться!');
            window.location = '/login';
        }
    }

    isAuthenticated() {
        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        return !!accessToken;
    }
}
