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

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: 'templates/index.html',
                useLayout: 'templates/layout.html',
                styles: 'styles/styles.css',
                load: () => {
                    new Index();
                },
            },
            {
                route: '/registration',
                title: 'Регистрация',
                filePathTemplate: 'templates/registration.html',
                styles: 'styles/styles.css',
                load: () => {
                    new Registration();
                },
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Вход',
                filePathTemplate: 'templates/login.html',
                styles: 'styles/styles.css',
                load: () => {
                    new Login();
                },
                useLayout: false,
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: 'templates/income.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new Income();
                },
                styles: 'styles/styles.css',
            },
            {
                route: '/create-income-cat',
                title: 'Создание категории доходов',
                filePathTemplate: 'templates/create-income-cat.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new CreateIncome();
                },
                styles: 'styles/styles.css',
            },
            {
                route: '/edit-income-cat',
                title: 'Редактирование категории доходов',
                filePathTemplate: 'templates/edit-income-cat.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new EditIncome();
                },
                styles: 'styles/styles.css',
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: 'templates/expenses.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new Expenses();
                },
                styles: 'styles/styles.css',
            },
            {
                route: '/create-expense-cat',
                title: 'Создание категрии расходов',
                filePathTemplate: 'templates/creat-expense-cat.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new CreateExpense();
                },
                styles: 'styles/styles.css',
            },
            {
                route: '/edit-expense-cat',
                title: 'Редактирование категории расходов',
                filePathTemplate: 'templates/edit-expense-cat.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new EditExpense();
                },
                styles: 'styles/styles.css',
            },
            {
                route: '/operations',
                title: 'Доходы и Расходы',
                filePathTemplate: 'templates/operations.html',
                useLayout: 'templates/layout.html',
                styles: 'styles/styles.css',
                load: () => {
                    new Operations();
                },
            },
            {
                route: '/create-operations',
                title: 'Создание дохода/расхода',
                filePathTemplate: 'templates/create-operations.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new CreateOperations();
                },
                styles: 'styles/styles.css',
            },
            {
                route: '/edit-operations',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: 'templates/edit-operations.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new EditOperations();
                },
                styles: 'styles/styles.css',
            },
            {
                route: '/layout',
                title: 'Сайдбар',
                filePathTemplate: 'templates/layout.html',
                useLayout: 'templates/layout.html',
                load: () => {
                    new Layout();
                },
                styles: 'styles/styles.css',
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.filePathTemplate) {
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            } 
        } else {
            console.log('Необходимо авторизоваться!');
            window.location = '/login';
        }
    }
}