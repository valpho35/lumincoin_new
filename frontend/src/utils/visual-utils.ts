declare const bootstrap: any;

export class VisualUtils {
    static SidebarMenu(url: string): void {
        if (url === '/logout') {
            return;
        }

        const collapse = document.querySelector('#categoriesCollapse');
        const collapseBtn = document.querySelector('#categoryMenu');
        const links = document.querySelectorAll('.nav-item a');

        links.forEach(link => {
            link.classList.remove('active');
        });

        if (url === '/') {
            const mainLink = document.querySelector('.nav-item a[href="/"]');
            if (mainLink) {
                mainLink.classList.add('active');
            }

            if (collapse) collapse.classList.remove('show');
            if (collapseBtn) {
                collapseBtn.classList.add('collapsed');
                collapseBtn.classList.remove('active');
            }

        } else if (url === '/operations') {
            const operationsLink = document.querySelector('.nav-item a[href="/operations"]');
            if (operationsLink) {
                operationsLink.classList.add('active');
            }

            if (collapse) collapse.classList.remove('show');
            if (collapseBtn) {
                collapseBtn.classList.add('collapsed');
                collapseBtn.classList.remove('active');
            }

        } else if (url === '/income' || url === '/create-income-cat' || url === '/edit-income-cat') {
            console.log('Highlighting income category');

            if (collapse) collapse.classList.add('show');
            if (collapseBtn) {
                collapseBtn.classList.add('active');
                collapseBtn.classList.remove('collapsed');
            }

            const incomeLink = document.querySelector('.nav-item a[href="/income"]');
            if (incomeLink) {
                incomeLink.classList.add('active');
            }
        }
        else if (url === '/expenses' || url === '/create-expense-cat' || url === '/edit-expense-cat') {

            if (collapse) collapse.classList.add('show');
            if (collapseBtn) {
                collapseBtn.classList.add('active');
                collapseBtn.classList.remove('collapsed');
            }

            const expensesLink = document.querySelector('.nav-item a[href="/expenses"]');
            if (expensesLink) {
                expensesLink.classList.add('active');
            }
        }
    }

    static initBootstrap(): void {
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            try {
                new bootstrap.Dropdown(dropdown);
            } catch (e) {
                console.log('Dropdown init error:', e);
            }
        });

        const collapses = document.querySelectorAll('.collapse');
        collapses.forEach(collapse => {
            try {
                new bootstrap.Collapse(collapse, { toggle: false });
            } catch (e) {
                console.log('Collapse init error:', e);
            }
        });
    }
}