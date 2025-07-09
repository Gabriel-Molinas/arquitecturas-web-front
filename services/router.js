class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        // Don't handle route change on load here - do it after initialization
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRouteChange() {
        const hash = window.location.hash.slice(1) || '/';
        const [path, ...params] = hash.split('/');
        
        this.currentRoute = {
            path: `/${path}`,
            params: params
        };

        console.log('Current route:', this.currentRoute);

        // Check authentication for protected routes
        if (this.isProtectedRoute(this.currentRoute.path) && !authService.isAuthenticated()) {
            this.navigate('#/login');
            return;
        }

        // Redirect to dashboard if authenticated and trying to access login
        if (this.currentRoute.path === '/login' && authService.isAuthenticated()) {
            this.navigate('#/dashboard');
            return;
        }

        // Find and execute route handler
        const handler = this.routes[this.currentRoute.path];
        if (handler) {
            try {
                handler(this.currentRoute.params);
            } catch (error) {
                console.error('Error executing route handler:', error);
                this.showError('Error al cargar la página');
            }
        } else {
            // Default route
            if (authService.isAuthenticated()) {
                this.navigate('#/dashboard');
            } else {
                this.navigate('#/login');
            }
        }
    }

    showError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="flex justify-center items-center min-h-screen">
                <div class="text-red-600 text-center">
                    <h2 class="text-xl font-bold mb-2">Error</h2>
                    <p>${message}</p>
                    <button onclick="router.navigate('#/login')" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                        Volver al Login
                    </button>
                </div>
            </div>
        `;
    }

    isProtectedRoute(path) {
        const protectedRoutes = ['/dashboard', '/users', '/privileges', '/user-form'];
        return protectedRoutes.includes(path);
    }

    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Create global router instance
const router = new Router();

// Define routes immediately
router.addRoute('/login', () => {
    renderLogin();
});

router.addRoute('/dashboard', () => {
    renderDashboard();
});

router.addRoute('/users', () => {
    renderUsers();
});

router.addRoute('/privileges', () => {
    renderPrivileges();
});

router.addRoute('/user-form', (params) => {
    const userId = params[0]; // /user-form/123
    renderUserForm(userId);
});

// Initialize router when all scripts are loaded
setTimeout(() => {
    router.handleRouteChange();
}, 100);

// Helper function to clear app content
function clearApp() {
    const app = document.getElementById('app');
    app.innerHTML = '';
}

// Helper function to show loading
function showLoading() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex justify-center items-center min-h-screen">
            <div class="spinner"></div>
        </div>
    `;
}