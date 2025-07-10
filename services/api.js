// Import axios using script tag in HTML or use a CDN
// For now, we'll create an axios instance when the script loads

class ApiService {
    constructor() {
        this.API_URL = '/api';
        this.axiosInstance = null;
        this.initializeAxios();
    }

    initializeAxios() {
        // Initialize axios instance with default config
        this.axiosInstance = axios.create({
            baseURL: this.API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Request interceptor to add auth token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = authService.getToken();
                
                // Validate token exists for protected endpoints
                if (!token && !config.url.includes('/iam/')) {
                    console.error('No token available for protected endpoint:', config.url);
                    authService.logout();
                    throw new Error('Authentication required');
                }
                
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                
                console.log('Making request to:', config.baseURL + config.url);
                console.log('With headers:', config.headers);
                
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle 401 errors and token refresh
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    console.warn('401 Unauthorized - Token may be invalid or expired');
                    originalRequest._retry = true;

                    const refreshToken = authService.getRefreshToken();
                    if (refreshToken) {
                        try {
                            console.log('Attempting to refresh token...');
                            const refreshResponse = await authService.refreshToken(refreshToken);
                            
                            if (refreshResponse.token) {
                                authService.setToken(refreshResponse.token);
                                if (refreshResponse.refreshToken) {
                                    authService.setRefreshToken(refreshResponse.refreshToken);
                                }
                                
                                // Retry the original request with new token
                                originalRequest.headers.Authorization = `Bearer ${refreshResponse.token}`;
                                return this.axiosInstance(originalRequest);
                            }
                        } catch (refreshError) {
                            console.error('Token refresh failed:', refreshError);
                        }
                    }
                    
                    authService.logout();
                    throw new Error('Authentication failed');
                }

                console.error('API request error:', error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    async request(url, options = {}) {
        try {
            const response = await this.axiosInstance({
                url,
                method: options.method || 'GET',
                data: options.body ? JSON.parse(options.body) : undefined,
                ...options
            });
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Books API
    async getBooks() {
        return await this.request('/books');
    }

    async createBook(book) {
        return await this.request('/books', {
            method: 'POST',
            body: JSON.stringify(book),
        });
    }

    async updateBook(id, book) {
        return await this.request(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(book),
        });
    }

    async deleteBook(id) {
        return await this.request(`/books/${id}`, {
            method: 'DELETE',
        });
    }

    // Mock Users API (since it's not in the OpenAPI spec)
    async getUsers() {
        // Mock data - in real app this would call the actual API
        return [
            { id: 1, userName: 'admin', email: 'admin@example.com', createdAt: '2024-01-01' },
            { id: 2, userName: 'user1', email: 'user1@example.com', createdAt: '2024-01-02' },
            { id: 3, userName: 'user2', email: 'user2@example.com', createdAt: '2024-01-03' },
        ];
    }

    async createUser(user) {
        // Mock implementation
        console.log('Creating user:', user);
        return { id: Date.now(), ...user };
    }

    async updateUser(id, user) {
        // Mock implementation
        console.log('Updating user:', id, user);
        return { id, ...user };
    }

    async deleteUser(id) {
        // Mock implementation
        console.log('Deleting user:', id);
        return { success: true };
    }

    async getUserById(id) {
        // Mock implementation
        return {
            id: parseInt(id),
            userName: 'usuario_ejemplo',
            email: 'usuario@example.com',
            privileges: [1, 3]
        };
    }

    // Mock Privileges API
    async getPrivileges() {
        // Mock data
        return [
            { id: 1, description: 'Administrador', createdAt: '2024-01-01' },
            { id: 2, description: 'Editor', createdAt: '2024-01-02' },
            { id: 3, description: 'Lector', createdAt: '2024-01-03' },
            { id: 4, description: 'Moderador', createdAt: '2024-01-04' },
        ];
    }

    async createPrivilege(privilege) {
        // Mock implementation
        console.log('Creating privilege:', privilege);
        return { id: Date.now(), ...privilege, createdAt: new Date().toISOString().split('T')[0] };
    }

    async updatePrivilege(id, privilege) {
        // Mock implementation
        console.log('Updating privilege:', id, privilege);
        return { id, ...privilege };
    }

    async deletePrivilege(id) {
        // Mock implementation
        console.log('Deleting privilege:', id);
        return { success: true };
    }
}

// Create global instance
const apiService = new ApiService();