import { Index } from "./components/index.js";
import { Registration } from "./components/registration.js";
import { Login } from "./components/login.js";
import { Income } from "./components/income.js";
import { Expenses } from "./components/expenses.js";
import { Operations } from "./components/operations.js";
import { CreateOperations } from "./components/createOperations.js";
import { EditOperations } from "./components/editOperations.js";
import { Layout } from "./components/layout.js";
import { Logout } from "./components/logout.js";
import { VisualUtils } from "./utils/visual-utils.js";
import { AuthUtils } from "./utils/auth-utils.js";
import { CreateCategory } from "./components/createCategory.js";
import { EditCategory } from "./components/editCategory.js";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.navElement = document.querySelector('nav');
        this.isRedirecting = false;

        window.router = this;

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
                route: '/create-category',
                title: 'Создание категории',
                filePathTemplate: '/templates/create-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const type = urlParams.get('type');

                    if (!type) {
                        console.error('Missing required parameter');
                        window.router.openNewRoute('/');
                        return;
                    }
                    new CreateCategory(this.openNewRoute.bind(this), type);
                },
                authRequired: true
            },
            {
                route: '/edit-category',
                title: 'Редактирование категории',
                filePathTemplate: '/templates/edit-category.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const type = urlParams.get('type');
                    const id = urlParams.get('id');

                    if (!type || !id) {
                        console.error('Missing required parameters');
                        const returnRoute = type === 'expense' ? '/expenses' : '/income';
                        window.router.openNewRoute(returnRoute);
                        return;
                    }
                    new EditCategory(this.openNewRoute.bind(this), type);
                },
                authRequired: true
            },
            {
                route: '/operations',
                title: 'Доходы и Расходы',
                filePathTemplate: '/templates/operations.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    console.log('Loading Operations component...');
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
                useLayout: false,
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
        if (this.isRedirecting) return;

        const currentRoute = window.location.pathname;
        if (url === currentRoute) return;
        history.pushState({}, '', url);
        await this.activateRoute();
    }

    async clickHandler(e) {
        const link = e.target.closest('a');
        if (!link) return;

        e.preventDefault();

        const href = link.getAttribute('href');
        if (href === 'javascript:void(0)') {
            const dataId = link.getAttribute('data-id');
            if (dataId && link.classList.contains('edit-operation')) {
                await this.openNewRoute(`/edit-operations?id=${dataId}`);
            }
            return;
        }
        if (href && href !== 'javascript:void(0)') {
            await this.openNewRoute(href);
        }
    }

    async activateRoute() {
        if (this.isRedirecting) return;
        const urlRoute = window.location.pathname;

        console.log('Current URL:', urlRoute);
        console.log('Available routes:', this.routes.map(r => r.route));

        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (!newRoute) {
             console.log('Route not found, redirecting to login');
            return this.redirectToLogin();
        }
        console.log('Found route:', newRoute);

        const isAuthenticated = this.isAuthenticated();
        console.log('Is authenticated:', isAuthenticated);

        if (newRoute.authRequired && !isAuthenticated) {
            return this.redirectToLogin();
        }

        if ((urlRoute === '/login' || urlRoute === '/registration') && isAuthenticated) {
            return this.redirectToHome();
        }

        await this.loadContent(newRoute);

        this.initializeComponent(newRoute);
    }

    async loadContent(route) {
        if (route.title && this.titlePageElement) {
            this.titlePageElement.innerText = route.title;
        }

        if (route.filePathTemplate && this.contentPageElement) {
            let contentBlock = this.contentPageElement;

            if (route.useLayout) {
                const layoutHtml = await this.fetchTemplate(route.useLayout);
                this.contentPageElement.innerHTML = layoutHtml;
                contentBlock = document.getElementById('content-layout');
            }

            if (contentBlock) {
                const templateHTML = await this.fetchTemplate(route.filePathTemplate);
                contentBlock.innerHTML = templateHTML;
            }
        }
    }

    async fetchTemplate(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load template: ${url}`);
        }
        return response.text();
    }


    initializeComponent(route) {
        setTimeout(() => {
            try {
                VisualUtils.SidebarMenu(route.route);
                VisualUtils.initBootstrap();

                if (route.useLayout) {
                    this.layout = new Layout(this.openNewRoute.bind(this));
                }

                if (route.load && typeof route.load === 'function') {
                    route.load();
                }
            } catch (error) {
                console.error('Error initializing component:', error);
            }
        }, 150);
    }

    redirectToLogin() {
        if (this.isRedirecting) return;

        this.isRedirecting = true;
        console.log('Необходимо авторизоваться!');

        if (window.location.pathname !== '/login') {
            // history.replaceState({}, '', '/login');
            // this.openNewRoute('/login').finally(() => {
            //     this.isRedirecting = false;
            window.location.href = '/login';
            
        } else {
            this.isRedirecting = false;
        }
    }

    redirectToHome() {
        if (this.isRedirecting) return;

        this.isRedirecting = true;

        if (window.location.pathname !== '/') {
            // history.replaceState({}, '', '/');
            this.openNewRoute('/').finally(() => {
                this.isRedirecting = false;
            });
        } else {
            this.isRedirecting = false;
        }
    }

    isAuthenticated() {
        const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        return !!accessToken;
    }
}
