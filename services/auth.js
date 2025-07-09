class AuthService {
    constructor() {
        this.API_URL = '/api';
    }

    async login(credentials) {
        try {
            const response = await fetch(`${this.API_URL}/iam/login`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(credentials) {
        try {
            const response = await fetch(`${this.API_URL}/iam/registro`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    async refreshToken(refreshToken) {
        try {
            const response = await fetch(`${this.API_URL}/iam/refresh`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.hash = '#/login';
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    setRefreshToken(refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    // Get user info from token (mock implementation)
    getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;
        
        // In a real app, you would decode the JWT token
        return {
            id: 1,
            email: 'user@example.com',
            name: 'Usuario'
        };
    }
}

// Create global instance
const authService = new AuthService();