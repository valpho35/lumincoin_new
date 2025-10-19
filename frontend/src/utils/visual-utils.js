export class VisualUtils {
    static SidebarMenu(url) {
        console.log('SidebarMenu called with url:', url);

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

            collapse.classList.remove('show');
            collapseBtn.classList.add('collapsed');
            collapseBtn.classList.remove('active');

        } else if (url === '/operations') {
            const operationsLink = document.querySelector('.nav-item a[href="/operations"]');
            if (operationsLink) {
                operationsLink.classList.add('active');
            }
        } else if (url === '/income' || url === '/expenses') {
            collapse.classList.add('show');
            collapseBtn.classList.add('active');
            collapseBtn.classList.remove('collapsed');

            const activeLink = document.querySelector(`.nav-item a[href="${url}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

 static initBootstrap() {

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