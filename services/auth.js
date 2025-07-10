class AuthService {
    constructor() {
        this.API_URL = '/api';
        this.axiosInstance = null;
        this.initializeAxios();
    }

    initializeAxios() {
        // Create a separate axios instance for auth endpoints (no token required)
        this.axiosInstance = axios.create({
            baseURL: this.API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add response interceptor for better error handling
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('Auth API error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    async login(credentials) {
        try {
            console.log('Attempting login with:', credentials.email);
            const response = await this.axiosInstance.post('/iam/login', {
                email: credentials.email,
                password: credentials.password
            });

            console.log('Login response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw new Error('Login failed');
        }
    }

    async register(credentials) {
        try {
            console.log('Attempting registration with:', credentials.email);
            const response = await this.axiosInstance.post('/iam/registro', {
                email: credentials.email,
                password: credentials.password,
                nombre: credentials.nombre
            });

            console.log('Registration response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw new Error('Registration failed');
        }
    }

    async refreshToken(refreshToken) {
        try {
            console.log('Attempting token refresh...');
            const response = await this.axiosInstance.post('/iam/refresh', {
                refresh: refreshToken
            });

            console.log('Token refresh response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Token refresh error:', error.response?.data || error.message);
            throw new Error('Token refresh failed');
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
        if (token) {
            localStorage.setItem('token', token);
            console.log('Token saved successfully');
        } else {
            console.error('Attempted to save null/undefined token');
        }
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    setRefreshToken(refreshToken) {
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
            console.log('Refresh token saved successfully');
        } else {
            console.error('Attempted to save null/undefined refresh token');
        }
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    // Get user info from token (mock implementation)
    getCurrentUser() {
        const token = this.getToken();
        if (!token) return null;
        
        // Decode JWT token to check expiration
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', payload);
            console.log('Token expires at:', new Date(payload.exp * 1000));
            console.log('Current time:', new Date());
            console.log('Token is expired:', payload.exp * 1000 < Date.now());
            
            if (payload.exp * 1000 < Date.now()) {
                console.warn('Token is expired!');
                this.logout();
                return null;
            }
            
            return {
                id: payload.nameid || payload.sub,
                email: payload.email,
                name: 'Usuario'
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
}

// Create global instance
const authService = new AuthService();