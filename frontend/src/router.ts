import { Index } from "./components/index";
import { Registration } from "./components/registration";
import { Login } from "./components/login";
import { Income } from "./components/income";
import { Expenses } from "./components/expenses";
import { Operations } from "./components/operations";
import { CreateOperations } from "./components/createOperations";
import { EditOperations } from "./components/editOperations";
import { Layout } from "./components/layout";
import { Logout } from "./components/logout";
import { VisualUtils } from "./utils/visual-utils";
import { AuthUtils } from "./utils/auth-utils";
import { CreateCategory } from "./components/createCategory";
import { EditCategory } from "./components/editCategory";
import { Route } from "./types/common.types";

export class Router {
    private titlePageElement: HTMLElement | null;
    private contentPageElement: HTMLElement | null;
    private navElement: HTMLElement | null;
    private isRedirecting: boolean;
    private routes: Route[];
    private layout: Layout | null;

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.navElement = document.querySelector('nav');
        this.isRedirecting = false;
        this.routes = [];
        this.layout = null;

        (window as any).router = this;

        this.initEvents();
        this.setupRoutes();
        this.activateRoute();
    }

    private setupRoutes(): void {
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
                        this.openNewRoute('/');
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
                        const returnRoute = type === 'expense' ? '/expenses' : '/income';
                        this.openNewRoute(returnRoute);
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
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
                useLayout: false,
                authRequired: false
            }
        ];
    }

    private initEvents(): void {
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    public async openNewRoute(url: string): Promise<void> {
        if (this.isRedirecting) return;

        const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.css', '.js', '.woff', '.woff2', '.ttf'];
        const staticPaths = ['/static/', '/images/', '/fonts/'];

        const isStatic = staticExtensions.some(ext => url.includes(ext)) ||
            staticPaths.some(path => url.startsWith(path));

        if (isStatic) {
            window.location.href = url;
            return;
        }

        history.pushState({}, '', url);
        await this.activateRoute();
    }

    private async clickHandler(e: MouseEvent): Promise<void> {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href === 'javascript:void(0)') return;

        const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.css', '.js', '.woff', '.woff2', '.ttf'];
        const staticPaths = ['/static/', '/images/', '/fonts/'];

        const isStatic = staticExtensions.some(ext => href.includes(ext)) ||
            staticPaths.some(path => href.startsWith(path));

        if (isStatic) {
            return;
        }
        e.preventDefault();
        await this.openNewRoute(href);
    }

    private async activateRoute(): Promise<void> {
        if (this.isRedirecting) {
            return;
        }

        const urlRoute = window.location.pathname;

        const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.css', '.js', '.woff', '.woff2', '.ttf'];
        const staticPaths = ['/static/', '/images/', '/fonts/'];

        const isStatic = staticExtensions.some(ext => urlRoute.includes(ext)) ||
            staticPaths.some(path => urlRoute.startsWith(path));

        if (isStatic) {
            return;
        }

        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (!newRoute) {
            this.showNotFound();
            return;
        }

        if (newRoute.authRequired && !this.isAuthenticated()) {
            return this.redirectToLogin();
        }
        await this.loadContent(newRoute);
        this.initializeComponent(newRoute);
    }

    private showNotFound(): void {
        if (this.contentPageElement) {
            this.contentPageElement.innerHTML = `
                <div style="padding: 50px; text-align: center;">
                    <h1>404 - Страница не найдена</h1>
                    <a href="/" class="btn btn-primary">На главную</a>
                </div>
            `;
        }
    }

    private isAuthenticated(): boolean {
        return AuthUtils.isAuthenticated();
    }

    private redirectToLogin(): void {
        if (this.isRedirecting) return;
        this.isRedirecting = true;
        history.replaceState({}, '', '/login');
        this.activateRoute().finally(() => {
            this.isRedirecting = false;
        });
    }

    private async loadContent(route: Route): Promise<void> {
        if (route.title && this.titlePageElement) {
            this.titlePageElement.innerText = route.title;
        }

        if (route.filePathTemplate && this.contentPageElement) {
            let contentBlock: HTMLElement | null = this.contentPageElement;

            if (route.useLayout) {
                try {
                    const layoutHtml = await this.fetchTemplate(route.useLayout as string);
                    this.contentPageElement.innerHTML = layoutHtml;
                    contentBlock = document.getElementById('content-layout');
                } catch (error) {

                }
            }

            if (contentBlock && route.filePathTemplate) {
                try {
                    const templateHTML = await this.fetchTemplate(route.filePathTemplate);
                    contentBlock.innerHTML = templateHTML;
                } catch (error) {
                    contentBlock.innerHTML = `<p>Ошибка загрузки страницы: ${route.route}</p>`;
                }
            }
        }
    }

    private async fetchTemplate(url: string): Promise<string> {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load: ${url}`);
        return await response.text();
    }

    private initializeComponent(route: Route): void {
        setTimeout(() => {
            try {
                if (route.route === '/login') {
                    new Login(this.openNewRoute.bind(this));
                    return;
                }
                VisualUtils.SidebarMenu(route.route);
                VisualUtils.initBootstrap();

                if (route.useLayout) {
                    this.layout = new Layout(this.openNewRoute.bind(this));

                    (window as any).layoutInstance = this.layout;
                }

                if (route.load) {
                    route.load();
                } else {

                }
            } catch (error) {

            }
        }, 100);
    }
}